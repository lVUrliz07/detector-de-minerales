"use client";

import React, { useState } from "react";
import { HUDOverlay } from "@/components/HUDOverlay";
import { MarsViewer } from "@/components/MarsViewer";
import { TelemetryPanel } from "@/components/TelemetryPanel";
import { motion } from "framer-motion";

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [imagePath, setImagePath] = useState<string | undefined>();
  const [analysisData, setAnalysisData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const resp = await fetch("http://localhost:3001/telemetry/upload", {
        method: "POST",
        body: formData,
      });
      const data = await resp.json();
      setImageUrl(`http://localhost:3001/${data.path}`);
      setImagePath(data.path);
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  const handlePointSelected = async (x: number, y: number, path: string) => {
    setLoading(true);
    try {
      const resp = await fetch("http://localhost:3001/telemetry/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x, y, imagePath: path }),
      });
      const data = await resp.json();
      setAnalysisData(data);
    } catch (err) {
      console.error("Error analyzing pixel:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0604] relative overflow-hidden flex flex-col p-8 md:p-12">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-950/20 blur-[150px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-900/10 blur-[120px] -z-10 rounded-full" />

      <HUDOverlay />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-4">
          <div className="h-10 w-1 bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">
            Orbital<span className="text-orange-500">Scan</span>
          </h1>
        </div>
        <p className="mt-2 text-zinc-500 font-mono text-sm tracking-widest uppercase ml-5 border-l border-zinc-800 pl-4 py-1">
          Surface Lithology Analyzer / Mission Control
        </p>
      </motion.div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <MarsViewer
            imageUrl={imageUrl}
            imagePath={imagePath}
            onUpload={handleUpload}
            onPointSelected={handlePointSelected}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-colors">
              <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest block mb-2">Latitude</span>
              <span className="text-xl font-mono text-white">18.65° N</span>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-colors">
              <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest block mb-2">Longitude</span>
              <span className="text-xl font-mono text-white">226.2° E</span>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-colors">
              <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest block mb-2">Site Name</span>
              <span className="text-xl font-mono text-white uppercase italic">Olympus Planum</span>
            </div>
          </div>
        </div>

        <div className="h-full">
          <TelemetryPanel data={analysisData} loading={loading} />
        </div>
      </div>

      <footer className="mt-12 flex justify-between items-end border-t border-white/5 pt-6 pointer-events-none">
        <div className="space-y-1">
          <p className="text-[10px] font-mono text-zinc-700 uppercase">System Status: Nominal</p>
          <p className="text-[10px] font-mono text-zinc-700 uppercase">Local Time: SOL-824 14:23:05</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-orange-500/40 uppercase tracking-[0.2em]">Deep Space Network Link 01-A</p>
        </div>
      </footer>
    </main>
  );
}
