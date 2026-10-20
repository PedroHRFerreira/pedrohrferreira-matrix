# Deploy automático na Cloudflare

O domínio de produção é `https://pedrohrferreira.com`, também disponível com `www`.
Os dois endereços pertencem ao projeto Cloudflare Pages `pedrohrferreira`.

O projeto usa Direct Upload. O workflow
[`deploy-cloudflare.yml`](../.github/workflows/deploy-cloudflare.yml) executa a publicação
sempre que um commit chega à `main`. Também é possível iniciá-lo manualmente em
**GitHub → Actions → Deploy Cloudflare Pages → Run workflow**, selecionando `main`.

## Credenciais

Em **Settings → Secrets and variables → Actions** do repositório
`PedroHRFerreira/pedrohrferreira-matrix`, configure:

| Tipo     | Nome                    | Conteúdo                                                                                                     |
| -------- | ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| Variable | `CLOUDFLARE_ACCOUNT_ID` | ID da conta que contém o projeto `pedrohrferreira`                                                           |
| Secret   | `CLOUDFLARE_API_TOKEN`  | Token dedicado ao deploy, com a permissão **Account → Cloudflare Pages → Edit**, limitado à conta do projeto |

O token permite gerenciar projetos Pages nessa conta. Não precisa de permissões de DNS,
Workers ou administração de tokens. Seu valor deve ficar apenas no secret do GitHub;
não use o token OAuth do Wrangler local e não inclua credenciais no código ou nos logs.
Se definir uma expiração, substitua o secret antes dessa data para manter o deploy ativo.

## Fluxo de publicação

1. Instala as dependências com `npm ci`, usando o lockfile e Node.js 24.
2. Executa lint e testes unitários; uma falha impede a publicação.
3. Executa `npm run build`, que gera o site estático em `out/`.
4. Publica `out/` no projeto existente, com a branch `main` e o SHA do commit.
5. Confirma que os dois domínios servem o HTML desse mesmo build e que o currículo responde.

As publicações são sequenciais. Um deploy em andamento termina antes do próximo,
e o GitHub conserva apenas o mais recente na fila de espera.

O resultado aparece em **Actions** e nos deployments do GitHub. A confirmação final
dos domínios também aparece no resumo do workflow. Na Cloudflare, o deploy fica em
**Workers & Pages → pedrohrferreira → Deployments**, associado ao commit publicado.

## Publicação manual de contingência

Com Wrangler autenticado localmente:

```bash
npm ci
npm run build
npx wrangler@4.151.3 pages deploy out --project-name=pedrohrferreira --branch=main
```

Esse comando publica na mesma produção. Use a branch `main` atualizada para não
substituir a publicação automática por uma revisão anterior.

Referência: [Direct Upload com integração contínua](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/).
