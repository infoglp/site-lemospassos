# Site institucional LemosPassos

Site institucional estático com uma API PHP/MySQL usada pelo painel administrativo. Não há etapa de build: HTML, CSS e JavaScript são publicados diretamente.

## Páginas e arquivos principais

- `index.html`: abertura animada do site na raiz do domínio.
- `home.html`: conteúdo da página inicial; a URL é normalizada para a raiz (`/`) após a abertura. As páginas internas mantêm seus próprios caminhos.
- `solucoes.html` e `solucao-*.html`: frentes e páginas de serviços.
- `assets/hospitalar-nova.jpg`: foto usada no card e na página de Alimentação Hospitalar.
- `trabalhe-conosco.html`: apresentação e link para o portal externo de vagas da LG.
- `contato.html`: endereços e formulário de contato, que prepara uma mensagem no cliente de e-mail do visitante.
- `noticias.html`: lista e visualização de notícias.
- `news-layout.css`: ajustes de layout e responsividade exclusivos da página de notícias.
- `lgpd.html`: informações e links de privacidade.
- `admin.html` / `admin.js`: painel administrativo.
- `script.js` / `styles.css`: comportamento e apresentação compartilhados.
- `api/`: API PHP de autenticação, conteúdo, upload e encerramento de sessão.
- `assets/`: imagens, marcas e mapas.
- `local-server.mjs`: pré-visualização local apenas das páginas estáticas.

## Pré-visualização local

Com Node.js instalado, na raiz do repositório:

```powershell
node local-server.mjs
```

Acesse `http://127.0.0.1:5174`. Esse servidor simples não executa PHP; portanto, ele não testa o login, o banco MySQL nem os uploads do painel. Para testar essas funções, use o site publicado.

## Painel e conteúdo administrável

O painel fica em `admin.html`. Com a API configurada, ele permite editar os indicadores da home, imagens de empresas parceiras, notícias (incluindo imagem principal e anexos), imagem do mapa e siglas dos estados exibidas abaixo do mapa. As alterações são gravadas no registro `site_content.id = 1` da tabela `site_content`.

Na seção **Mapa de atuação**:

- A imagem pode ser substituída por upload ou URL.
- **Estados destacados** aceita siglas separadas por vírgula (por exemplo, `AP, AM, PA, CE, PE, BA, SE, MT, GO, DF, MG, SP`). A API aceita apenas siglas brasileiras válidas e sem duplicatas.
- A lista de siglas altera o texto abaixo do mapa; ela não colore os polígonos dentro da imagem. Para mudar a representação visual dos estados, envie uma imagem de mapa já atualizada.

Os arquivos enviados pelo painel são armazenados em `api/uploads/`, com nomes aleatórios. São aceitos JPG, PNG, WebP e GIF, até 8 MB por arquivo enviado à API. A pasta impede a execução de scripts.

## Backend e Hostinger

O ambiente de produção é a hospedagem Hostinger, com o repositório GitHub `https://github.com/infoglp/site-lemospassos`, branch `main`, publicado em `public_html`. Após enviar um commit para `origin/main`, confirme no hPanel se a implantação terminou e valide o site publicado.

Para conectar a API no servidor:

1. O banco existente da Hostinger já contém `site_content` e `lgpd_content`. A API do painel usa `site_content`, no registro de ID `1`; o painel atual não administra a tabela `lgpd_content`. Preserve os dados existentes. Não importe nem recrie tabelas durante uma atualização comum. Não há `api/schema.sql` neste repositório.
2. Em `public_html/api`, copie `config.example.php` para `config.php` e preencha no próprio hPanel os dados MySQL e o hash da senha administrativa. O `config.php` está no `.gitignore` e o `api/.htaccess` impede seu acesso público.
3. Garanta que `public_html/api/uploads` exista e possa ser gravada pelo PHP. `api/uploads/.htaccess` bloqueia execução de scripts.
4. Se o editor de código do Gerenciador de Arquivos retornar `403` ao salvar `config.php`, crie o arquivo localmente e use **Upload/Enviar arquivo** para colocá-lo em `public_html/api`, substituindo-o. Esse procedimento já contornou o erro observado.

O painel usa autenticação PHP com sessão, cookie `HttpOnly`/`SameSite`, token CSRF e limite de tentativas de login. A leitura do conteúdo é pública; gravações e uploads exigem sessão administrativa válida.

### Segurança de configuração

- Nunca faça commit ou push de `api/config.php`.
- Não compartilhe senha do banco, senha administrativa, hash ou capturas do arquivo de configuração em mensagens ou chamados públicos.
- Use senhas fortes e exclusivas. Gere o hash no servidor/localmente com PHP, sem inserir a senha real no comando salvo no histórico; a API verifica o hash usando `password_verify`.
- Se uma credencial aparecer em uma captura ou conversa, troque-a no hPanel e atualize `config.php`.

## Publicação de alterações

O fluxo normal é editar e validar localmente, fazer commit e enviar para `main`:

```powershell
git status
node --check script.js
node --check admin.js
git diff --check
git add <arquivos-alterados>
git commit -m "Descreva a alteração"
git push origin main
```

Depois, acompanhe a implantação no hPanel. Mudanças em `config.php` e outros segredos são feitas diretamente no servidor e não devem entrar no Git.
