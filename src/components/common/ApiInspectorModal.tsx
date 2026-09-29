"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  X,
  Sparkles,
  Terminal,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  BrainCircuit,
  Flame,
  Cpu,
  Route,
} from "lucide-react";

export default function ApiInspectorModal() {
  const { isApiInspectorOpen, setIsApiInspectorOpen } = useApp();
  const [activeEndpoint, setActiveEndpoint] = useState<"demand" | "spoilage" | "anomaly" | "route">("demand");
  const [isLoading, setIsLoading] = useState(false);
  const [responseJson, setResponseJson] = useState<Record<string, unknown> | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Form states for each API
  const [demandFactors, setDemandFactors] = useState<string[]>(["exam_week", "rain_forecast"]);
  const [spoilageCrop, setSpoilageCrop] = useState("Tomatoes");
  const [spoilageTemp, setSpoilageTemp] = useState(13.1);
  const [machinePeelThickness, setMachinePeelThickness] = useState(2.8);
  const [routePayload, setRoutePayload] = useState(107);

  if (!isApiInspectorOpen) return null;

  const handleExecute = async () => {
    setIsLoading(true);
    const startTime = performance.now();

    try {
      let url = "";
      let payload = {};

      if (activeEndpoint === "demand") {
        url = "/api/predict/demand";
        payload = {
          institutionId: "IITD-MESS-01",
          date: "2026-09-22",
          factors: demandFactors,
        };
      } else if (activeEndpoint === "spoilage") {
        url = "/api/predict/spoilage";
        payload = {
          batchCode: "TOM-2024-0234",
          crop: spoilageCrop,
          tempCelsius: spoilageTemp,
          ageDays: 6,
        };
      } else if (activeEndpoint === "anomaly") {
        url = "/api/machines/anomaly";
        payload = {
          machineId: "PM-03",
          peelThicknessMm: machinePeelThickness,
        };
      } else if (activeEndpoint === "route") {
        url = "/api/routes/optimize";
        payload = {
          origin: "IIT Delhi Central Mess (Aravali)",
          currentPayloadKg: routePayload,
          vehicleCapacityKg: 200,
        };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const endTime = performance.now();
      setLatencyMs(Math.round(endTime - startTime));
      setResponseJson(data);
    } catch {
      setResponseJson({ error: "Failed to query AI endpoint" });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!responseJson) return;
    navigator.clipboard.writeText(JSON.stringify(responseJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const endpoints = [
    {
      id: "demand" as const,
      name: "Demand Forecaster",
      method: "POST",
      path: "/api/predict/demand",
      icon: BrainCircuit,
      color: "#10B981",
    },
    {
      id: "spoilage" as const,
      name: "Predictive Spoilage",
      method: "POST",
      path: "/api/predict/spoilage",
      icon: Flame,
      color: "#EF4444",
    },
    {
      id: "anomaly" as const,
      name: "Machinery Anomaly",
      method: "POST",
      path: "/api/machines/anomaly",
      icon: Cpu,
      color: "#F59E0B",
    },
    {
      id: "route" as const,
      name: "Route Optimizer",
      method: "POST",
      path: "/api/routes/optimize",
      icon: Route,
      color: "#00D4AA",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-4xl bg-[#0F1629] border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00D4AA]/10 border border-[#00D4AA]/20 flex items-center justify-center text-[#00D4AA]">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">AI / ML Live Microservice Inspector</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono-data px-2 py-0.5 rounded font-bold">
                  LIVE REST API
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Interactive evaluation console: Verify machine learning inference &amp; heuristics
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsApiInspectorOpen(false)}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Endpoint Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-2 bg-black/40 border-b border-white/10 text-xs">
          {endpoints.map((ep) => {
            const Icon = ep.icon;
            const isActive = activeEndpoint === ep.id;
            return (
              <button
                key={ep.id}
                onClick={() => {
                  setActiveEndpoint(ep.id);
                  setResponseJson(null);
                  setLatencyMs(null);
                }}
                className={`p-2.5 rounded-xl text-left transition-all flex items-center gap-2.5 ${
                  isActive
                    ? "bg-white/10 border border-white/20 text-white font-bold shadow-sm"
                    : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" style={{ color: ep.color }} />
                <div className="truncate">
                  <div className="truncate">{ep.name}</div>
                  <div className="text-[10px] font-mono-data opacity-70 truncate">{ep.path}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Two Columns: Input Form (Left) & JSON Response (Right) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-white/10">
          {/* LEFT: Payload Configuration (5 cols) */}
          <div className="md:col-span-5 p-6 space-y-5 bg-white/[0.01]">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                Configure Inference Payload
              </h3>
              <p className="text-[11px] text-[#94A3B8]">
                Simulate edge telemetries and see how the model adapts its decision logic
              </p>
            </div>

            {activeEndpoint === "demand" && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-semibold">Contextual Factors</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={demandFactors.includes("exam_week")}
                        onChange={(e) => {
                          if (e.target.checked) setDemandFactors([...demandFactors, "exam_week"]);
                          else setDemandFactors(demandFactors.filter((f) => f !== "exam_week"));
                        }}
                        className="rounded border-white/20 text-[#00D4AA] focus:ring-0"
                      />
                      <span>Exam Week (+12% attendance spike)</span>
                    </label>
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={demandFactors.includes("rain_forecast")}
                        onChange={(e) => {
                          if (e.target.checked) setDemandFactors([...demandFactors, "rain_forecast"]);
                          else setDemandFactors(demandFactors.filter((f) => f !== "rain_forecast"));
                        }}
                        className="rounded border-white/20 text-[#00D4AA] focus:ring-0"
                      />
                      <span>Heavy Rain Forecast (-5% dinner dine-in)</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeEndpoint === "spoilage" && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-semibold">Perishable Commodity</label>
                  <select
                    value={spoilageCrop}
                    onChange={(e) => setSpoilageCrop(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#070B16] border border-white/10 text-white focus:outline-none"
                  >
                    <option value="Tomatoes">Tomatoes (High respiration)</option>
                    <option value="Potatoes">Potatoes (Medium starch decay)</option>
                    <option value="Onions">Onions (Low moisture)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-semibold">
                    Current Temperature: <span className="text-red-400 font-mono-data">{spoilageTemp}°C</span>
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="22"
                    step="0.5"
                    value={spoilageTemp}
                    onChange={(e) => setSpoilageTemp(Number(e.target.value))}
                    className="w-full accent-red-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#94A3B8] mt-1">
                    <span>4°C (Optimal)</span>
                    <span>10°C (Critical Drift)</span>
                    <span>22°C (Rapid Spoilage)</span>
                  </div>
                </div>
              </div>
            )}

            {activeEndpoint === "anomaly" && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-semibold">
                    Sensor Caliper Thickness:{" "}
                    <span className="text-amber-400 font-mono-data">{machinePeelThickness} mm</span>
                  </label>
                  <input
                    type="range"
                    min="1.0"
                    max="3.5"
                    step="0.1"
                    value={machinePeelThickness}
                    onChange={(e) => setMachinePeelThickness(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#94A3B8] mt-1">
                    <span>1.0mm (Tight)</span>
                    <span>1.5mm (Spec Benchmark)</span>
                    <span>3.5mm (Heavy Peel Waste)</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200">
                  {machinePeelThickness > 1.6 ? (
                    <span>⚠️ Thickness &gt; 1.6mm triggers preventative inspection work order.</span>
                  ) : (
                    <span>✅ Within nominal peeling tolerance. Machine health optimal.</span>
                  )}
                </div>
              </div>
            )}

            {activeEndpoint === "route" && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-semibold">
                    Surplus Batch Load: <span className="text-[#00D4AA] font-mono-data">{routePayload} kg</span>
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="200"
                    step="5"
                    value={routePayload}
                    onChange={(e) => setRoutePayload(Number(e.target.value))}
                    className="w-full accent-[#00D4AA] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#94A3B8] mt-1">
                    <span>20 kg</span>
                    <span>100 kg</span>
                    <span>200 kg (Max Van Capacity)</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-[11px] text-[#94A3B8]">
                  Solves multi-drop Vehicle Routing Problem ensuring arrival within the 2-hour FSSAI safety window.
                </div>
              </div>
            )}

            <button
              onClick={handleExecute}
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#00D4AA] hover:bg-[#00D4AA]/90 text-[#0A0F1E] font-bold text-xs shadow-lg shadow-[#00D4AA]/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-[#0A0F1E] border-t-transparent rounded-full animate-spin" />
                  Running Neural / OR Model...
                </span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute AI Inference</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT: Raw JSON Response Inspector (7 cols) */}
          <div className="md:col-span-7 p-6 flex flex-col justify-between bg-[#070B16]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Model Output Response
                  </span>
                  {latencyMs !== null && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-data font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                      ⚡ {latencyMs}ms Latency
                    </span>
                  )}
                </div>

                {Boolean(responseJson) && (
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 text-xs text-[#94A3B8] hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 transition-colors"
                  >
                    {copied ? <Check className="w-3 h-3 text-[#00D4AA]" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? "Copied" : "Copy JSON"}</span>
                  </button>
                )}
              </div>

              {responseJson ? (
                <pre className="p-4 rounded-xl bg-black/80 border border-white/10 text-emerald-400 font-mono-data text-xs max-h-[380px] overflow-auto leading-relaxed scrollbar-thin">
                  {JSON.stringify(responseJson, null, 2)}
                </pre>
              ) : (
                <div className="p-8 rounded-xl border border-dashed border-white/10 text-center text-xs text-[#94A3B8] space-y-2">
                  <Sparkles className="w-6 h-6 text-[#00D4AA] mx-auto opacity-60" />
                  <div className="font-semibold text-white">No active inference call executed yet</div>
                  <p className="max-w-xs mx-auto text-[11px]">
                    Click &quot;Execute AI Inference&quot; on the left to fire a live HTTP POST call to this Next.js API route.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 text-[11px] text-[#94A3B8] flex items-center justify-between mt-4">
              <span>Standardized JSON schema ready for edge deployment.</span>
              <span className="text-[#00D4AA] font-mono-data">200 OK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
