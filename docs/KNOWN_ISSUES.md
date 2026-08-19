# Known Issues

Estado em 2026-08-14:

- `npm run lint` passa sem erros, mas ainda reporta warnings herdados de dependencias de hooks, import nao usado em `src/app/providers.tsx`, import nao usado em `UserList` e o `public/mockServiceWorker.js` gerado pelo MSW.
- `npm run build` passa, mas o toolchain avisa que `baseline-browser-mapping` e `caniuse-lite` estao desatualizados.

Validacoes executadas nesta rodada:

- `npm run typecheck`
- `npm run lint`
- `npm run test -- --run`
- `npm run build`
