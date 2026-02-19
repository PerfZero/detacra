# Project Playbook

## Stack
- React 19 + TypeScript + Vite
- UI: Ant Design
- Build: `npm run build` (`tsc -b && vite build`)

## Main Commands
- Dev: `npm run dev`
- Build check: `npm run build`
- Lint: `npm run lint`

## Project Structure (current)
- `src/App.tsx` - UI composition and form state.
- `src/config/` - environment and runtime config.
- `src/shared/` - reusable infra (HTTP client, common helpers).
- `src/features/<feature>/` - feature modules (`types`, `service`, `storage`, `factory`).

## SOLID Rules For This Repo
- Single Responsibility:
  - UI only renders and handles interaction.
  - Services hold business logic.
  - HTTP client does transport only.
  - Storage classes handle persistence only.
- Open/Closed:
  - Add new auth providers via new service classes, not by rewriting UI.
- Liskov Substitution:
  - Depend on interfaces (`HttpClient`, `AuthService`, `TokenStorage`) so implementations are replaceable.
- Interface Segregation:
  - Keep interfaces small and focused.
- Dependency Inversion:
  - Compose dependencies in factory/composition module.

## Env Policy
Use Vite env keys only through `src/config/env.ts`:
- `VITE_AUTH_API_URL`
- `VITE_AUTH_DEFAULT_EMAIL`
- `VITE_AUTH_DEFAULT_PASSWORD`

Rules:
- Real secrets/credentials only in `.env.local`.
- Keep `.env.example` safe and shareable.
- Do not hardcode URLs/credentials in UI or service files.

## Feature Integration Template
1. Create types in `src/features/<feature>/<feature>Types.ts`.
2. Add service interface + implementation.
3. Inject HTTP client through constructor.
4. Add storage abstraction if state must persist.
5. Create `create<Feature>Module.ts` for composition.
6. Use module in UI with minimal logic.

## API Integration Checklist
1. Verify endpoint contract with curl/Postman (method, body, response schema).
2. Verify CORS headers when calling from browser.
3. Handle non-2xx and domain errors separately.
4. Expose user-friendly errors in UI.
5. Persist only required auth artifacts (token, TTL if needed).

## Done Criteria Before Merge
- `npm run build` passes.
- No hardcoded environment values in source.
- Feature module boundaries are preserved.
- README/env docs updated if contract changed.
