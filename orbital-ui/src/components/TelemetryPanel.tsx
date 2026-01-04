"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

interface TelemetryPanelProps {
    data: {
        coordinates: { x: number; y: number };
        rgb: { r: number; g: number; b: number };
        analysis: Array<{ name: string; value: number }>;
    } | null;
    loading: boolean;
}

export const TelemetryPanel = ({ data, loading }: TelemetryPanelProps) => {
    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-black/40 backdrop-blur-md rounded-2xl border border-orange-500/20 p-8">
                <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                <p className="mt-4 text-orange-200/60 font-mono text-xs uppercase tracking-widest">Analizando espectro...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="h-full flex items-center justify-center bg-black/40 backdrop-blur-md rounded-2xl border border-orange-500/10 p-8 text-center text-zinc-500 font-mono text-sm leading-relaxed italic">
                &quot;Seleccione un punto de interés en el visor para procesar datos espectrales&quot;
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-black/40 backdrop-blur-xl rounded-2xl border border-orange-500/20 p-6 shadow-2xl flex flex-col h-full"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-orange-500 font-bold uppercase tracking-tighter text-lg">Resultados de Scan</h3>
                <div className="bg-orange-500/20 px-3 py-1 rounded text-[10px] font-bold text-orange-400 border border-orange-500/20 uppercase">
                    Verificado
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <p className="text-[10px] text-zinc-500 uppercase mb-1">Red</p>
                    <p className="text-2xl font-bold font-mono text-red-500">{data.rgb.r}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <p className="text-[10px] text-zinc-500 uppercase mb-1">Green</p>
                    <p className="text-2xl font-bold font-mono text-green-500">{data.rgb.g}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <p className="text-[10px] text-zinc-500 uppercase mb-1">Blue</p>
                    <p className="text-2xl font-bold font-mono text-blue-500">{data.rgb.b}</p>
                </div>
            </div>

            <div className="flex-1 min-h-[250px] mb-6">
                <p className="text-[10px] text-orange-500/60 uppercase font-mono mb-4 tracking-widest">Spectral Analysis (%)</p>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.analysis}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke="#ffffff40" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#000', border: '1px solid #f9731633', borderRadius: '8px', fontSize: '12px' }}
                            itemStyle={{ color: '#f97316' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#f97316" fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="space-y-4">
                {data.analysis.map((item: { name: string; value: number }, i: number) => (
                    <div key={i} className="flex items-center justify-between group">
                        <span className="text-xs text-zinc-400 group-hover:text-orange-400 transition-colors uppercase font-mono">{item.name}</span>
                        <div className="flex items-center gap-3 flex-1 px-4">
                            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.value}%` }}
                                    className="h-full bg-orange-500"
                                />
                            </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-orange-200">{item.value}%</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
