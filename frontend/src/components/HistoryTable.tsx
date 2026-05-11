import { HistoryRecord } from "@/lib/types";

interface Props {
  records: HistoryRecord[];
}

export default function HistoryTable({ records }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
        Журнал запитів
      </h2>

      {records.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          Записів поки що немає
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs text-gray-400 font-medium pb-2 pr-4">Час</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-2 pr-4">Модель</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-2 pr-4">Статус</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-2">Час (ms)</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => {
                const time = new Date(r.created_at).toLocaleTimeString("uk-UA");
                return (
                  <tr key={r.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-2 pr-4 text-gray-500 tabular-nums">{time}</td>
                    <td className="py-2 pr-4">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          r.model_used === "gemini"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-violet-50 text-violet-700"
                        }`}
                      >
                        {r.model_used === "gemini" ? "✦ Gemini" : "◆ Claude"}
                      </span>
                    </td>
                    <td className="py-2 pr-4">
                      {r.is_failover ? (
                        <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                          Failover
                        </span>
                      ) : (
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                          OK
                        </span>
                      )}
                    </td>
                    <td className="py-2 tabular-nums text-gray-600">{r.execution_ms}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
