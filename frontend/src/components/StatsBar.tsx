import { HistoryRecord } from "@/lib/types";

interface Props {
  history: HistoryRecord[];
}

export default function StatsBar({ history }: Props) {
  const total = history.length;
  const gemini = history.filter((r) => r.model_used === "gemini").length;
  const claude = history.filter((r) => r.model_used === "claude").length;
  const avgMs =
    total > 0
      ? Math.round(history.reduce((s, r) => s + r.execution_ms, 0) / total)
      : 0;

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {[
        { label: "Всього запитів", value: total, color: "text-gray-800" },
        { label: "Gemini", value: gemini, color: "text-blue-600" },
        { label: "Claude (failover)", value: claude, color: "text-violet-600" },
        { label: "Avg. час, ms", value: avgMs || "—", color: "text-gray-800" },
      ].map(({ label, value, color }) => (
        <div
          key={label}
          className="bg-gray-50 rounded-xl p-4"
        >
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className={`text-2xl font-medium ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}
