# API Contracts

## Endpoints

- `POST /api/analyze-jd`
- `POST /api/chat`

## Shared Behavior

- Content-Type: `application/json`
- Error format always follows:

```json
{
  "error": "human-readable-message"
}
```

## `POST /api/analyze-jd`

Request:

```json
{
  "jobDescription": "string (min 30 chars)"
}
```

Response:

```json
{
  "verdict": "strong_fit | worth_conversation | probably_not | needs_clarification",
  "headline": "string",
  "opening": "string",
  "gaps": [
    {
      "requirement": "string",
      "gapTitle": "string",
      "explanation": "string"
    }
  ],
  "transfers": "string",
  "recommendation": "string"
}
```

Validation reference: `src/lib/contracts.ts::JDAnalysisSchema`.

## `POST /api/chat`

Request:

```json
{
  "message": "string",
  "sessionId": "string"
}
```

Response:

```json
{
  "message": "string"
}
```

### Rollout controls

- `VITE_USE_MOCK_AI=true` keeps deterministic local behavior.
- `VITE_USE_MOCK_AI=false` routes to backend API/edge functions.

## Error Contract

```json
{
  "error": "human-readable-message"
}
```

