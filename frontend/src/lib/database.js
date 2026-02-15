const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

console.log('[DatabaseService] Module loaded!');

class DatabaseService {
    constructor(dbPath) {
        // Point to evaluations.db in the frontend root (process.cwd() in Next.js)
        this.dbPath = dbPath || path.join(process.cwd(), 'evaluations.db');
        console.log(`[DB] Constructor called. Path: ${this.dbPath}`);
        console.log(`[DB] Exists: ${fs.existsSync(this.dbPath)}`);
        this.db = null;
        this.initPromise = this.initialize();
    }

    async initialize() {
        const SQL = await initSqlJs();
        const dbDir = path.dirname(this.dbPath);
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        try {
            if (fs.existsSync(this.dbPath)) {
                const buffer = fs.readFileSync(this.dbPath);
                this.db = new SQL.Database(buffer);
                console.log('✅ Loaded existing database');
            } else {
                this.db = new SQL.Database();
                console.log('✅ Created new database');
            }
        } catch (error) {
            console.error('Database initialization error:', error);
            this.db = new SQL.Database();
        }

        this.initializeTables();
        this.migrate();
    }

    migrate() {
        try {
            // Attempt to add user_id column if it doesn't exist
            // SQLite doesn't support IF NOT EXISTS for ADD COLUMN in all versions, 
            // so we try and catch the error if it exists.
            try { this.db.run("ALTER TABLE evaluations ADD COLUMN user_id TEXT"); } catch (e) { }
            try { this.db.run("ALTER TABLE personas ADD COLUMN user_id TEXT"); } catch (e) { }
            this.saveDatabase();
        } catch (error) {
            console.error('Migration error:', error);
        }
    }

    initializeTables() {
        // Evaluations table
        this.db.run(`
      CREATE TABLE IF NOT EXISTS evaluations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        scenario_id TEXT NOT NULL,
        scenario_name TEXT,
        agent_name TEXT,
        team_org TEXT,
        persona_id INTEGER,
        
        intent TEXT,
        policy TEXT,
        hallucination TEXT,
        tone TEXT,
        escalation TEXT,
        overall TEXT,
        reasoning TEXT,
        
        response_length INTEGER,
        keyword_coverage REAL,
        sentiment_score REAL,
        readability_score REAL,
        compliance_score INTEGER,
        
        raw_response TEXT,
        user_message TEXT,
        
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        duration_ms INTEGER
      )
    `);

        // Personas table
        this.db.run(`
      CREATE TABLE IF NOT EXISTS personas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        name TEXT NOT NULL,
        communication_style TEXT,
        tone TEXT,
        characteristics TEXT,
        sample_phrases TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        this.insertDefaultPersonas();
    }

    // ... (insertDefaultPersonas, saveDatabase, rowToObject unchanged)
    insertDefaultPersonas() {
        const count = this.db.exec('SELECT COUNT(*) FROM personas')[0].values[0][0];
        if (count === 0) {
            // Default built-in personas have NULL user_id (public/system)
            const stmt = this.db.prepare('INSERT INTO personas (name, communication_style, tone, characteristics, sample_phrases) VALUES (?, ?, ?, ?, ?)');

            const defaults = [
                ['Frustrated Customer', 'direct', 'angry', '["demanding","impatient"]', '["I want a refund now","This is unacceptable"]'],
                ['Confused Customer', 'verbose', 'uncertain', '["wavering","repetitive"]', '["I do not understand","Can you explain again?"]'],
                ['Polite Customer', 'formal', 'friendly', '["patient","clear"]', '["Thank you for your help","I would appreciate it if..."]']
            ];

            defaults.forEach(p => stmt.run(p));
            stmt.free();
            this.saveDatabase();
        }
    }

    saveDatabase() {
        if (!this.db) return;
        const data = this.db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(this.dbPath, buffer);
    }

    rowToObject(columns, values) {
        const obj = {};
        columns.forEach((col, i) => {
            obj[col] = values[i];
        });
        return obj;
    }

    async createEvaluation(data) {
        await this.initPromise;
        const keys = Object.keys(data).filter(k => k !== 'id' && k !== 'timestamp');
        const values = keys.map(k => data[k]);
        const placeholders = keys.map(() => '?').join(',');

        const sql = `INSERT INTO evaluations (${keys.join(',')}) VALUES (${placeholders})`;
        const stmt = this.db.prepare(sql);
        stmt.run(values);
        stmt.free();

        this.saveDatabase();
        const lastId = this.db.exec("SELECT last_insert_rowid()")[0].values[0][0];
        return this.getEvaluation(lastId);
    }

    async getEvaluation(id) {
        await this.initPromise;
        try {
            const stmt = this.db.prepare('SELECT * FROM evaluations WHERE id = ?');
            stmt.bind([id]);
            let result = null;
            if (stmt.step()) {
                result = stmt.getAsObject();
            }
            stmt.free();
            return result;
        } catch (error) {
            console.error('getEvaluation error:', error);
            return null;
        }
    }

    async getEvaluations(filters = {}, userId = null) {
        await this.initPromise;
        let query = 'SELECT * FROM evaluations WHERE 1=1';
        const params = [];

        if (userId) {
            query += ' AND user_id = ?';
            params.push(userId);
        }

        if (filters.scenario_id) {
            query += ' AND scenario_id = ?';
            params.push(filters.scenario_id);
        }
        if (filters.persona_id) {
            query += ' AND persona_id = ?';
            params.push(filters.persona_id);
        }
        if (filters.overall) {
            query += ' AND overall = ?';
            params.push(filters.overall);
        }

        query += ' ORDER BY timestamp DESC';

        if (filters.limit) {
            query += ' LIMIT ?';
            params.push(filters.limit);
        }

        try {
            const stmt = this.db.prepare(query);
            if (params.length > 0) stmt.bind(params);
            const results = [];
            while (stmt.step()) {
                results.push(stmt.getAsObject());
            }
            stmt.free();
            return results;
        } catch (error) {
            console.error('getEvaluations error:', error);
            return [];
        }
    }

    async deleteEvaluation(id, userId = null) {
        await this.initPromise;
        try {
            let sql = 'DELETE FROM evaluations WHERE id = ?';
            const params = [id];

            if (userId) {
                sql += ' AND user_id = ?';
                params.push(userId);
            }

            const stmt = this.db.prepare(sql);
            stmt.run(params);
            const modified = this.db.getRowsModified();
            stmt.free();
            this.saveDatabase();
            return { success: modified > 0 };
        } catch (e) {
            console.error('Delete error', e);
            throw e;
        }
    }

    async getPersonas(userId = null) {
        await this.initPromise;
        // Return system personas (user_id IS NULL) AND user personas
        let sql = "SELECT * FROM personas WHERE user_id IS NULL";
        const params = [];

        if (userId) {
            sql += " OR user_id = ?";
            params.push(userId);
        }

        const stmt = this.db.prepare(sql);
        if (userId) stmt.bind(params);

        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
    }

    async getAnalytics(userId = null) {
        await this.initPromise;

        const queryAll = (sql, params = []) => {
            try {
                const stmt = this.db.prepare(sql);
                if (params.length > 0) stmt.bind(params);
                const results = [];
                while (stmt.step()) {
                    results.push(stmt.getAsObject());
                }
                stmt.free();
                return results;
            } catch (e) {
                console.error('Analytics query error:', e);
                return [];
            }
        };

        const whereClause = userId ? 'WHERE user_id = ?' : '';
        const params = userId ? [userId] : [];

        const totalRows = queryAll(`SELECT COUNT(*) as count FROM evaluations ${whereClause}`, params);
        const total = totalRows.length ? totalRows[0].count : 0;

        const passFailRows = queryAll(`
            SELECT 
                overall,
                COUNT(*) as count,
                ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM evaluations ${whereClause}), 2) as percentage
            FROM evaluations
            ${whereClause}
            GROUP BY overall
        `, userId ? [userId, userId] : []);

        const passFailObj = {};
        passFailRows.forEach(row => {
            passFailObj[row.overall] = { count: row.count, percentage: row.percentage };
        });
        if (!passFailObj.PASS) passFailObj.PASS = { count: 0, percentage: 0 };
        if (!passFailObj.FAIL) passFailObj.FAIL = { count: 0, percentage: 0 };

        const byScenarioRows = queryAll(`
            SELECT 
                scenario_name,
                COUNT(*) as total,
                SUM(CASE WHEN overall = 'PASS' THEN 1 ELSE 0 END) as passed,
                SUM(CASE WHEN overall = 'FAIL' THEN 1 ELSE 0 END) as failed,
                ROUND(SUM(CASE WHEN overall = 'PASS' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as pass_rate
            FROM evaluations
            ${whereClause}
            GROUP BY scenario_name
        `, params);

        const avgRows = queryAll(`SELECT ROUND(AVG(compliance_score), 1) as avg FROM evaluations ${whereClause ? whereClause + ' AND' : 'WHERE'} compliance_score IS NOT NULL`, params);
        const averageScore = (avgRows.length && avgRows[0].avg != null) ? avgRows[0].avg : 0;

        return {
            total,
            passed: passFailObj.PASS.count,
            failed: passFailObj.FAIL.count,
            passRate: total > 0 ? Math.round((passFailObj.PASS.count / total) * 100) : 0,
            averageScore,
            passFail: passFailObj,
            byScenario: byScenarioRows,
            trends: []
        };
    }
}

module.exports = DatabaseService;
