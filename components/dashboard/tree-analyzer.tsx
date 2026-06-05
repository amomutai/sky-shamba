"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TreeDeciduous, Upload, Loader2, ImageIcon, AlertTriangle } from "lucide-react";
import { type TreeAnalysisResult } from "@/types/weather";

export function TreeAnalyzer() {
  const [result, setResult] = useState<TreeAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setError(null);
    setResult(null);

    const form = new FormData();
    form.append("image", file);

    try {
      const res = await fetch("/api/trees", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Analysis failed");
      setResult(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-emerald-700">
          <TreeDeciduous className="h-4 w-4" />
          Tree & Canopy Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop zone */}
        <div
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 px-4 py-8 transition hover:border-emerald-400 hover:bg-emerald-50"
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Uploaded field" className="max-h-40 rounded-lg object-cover" />
          ) : (
            <>
              <ImageIcon className="h-10 w-10 text-emerald-300" />
              <p className="text-sm text-slate-500">Drop a drone or satellite image here</p>
              <p className="text-xs text-slate-400">PNG, JPG up to 20 MB</p>
            </>
          )}
        </div>

        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

        <Button
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
        >
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analysing canopy…</>
          ) : (
            <><Upload className="mr-2 h-4 w-4" />Upload &amp; Analyse</>
          )}
        </Button>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        {result && (
          <div className="space-y-3">
            {/* Low-confidence warning */}
            {result.low_confidence && (
              <div className="flex items-start gap-2 rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>Low confidence result — try a clearer top-down image with visible tree canopy.</span>
              </div>
            )}

            {/* Key metrics */}
            <div className="grid grid-cols-2 gap-3">
              <ResultTile label="Trees counted" value={result.total_tree_count.toLocaleString()} />
              <ResultTile label="Canopy cover" value={result.canopy_coverage_pct != null ? `${result.canopy_coverage_pct}%` : "–"} />
              <ResultTile label="Confidence" value={`${Math.round(result.confidence_score * 100)}%`} />
              <ResultTile label="Density / acre" value={result.tree_density_per_acre != null ? String(result.tree_density_per_acre) : "–"} />
            </div>

            {/* Health breakdown */}
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Healthy {result.tree_health.healthy}
              </Badge>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                Needs care {result.tree_health.needs_care}
              </Badge>
              <Badge variant="secondary" className="bg-red-100 text-red-600">
                Needs replacement {result.tree_health.needs_replacement}
              </Badge>
            </div>

            {/* Species guess */}
            {result.tree_species_guess && (
              <p className="text-xs text-slate-500">
                Likely species: <span className="font-medium text-slate-700">{result.tree_species_guess}</span>
              </p>
            )}

            {/* Observations */}
            {result.observations.length > 0 && (
              <div className="rounded-lg bg-slate-50 px-3 py-2">
                <p className="text-xs font-semibold text-slate-600">Observations</p>
                <ul className="mt-1 space-y-1">
                  {result.observations.map((obs, i) => (
                    <li key={i} className="text-sm text-slate-700">• {obs}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="rounded-lg bg-emerald-50 px-3 py-2">
                <p className="text-xs font-semibold text-emerald-700">Recommendations</p>
                <ul className="mt-1 space-y-1">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm text-emerald-800">• {rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Overlay image if the API returned one */}
            {result.overlay_image_url && (
              <div>
                <p className="mb-1 text-xs font-semibold text-slate-600">Annotated overlay</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result.overlay_image_url} alt="Tree overlay" className="rounded-lg w-full object-cover" />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ResultTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="text-base font-semibold text-slate-800">{value}</p>
    </div>
  );
}
