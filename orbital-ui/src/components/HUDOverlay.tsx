import React from 'react';
import { Orbit, Activity, Microscope, Zap } from 'lucide-react';

export const HUDOverlay = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {/* Corner Brackets */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-orange-500/50" />
            <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-orange-500/50" />
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-orange-500/50" />
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-orange-500/50" />

            {/* Mission Data Sidebar (Left) */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 bg-black/40 backdrop-blur-md p-4 rounded-lg border border-orange-500/20 pointer-events-auto">
                <div className="flex flex-col items-center gap-1 group">
                    <div className="p-2 rounded-full border border-orange-500/40 text-orange-400">
                        <Orbit size={20} />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-orange-500/60">Orbit</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className="p-2 rounded-full border border-orange-500/40 text-orange-400">
                        <Activity size={20} />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-orange-500/60">Data</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className="p-2 rounded-full border border-orange-500/40 text-orange-400">
                        <Microscope size={20} />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-orange-500/60">Scan</span>
                </div>
            </div>

            {/* Top Status Bar */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-orange-500/20 flex items-center gap-8 pointer-events-auto">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-xs font-mono text-orange-400 uppercase tracking-widest">Connection: Active</span>
                </div>
                <div className="w-[1px] h-4 bg-orange-500/20" />
                <div className="flex items-center gap-2 text-xs font-mono text-orange-200">
                    <Zap size={14} className="text-orange-500" />
                    <span>POWER: 98.4%</span>
                </div>
            </div>
        </div>
    );
};
