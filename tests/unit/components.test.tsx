import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StatsBar from "@/components/StatsBar";
import ResponseCard from "@/components/ResponseCard";
import HistoryTable from "@/components/HistoryTable";
import { HistoryRecord, AiResponse } from "@/lib/types";

describe("StatsBar", () => {
  it("shows zeros when history is empty", () => {
    render(<StatsBar history={[]} />);
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThanOrEqual(3);
  });

  it("counts gemini and claude separately", () => {
    const history: HistoryRecord[] = [
      { id: "1", created_at: new Date().toISOString(), response: "r1", model_used: "gemini", is_failover: false, execution_ms: 300 },
      { id: "2", created_at: new Date().toISOString(), response: "r2", model_used: "claude", is_failover: true, execution_ms: 500 },
      { id: "3", created_at: new Date().toISOString(), response: "r3", model_used: "gemini", is_failover: false, execution_ms: 200 },
    ];
    render(<StatsBar history={history} />);
    expect(screen.getByText("3")).toBeTruthy();
    expect(screen.getByText("2")).toBeTruthy();
    expect(screen.getByText("1")).toBeTruthy();
  });
});

describe("ResponseCard", () => {
  it("shows loading dots when isLoading=true", () => {
    render(<ResponseCard response={null} isLoading={true} />);
    expect(screen.getByText(/Обробляємо запит/)).toBeTruthy();
  });

  it("renders gemini response correctly", () => {
    const resp: AiResponse = { response: "Hello from Gemini", model_used: "gemini", is_failover: false, execution_ms: 350 };
    render(<ResponseCard response={resp} isLoading={false} />);
    expect(screen.getByText("Hello from Gemini")).toBeTruthy();
    expect(screen.getByText("✦ Gemini")).toBeTruthy();
  });

  it("shows failover badge when is_failover=true", () => {
    const resp: AiResponse = { response: "Hello from Claude", model_used: "claude", is_failover: true, execution_ms: 600 };
    render(<ResponseCard response={resp} isLoading={false} />);
    expect(screen.getByText(/Failover/i)).toBeTruthy();
  });

  it("renders nothing when no response and not loading", () => {
    const { container } = render(<ResponseCard response={null} isLoading={false} />);
    expect(container.firstChild).toBeNull();
  });
});

describe("HistoryTable", () => {
  it("shows empty message when no records", () => {
    render(<HistoryTable records={[]} />);
    expect(screen.getByText(/Записів поки що немає/)).toBeTruthy();
  });

  it("renders rows for each record", () => {
    const records: HistoryRecord[] = [
      { id: "1", created_at: new Date().toISOString(), response: "r1", model_used: "gemini", is_failover: false, execution_ms: 300 },
      { id: "2", created_at: new Date().toISOString(), response: "r2", model_used: "claude", is_failover: true, execution_ms: 500 },
    ];
    render(<HistoryTable records={records} />);
    expect(screen.getByText(/✦ Gemini/)).toBeTruthy();
    expect(screen.getByText(/◆ Claude/)).toBeTruthy();
    expect(screen.getByText("OK")).toBeTruthy();
    expect(screen.getByText("Failover")).toBeTruthy();
  });
});
