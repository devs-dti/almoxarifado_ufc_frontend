# Almoxarifado UFC — Frontend

Aplicação Next.js para o Sistema Soma. Requer Node.js e npm.

## Desenvolvimento

1. Copie `.env.example` para `.env.local`.
2. Execute `npm install` e `npm run dev`.
3. Acesse http://localhost:3000.

Para usar o backend, configure `NEXT_PUBLIC_USE_MOCKS=false` e `API_URL` com o endereço do servidor Spring (por padrão `http://localhost:8080`). O cliente usa o proxy `/api/backend`.

Para demonstração, configure `NEXT_PUBLIC_USE_MOCKS=true` e reinicie o servidor. O MSW intercepta as chamadas no navegador; o login simulado aceita e-mail não vazio e senha com pelo menos três caracteres. Os dados são temporários e não substituem o backend. Algumas operações, como exportações de relatórios, ainda não possuem simulação. Se o service worker não iniciar, a aplicação apresenta uma mensagem de erro.

## Verificações

- `npm run typecheck`
- `npm run lint`
- `npm run test:run`
- `npm run build`
