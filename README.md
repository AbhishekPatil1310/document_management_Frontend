# Legal Vault Frontend

## Setup

1. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL`.
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Build production bundle: `npm run build`

## Notes

- Auth uses secure `httpOnly` cookies only.
- Access/refresh tokens are never stored in local storage.
- API integration targets backend endpoints under `/api`.
