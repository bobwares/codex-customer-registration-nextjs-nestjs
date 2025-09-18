# Customer Registration UI

Next.js front-end for capturing customer onboarding details and submitting them to the API.

## Setup

```bash
cd ui
cp .env.example .env.local # optional
npm install
```

## Development

```bash
npm run dev
```

The app runs on `http://localhost:3001` by default when using `PORT=3001` (configure via `.env.local`).

## Testing

```bash
npm test
```

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL` – base URL for the Customer Registration API (default `http://localhost:3000/api`).

## Linting

```bash
npm run lint
```
