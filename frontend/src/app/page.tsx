"use client";

import { useState } from "react";
import RequestForm from "@/components/RequestForm";
import ResponseCard from "@/components/ResponseCard";
import HistoryTable from "@/components/HistoryTable";
import StatsBar from "@/components/StatsBar";
import { AiResponse, HistoryRecord } from "@/lib/types";

export default function Home() {
  const [response, setResponse] = useState<AiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  const handleResponse = (res: AiResponse) => {
    setResponse(res);
    setHistory((prev) => [
      {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        ...res,
      },
      ...prev,
    ]);
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Smart AI Failover
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Автоматичне перемикання між Gemini та Claude при збоях
        </p>
      </div>

      <StatsBar history={history} />

      <RequestForm
        onResponse={handleResponse}
        onLoading={setIsLoading}
        isLoading={isLoading}
      />

      {(response || isLoading) && (
        <ResponseCard response={response} isLoading={isLoading} />
      )}

      <HistoryTable records={history} />
    </main>
  );
}
