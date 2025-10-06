# Guia de Contribuição – Sistema de Almoxarifado da Clínica de Odontologia da UFC

Obrigado por contribuir com o projeto!
Este documento descreve as normas e boas práticas para colaboração, a fim de manter consistência e qualidade no desenvolvimento do sistema.

## 📂 Estrutura do Repositório
- main: versão estável em produção.
- develop: versão de integração e homologação.
- feature/*: novas funcionalidades.
- fix/*: correções de bugs.
- hotfix/*: correções urgentes em produção.
- docs/*: alterações na documentação.
- test/*: experimentos e provas de conceito.

## 🌱 Nomeação de Branches
Padrão:
tipo/id-descritivo

Tipos válidos:
- feature/: nova funcionalidade
- fix/: correção de erro identificado
- hotfix/: correção crítica em produção
- refactor/: refatoração sem alterar comportamento
- docs/: alterações na documentação
- test/: testes ou protótipos

Exemplos:
- feature/RF05-cadastro-de-materiais
- fix/RF12-corrigir-calculo-estoque
- docs/atualizar-readme

## 📝 Commits
Formato:
<tipo>(<RF ou módulo>): descrição breve

Tipos:
- feat: nova funcionalidade
- fix: correção
- refactor: refatoração
- docs: documentação
- test: testes
- chore: tarefas diversas (build, configs, CI/CD)

Exemplos:
- feat(RF03): implementar controle de entrada de materiais
- fix(RF08): corrigir bug na baixa de estoque
- docs: adicionar guia de contribuição

## 📌 Requisitos Funcionais (RFs)
Cada funcionalidade deve estar associada a um RF do documento de requisitos.

- Referencie o RF no título do branch e nos commits.
- No Pull Request (PR), descreva quais RFs foram atendidos.

Exemplo de referência no PR:
Este PR implementa:
- RF05: Cadastro de materiais
- RF06: Consulta de estoque

## 🔎 Revisão de Código
Antes de abrir um Pull Request:
1. Certifique-se de que todos os testes locais passam.
2. Atualize a documentação se necessário.
3. Garanta que os commits estão limpos (sem código comentado desnecessário).

## ✅ Pull Requests
- Descreva de forma clara o que foi implementado.
- Relacione os RFs atendidos.
- Inclua prints ou GIFs se a mudança impactar a interface.
- Um PR só pode ser aprovado após 2 revisões (quando possível).

## 📖 Convenções de Código
- Seguir o PEP8 (Python) ou padrão equivalente na linguagem usada.
- Nomes de variáveis e funções descritivos e em inglês.
- Comentários sucintos e objetivos.
- Scripts de banco devem estar versionados na pasta db/.

## 🚀 Fluxo de Trabalho (Git Flow Adaptado)
1. Criar branch a partir de develop.
2. Implementar a funcionalidade/correção.
3. Criar PR para develop.
4. Revisão e merge.
5. Após validação, develop é integrado em main.

## 🛠️ Boas Práticas
- Faça commits pequenos e frequentes.
- Não faça merge direto em main.
- Sempre associe mudanças a um RF ou correção de bug.
- Escreva commits no imperativo (ex: “adicionar”, “corrigir”, “remover”).
