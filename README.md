# Smart AI Failover — MVP

Відмовостійка система обробки AI-запитів з автоматичним перемиканням між Gemini та Claude.

**Повністю безкоштовно** — через [CLIProxyAPI](https://help.router-for.me), який обгортає Gemini CLI та Claude Code як OpenAI-сумісний API.

---

## Швидкий старт

### Крок 1 — Запусти Docker

```bash
git clone https://github.com/your-username/smart-ai-failover.git
cd smart-ai-failover
docker compose up -d
```

### Крок 2 — Авторизуй Gemini (безкоштовно)

```bash
docker compose exec cli-proxy-api /CLIProxyAPI/CLIProxyAPI --no-browser --login
```

Відкриється URL — скопіюй його в браузер, увійди через Google акаунт. Готово.

### Крок 3 — Авторизуй Claude (безкоштовно)

```bash
docker compose exec cli-proxy-api /CLIProxyAPI/CLIProxyAPI --no-browser --claude-login
```

Відкриється URL — увійди через Anthropic акаунт (той самий що claude.ai). Платна підписка яку ти вже маєш — підійде.

### Крок 4 — Завантаж n8n workflow

1. Відкрий http://localhost:5678 (логін: `admin` / пароль: `changeme`)
2. **Workflows → Import from File**
3. Вибери `n8n/workflow.json`
4. Активуй workflow (toggle зверху праворуч)

### Крок 5 — Відкрий фронтенд

http://localhost:3000 — все працює!

---

## Запуск тестів

```bash
cd frontend
npm install

# Unit тести
npm test

# E2E тести
npx playwright install --with-deps
npm run test:e2e
```

---

## Архітектура

```
Браузер (Next.js :3000)
    │
    │  POST /webhook/ai-failover { prompt, force_error }
    ▼
n8n Workflow (:5678)
    │
    ├── force_error=false → CLIProxyAPI → Gemini 2.5 Flash (безкоштовно)
    │       └── Помилка? → CLIProxyAPI → Claude Sonnet (failover)
    │
    └── force_error=true  → CLIProxyAPI → Claude Sonnet (failover)
    │
    ├── PostgreSQL (логування ai_requests)
    │
    └── JSON відповідь → Браузер

CLIProxyAPI (:8317)
    ├── Gemini OAuth → безкоштовний Gemini 2.5
    └── Claude OAuth → безкоштовний Claude (через твою підписку claude.ai)
```

## Структура проекту

```
smart-ai-failover/
├── docker-compose.yml
├── cliproxyapi/
│   └── config.yaml           # Конфіг CLIProxyAPI проксі
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── app/page.tsx
│       ├── components/
│       │   ├── RequestForm.tsx
│       │   ├── ResponseCard.tsx
│       │   ├── HistoryTable.tsx
│       │   └── StatsBar.tsx
│       └── lib/
│           ├── api.ts
│           └── types.ts
├── n8n/
│   └── workflow.json          # n8n workflow (імпортувати вручну)
├── supabase/
│   └── schema.sql             # Схема БД
└── tests/
    ├── unit/components.test.tsx
    └── e2e/failover.spec.ts
```

## Ключові рішення

- **CLIProxyAPI** замість платних ключів: проксі використовує OAuth-сесії Gemini CLI та Claude Code — повністю безкоштовно.
- **OpenAI-сумісний формат**: обидва провайдери викликаються через `/v1/chat/completions` — n8n workflow простий і однаковий для обох.
- **Failover логіка в n8n**: `onError: continueErrorOutput` на ноді Gemini — при збої автоматично переходить до Claude.
- **Supabase**: логує кожен запит із часом виконання та метаданими (якщо налаштований).
