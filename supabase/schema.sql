CREATE TABLE IF NOT EXISTS ai_requests (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  prompt      TEXT        NOT NULL,
  force_error BOOLEAN     NOT NULL DEFAULT FALSE,

  response    TEXT,
  model_used  TEXT        NOT NULL CHECK (model_used IN ('gemini', 'claude')),
  is_failover BOOLEAN     NOT NULL DEFAULT FALSE,

  started_at    TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ,
  execution_ms  INTEGER GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (completed_at - started_at)) * 1000
  )::INTEGER STORED,

  status      TEXT        NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'error')),
  error_msg   TEXT
);

CREATE INDEX idx_ai_requests_model     ON ai_requests (model_used);
CREATE INDEX idx_ai_requests_created   ON ai_requests (created_at DESC);
CREATE INDEX idx_ai_requests_failover  ON ai_requests (is_failover);

ALTER TABLE ai_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON ai_requests
  FOR ALL USING (auth.role() = 'service_role');

CREATE OR REPLACE VIEW ai_stats AS
SELECT
  COUNT(*)                                          AS total_requests,
  COUNT(*) FILTER (WHERE model_used = 'gemini')    AS gemini_count,
  COUNT(*) FILTER (WHERE model_used = 'claude')    AS claude_count,
  COUNT(*) FILTER (WHERE is_failover = TRUE)       AS failover_count,
  ROUND(AVG(execution_ms))                         AS avg_execution_ms,
  ROUND(AVG(execution_ms) FILTER (WHERE model_used = 'gemini')) AS avg_gemini_ms,
  ROUND(AVG(execution_ms) FILTER (WHERE model_used = 'claude')) AS avg_claude_ms
FROM ai_requests
WHERE status = 'success';
