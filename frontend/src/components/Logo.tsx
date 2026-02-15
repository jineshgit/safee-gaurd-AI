import React from "react";

export const Logo = ({ className = "w-8 h-8", color = "text-blue-500" }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            {/* Abstract Shield / Cube Logo */}
            <svg
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                {/* Outer Shield/Hexagon */}
                <path
                    d="M16 2L3 9V16C3 23 9 28 16 31C23 28 29 23 29 16V9L16 2Z"
                    className="stroke-white/20"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Core Node */}
                <circle cx="16" cy="16" r="4" className={color} fill="currentColor">
                    <animate
                        attributeName="opacity"
                        values="0.5;1;0.5"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                </circle>
                {/* Circuit Lines */}
                <path d="M16 20V24" stroke="currentColor" className={color} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M16 8V12" stroke="currentColor" className={color} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M20 16H24" stroke="currentColor" className={color} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8 16H12" stroke="currentColor" className={color} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        </div>
    );
};
