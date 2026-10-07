# Site LemosPassos

Protótipo do novo site institucional do Grupo LemosPassos.

## Estrutura

- `index.html`: abertura animada com a assinatura "acima de tudo, o cuidado".
- `home.html`: página inicial com apresentação do grupo, números, mapa de atuação e empresas parceiras.
- `solucoes.html`: lista de frentes de atuação.
- `solucao-*.html`: páginas internas de cada solução.
- `trabalhe-conosco.html`: formulário de envio de currículo via e-mail.
- `contato.html`: formulário de contato e endereços.
- `noticias.html`: carrossel de notícias editável pelo painel.
- `lgpd.html`: central de links e informações de privacidade.
- `admin.html` / `admin.js`: painel para editar indicadores, imagens por categoria e notícias através do backend PHP/MySQL.
- `api/`: endpoints PHP de autenticação, conteúdo e upload; `api/schema.sql` contém a tabela do CMS.
- `styles.css`: estilos, responsividade e animações.
- `script.js`: transições entre páginas, contador animado, cards interativos e formulários.
- `local-server.mjs`: servidor local simples para teste.
- `assets/`: imagens, identidade visual e mapa vetorial usado nas páginas. As fotos de cada solução, contato e cards ficam centralizadas nesta pasta com nomes normalizados para facilitar o carregamento.

## Como testar

Abra `index.html` no navegador ou rode:

```bash
node local-server.mjs
```

Depois acesse `http://127.0.0.1:5174`.

## Observações

O site é estático e não possui etapa de build. Os formulários usam `mailto`, então o envio final depende do cliente de e-mail do usuário.

## Configuração do CMS na Hostinger

O site agora usa endpoints PHP no mesmo domínio. Antes de usar o painel em produção:

1. O banco Hostinger existente já contém `site_content` (`id`, `content_json`, `updated_at`) e `lgpd_content`. **Não importe nem recrie o schema** nesse banco; a API usa o registro atual `site_content.id = 1` e preserva seu JSON.
2. No Gerenciador de Arquivos, em `public_html/api`, copie `config.example.php` para `config.php` e preencha os dados de conexão fornecidos no hPanel. O arquivo `config.php` é ignorado pelo Git e bloqueado por `.htaccess`.
3. Gere o hash da nova senha administrativa com PHP (`php -r "echo password_hash('SUA_SENHA_FORTE', PASSWORD_DEFAULT), PHP_EOL;"`) e preencha `admin_password_hash`. Use uma senha nova e exclusiva; não reutilize a senha do protótipo.
4. Confirme que `public_html/api/uploads` existe e permite gravação pelo PHP. A pasta bloqueia execução de scripts; os uploads aceitam imagem JPG, PNG, WebP ou GIF até 8 MB antes da otimização pelo navegador.

Não publique `api/config.php` no repositório nem compartilhe a senha do banco por mensagens. A autenticação usa sessão PHP, cookie HttpOnly/SameSite e token CSRF; o conteúdo é lido publicamente e só pode ser gravado após login.

Enquanto o backend não estiver publicado e configurado, as páginas públicas mantêm o conteúdo padrão. O registro já existente no MySQL deve permanecer intacto; ao conectar a API, ele será carregado no painel, sem migração ou sobrescrita inicial.
## Conteudo administravel

O painel permite editar os indicadores da home, organizar empresas nas categorias Hospitalar, Restaurantes, Área de Segurança e Merenda Escolar e cadastrar notícias com resumo, corpo completo e anexos de imagem. Notícias e arquivos são persistidos no MySQL e no diretório de uploads do servidor; as notícias abrem em `noticias.html`.
O mapa principal usa `assets/mapa-lemospassos.png`. A arte anterior com as conexoes internacionais foi preservada em `assets/mapa-internacional.svg` para uso futuro.
