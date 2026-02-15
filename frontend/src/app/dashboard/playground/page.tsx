import EvaluatorTool from "../../../components/EvaluatorTool";
import Link from "next/link";

export default function PlaygroundPage() {
    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Playground</h1>
                    <p className="text-sm text-gray-500 mt-1">Test AI agent responses against compliance scenarios.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/results" className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors border border-gray-200">
                        View History
                    </Link>
                </div>
            </div>
            <EvaluatorTool />
        </div>
    );
}

