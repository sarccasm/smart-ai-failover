"use client";

import { useState } from "react";
import { sendToWebhook } from "@/lib/api";
import { AiResponse } from "@/lib/types";

interface Props {
  onResponse: (res: AiResponse) => void;
  onLoading: (v: boolean) => void;
  isLoading: boolean;
}

export default function RequestForm({ onResponse, onLoading, isLoading }: Props) {
  const [prompt, setPrompt] = useState("");
  const [forceError, setForceError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setError(null);
    onLoading(true);
    try {
      const res = await sendToWebhook(prompt.trim(), forceError);
      onResponse(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Невідома помилка");
    } finally {
      onLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
      <textarea
        id="prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Введіть текст запиту..."
        rows={4}
        disabled={isLoading}
        className="w-full resize-none text-sm border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-violet-400 disabled:opacity-50 mb-3"
      />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={forceError}
            onChange={(e) => setForceError(e.target.checked)}
            className="w-4 h-4 accent-red-500"
          />
          <span className={forceError ? "text-red-600 font-medium" : ""}>
            🔴 Debug / Force Error (Failover)
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg disabled:opacity-40 hover:bg-gray-700 transition-colors"
        >
          {isLoading ? "Обробка…" : "Відправити"}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          ⚠️ {error}
        </p>
      )}
    </form>
  );
}
