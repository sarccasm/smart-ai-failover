import { AiResponse } from "@/lib/types";

interface Props {
  response: AiResponse | null;
  isLoading: boolean;
}

export default function ResponseCard({ response, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <div className="flex gap-1 items-center">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          <span className="ml-2 text-sm text-gray-400">Обробляємо запит…</span>
        </div>
      </div>
    );
  }

  if (!response) return null;

  const isGemini = response.model_used === "gemini";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          Відповідь
        </span>
        <div className="flex items-center gap-2">
          {response.is_failover && (
            <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">
              ⚡ Failover
            </span>
          )}
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              isGemini
                ? "bg-blue-50 text-blue-700"
                : "bg-violet-50 text-violet-700"
            }`}
          >
            {isGemini ? "✦ Gemini" : "◆ Claude"}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-800 leading-relaxed">{response.response}</p>

      <p className="mt-3 text-xs text-gray-400">
        Час виконання: {response.execution_ms}ms
      </p>
    </div>
  );
}
