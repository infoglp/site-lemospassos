const CMS_KEY = "lemospassos-cms-v1";
const defaults = {
  metrics: { meals: 400000, employees: 3500, restaurants: 431 },
  partners: {
    Hospitalar: ["https://www.lemospassos.com.br/wp-content/uploads/2019/08/HDT.png", "https://www.lemospassos.com.br/wp-content/uploads/2023/01/RD_DROGASIL.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/2.png"],
    Restaurantes: ["https://www.lemospassos.com.br/wp-content/uploads/2023/01/AMBEV.png", "https://www.lemospassos.com.br/wp-content/uploads/2023/01/CARREFOUR.png", "https://www.lemospassos.com.br/wp-content/uploads/2023/01/IBIRA.png", "https://www.lemospassos.com.br/wp-content/uploads/2023/01/BRISA.png"],
    "Área de Segurança": ["https://www.lemospassos.com.br/wp-content/uploads/2023/01/ERB.png", "https://www.lemospassos.com.br/wp-content/uploads/2023/01/MOTECH.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/9.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/11.png"],
    "Merenda Escolar": ["https://www.lemospassos.com.br/wp-content/uploads/2019/06/12.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/13.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/14.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/34.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/16.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/17.png"],
  },
  news: [
    { title: "Relatório de Transparência e Igualdade Salarial de Mulheres e Homens", excerpt: "Confira o relatório institucional disponibilizado pelo Grupo LemosPassos.", image: "./assets/contato.jpg", url: "https://www.lemospassos.com.br/relatorio-de-transparencia-e-igualdade-salarial-de-mulheres-e-homens/" },
    { title: "60 anos da Administração", excerpt: "Uma homenagem à história, à ética e à boa gestão.", image: "./assets/card-atuacoes.jpg", url: "https://www.lemospassos.com.br/60-anos-da-administracao/" },
    { title: "Dia do Cliente", excerpt: "A confiança nasce nos gestos diários e se fortalece em cada etapa.", image: "./assets/card-contatos.jpg", url: "https://www.lemospassos.com.br/dia-do-cliente-2/" },
    { title: "Dica da Nutri", excerpt: "Um prato colorido mostra a diversidade de nutrientes presentes na refeição.", image: "./assets/populares.jpg", url: "https://www.lemospassos.com.br/dica-da-nutri-2/" },
  ],
  mapImage: "./assets/mapa-lemospassos.png",
  mapStates: ["AP", "AM", "PA", "CE", "PE", "BA", "SE", "MT", "GO", "DF", "MG", "SP"],
};
const starterBodies = [
  "Em cumprimento à legislação vigente, disponibilizamos o Relatório de Transparência e Igualdade Salarial de Mulheres e Homens, documento que reúne informações sobre a remuneração de profissionais e reforça o compromisso da organização com transparência, equidade e responsabilidade.",
  "O presidente do Grupo Lemospassos, Ademar Lemos Jr., foi homenageado pelo CRA-BA durante a solenidade do Jubileu de Diamante da Administração, realizada na FIEB no dia 17/09. O encontro reuniu profissionais e autoridades para celebrar os 60 anos da regulamentação da profissão, reforçando a importância da ética, da técnica e da boa gestão para o desenvolvimento da sociedade. A programação seguiu com visitas técnicas dedicadas à história, às conquistas e ao futuro da Administração.",
  "Ao longo dos anos, aprendemos que a confiança não se conquista de uma vez só. Ela nasce nos gestos diários, nas escolhas que se repetem e na relação que se fortalece a cada etapa. No Dia do Cliente, celebramos essa construção conjunta, feita de histórias que se entrelaçam com a nossa e dão sentido ao caminho que seguimos.",
  "Um prato colorido não é só bonito: ele mostra a diversidade de nutrientes presentes na refeição. Cada cor tem algo diferente a oferecer ao nosso organismo. Variar frutas, verduras e legumes é uma forma simples de tornar a alimentação mais equilibrada, saborosa e nutritiva.",
];
let csrfToken = "";
const login = document.querySelector("[data-admin-login]");
const panel = document.querySelector("[data-admin-panel]");
const form = document.querySelector("[data-cms-form]");
const newsEditor = document.querySelector("[data-news-editor]");
let currentContent = normalize(defaults);
document.querySelector("[data-admin-login] img")?.setAttribute("src", "./assets/logo-oficial.png");
document.querySelector("link[rel='icon']")?.setAttribute("href", "./assets/logo-oficial.png");
const backLink = document.createElement("a");
backLink.className = "admin-back-link"; backLink.href = "./"; backLink.textContent = "← Voltar para o site";
document.querySelector(".admin-panel-head")?.prepend(backLink);

async function api(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (csrfToken) headers.set("X-CSRF-Token", csrfToken);
  const response = await fetch(`./api/${path}`, { ...options, headers, credentials: "same-origin", cache: "no-store" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Falha do servidor (${response.status}).`);
  return payload;
}
function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]); }
function localLegacyData() {
  try { const saved = JSON.parse(localStorage.getItem(CMS_KEY) || "null"); return saved ? normalize(saved) : normalize(defaults); } catch { return normalize(defaults); }
}
function normalize(input) {
  const data = { ...defaults, ...input, metrics: { ...defaults.metrics, ...(input.metrics || {}) }, partners: { ...defaults.partners, ...(input.partners || {}) }, news: Array.isArray(input.news) ? input.news : defaults.news };
  data.news = data.news.map((item, index) => ({ ...item, body: item.body || starterBodies[index] || item.excerpt || "", attachments: Array.isArray(item.attachments) ? item.attachments : [] }));
  return data;
}

function render(data) {
  currentContent = normalize(data);
  form.meals.value = data.metrics.meals; form.employees.value = data.metrics.employees; form.restaurants.value = data.metrics.restaurants;
  form.querySelector("[data-map-image-url]").value = data.mapImage || defaults.mapImage;
  form.querySelector("[data-map-image-preview]").src = data.mapImage || defaults.mapImage;
  form.querySelector("[data-map-states]").value = (Array.isArray(data.mapStates) ? data.mapStates : defaults.mapStates).join(", ");
  newsEditor.innerHTML = data.news.map((item, index) => {
    const image = item.image || "";
    return `<fieldset class="admin-fieldset" data-news-index="${index}"><legend>Notícia ${index + 1}</legend><label>Título<input value="${escapeHtml(item.title)}" data-news-title /></label><label>Resumo<textarea data-news-excerpt>${escapeHtml(item.excerpt)}</textarea></label><label>URL ou caminho da imagem<input value="${image.startsWith("data:image/") ? "" : escapeHtml(image)}" data-news-image-url /></label><input type="hidden" value="${image.startsWith("data:image/") ? escapeHtml(image) : ""}" data-news-image-data /><label class="admin-news-image-file">Selecionar arquivo da imagem principal<input type="file" accept="image/*" data-news-image-file /></label><img class="admin-news-image-preview" src="${escapeHtml(image)}" alt="Prévia da imagem principal da notícia" data-news-image-preview /><label>Link externo<input value="${escapeHtml(item.url || "")}" data-news-url /></label><label>Corpo da notícia<textarea data-news-body rows="7">${escapeHtml(item.body)}</textarea></label><label>Anexos da notícia<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple data-news-files /><div class="admin-attachment-list">${(item.attachments || []).map((src) => `<div class="admin-attachment"><img src="${escapeHtml(src)}" alt="" /><input type="hidden" value="${escapeHtml(src)}" data-news-attachment /><button type="button" data-remove-news-attachment aria-label="Remover anexo">×</button></div>`).join("")}</div></label><p class="admin-image-status" data-news-image-status></p><button type="button" class="admin-small-button" data-remove-news>Remover notícia</button></fieldset>`;
  }).join("");
}

function readData() {
  const data = normalize(currentContent);
  data.metrics = { meals: Number(form.meals.value), employees: Number(form.employees.value), restaurants: Number(form.restaurants.value) };
  data.mapImage = form.querySelector("[data-map-image-url]").value.trim() || defaults.mapImage;
  data.mapStates = form.querySelector("[data-map-states]").value.split(",").map((state) => state.trim().toUpperCase()).filter(Boolean);
  data.news = [...newsEditor.querySelectorAll("[data-news-index]")].map((box) => ({ title: box.querySelector("[data-news-title]").value.trim(), excerpt: box.querySelector("[data-news-excerpt]").value.trim(), body: box.querySelector("[data-news-body]").value.trim(), image: box.querySelector("[data-news-image-data]").value || box.querySelector("[data-news-image-url]").value.trim(), attachments: [...box.querySelectorAll("[data-news-attachment]")].map((input) => input.value), url: box.querySelector("[data-news-url]").value.trim() })).filter((item) => item.title);
  return data;
}
async function uploadDataImage(value) {
  if (!value.startsWith("data:image/")) return value;
  const blob = await (await fetch(value)).blob();
  const extension = blob.type === "image/png" ? "png" : blob.type === "image/gif" ? "gif" : blob.type === "image/jpeg" ? "jpg" : "webp";
  const file = new File([blob], `imagem.${extension}`, { type: blob.type });
  const body = new FormData(); body.append("image", file);
  return (await api("upload.php", { method: "POST", body })).url;
}
async function persistImages(data) {
  data.mapImage = await uploadDataImage(data.mapImage);
  for (const images of Object.values(data.partners || {})) {
    if (!Array.isArray(images)) continue;
    for (let i = 0; i < images.length; i++) images[i] = await uploadDataImage(images[i]);
  }
  for (const item of data.news) {
    item.image = await uploadDataImage(item.image);
    for (let i = 0; i < item.attachments.length; i++) item.attachments[i] = await uploadDataImage(item.attachments[i]);
  }
  return data;
}
async function showPanel(data) {
  login.classList.add("is-hidden"); panel.classList.remove("is-hidden"); render(normalize(data));
}

document.querySelector("[data-admin-login-form]").addEventListener("submit", async (event) => {
  event.preventDefault();
  const error = document.querySelector("[data-admin-error]"); error.textContent = "Verificando acesso…";
  const values = new FormData(event.currentTarget);
  try {
    const result = await api("auth.php", { method: "POST", body: JSON.stringify({ username: values.get("username"), password: values.get("password") }) });
    csrfToken = result.csrfToken;
    const stored = await api("content.php");
    await showPanel(stored.content || localLegacyData());
    error.textContent = "";
  } catch (failure) { error.textContent = failure.message; }
});
document.querySelector("[data-admin-logout]").addEventListener("click", async () => {
  try { await api("logout.php", { method: "POST", body: "{}" }); } catch { /* local interface still closes */ }
  csrfToken = ""; panel.classList.add("is-hidden"); login.classList.remove("is-hidden");
});
document.querySelector("[data-add-news]").addEventListener("click", () => {
  const data = readData(); data.news.push({ title: "", excerpt: "", body: "", image: "./assets/hero-kitchen.png", attachments: [], url: "" }); render(data);
});
async function previewFile(file, callback) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 2000 / bitmap.width, 2000 / bitmap.height);
  const canvas = document.createElement("canvas"); canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close();
  callback(canvas.toDataURL("image/webp", 0.84));
}
form.addEventListener("change", async (event) => { if (event.target.matches("[data-map-image-file]") && event.target.files[0]) { const input = event.target; try { await previewFile(input.files[0], (src) => { form.querySelector("[data-map-image-url]").value = src; form.querySelector("[data-map-image-preview]").src = src; }); } catch { document.querySelector("[data-admin-success]").textContent = "Não foi possível ler essa imagem."; } input.value = ""; } });
form.querySelector("[data-map-image-url]").addEventListener("input", (event) => { form.querySelector("[data-map-image-preview]").src = event.target.value.trim() || defaults.mapImage; });
newsEditor.addEventListener("click", (event) => { if (event.target.matches("[data-remove-news]")) event.target.closest("[data-news-index]").remove(); if (event.target.matches("[data-remove-news-attachment]")) event.target.closest(".admin-attachment").remove(); });
newsEditor.addEventListener("input", (event) => { if (!event.target.matches("[data-news-image-url]")) return; const box = event.target.closest("[data-news-index]"); box.querySelector("[data-news-image-data]").value = ""; box.querySelector("[data-news-image-preview]").src = event.target.value.trim(); });
newsEditor.addEventListener("change", async (event) => {
  const input = event.target; const box = input.closest("[data-news-index]"); if (!box || !input.files?.length) return;
  const status = box.querySelector("[data-news-image-status]");
  try {
    if (input.matches("[data-news-image-file]")) await previewFile(input.files[0], (src) => { box.querySelector("[data-news-image-data]").value = src; box.querySelector("[data-news-image-url]").value = ""; box.querySelector("[data-news-image-preview]").src = src; status.textContent = "Imagem pronta para enviar ao servidor ao salvar."; });
    if (input.matches("[data-news-files]")) for (const file of [...input.files]) await previewFile(file, (src) => { const item = document.createElement("div"); item.className = "admin-attachment"; item.innerHTML = '<img alt="Prévia do anexo" /><input type="hidden" data-news-attachment /><button type="button" data-remove-news-attachment aria-label="Remover anexo">×</button>'; item.querySelector("img").src = src; item.querySelector("[data-news-attachment]").value = src; box.querySelector(".admin-attachment-list").append(item); status.textContent = "Anexos prontos para enviar ao servidor ao salvar."; });
  } catch { status.textContent = "Não foi possível ler essa imagem."; }
  input.value = "";
});
form.addEventListener("submit", async (event) => {
  event.preventDefault(); const status = document.querySelector("[data-admin-success]"); status.textContent = "Enviando alterações e imagens ao servidor…";
  const button = form.querySelector('[type="submit"]'); button.disabled = true;
  try { const data = await persistImages(readData()); await api("content.php", { method: "PUT", body: JSON.stringify(data) }); status.textContent = "Alterações salvas no servidor e disponíveis para todos os visitantes."; render(data); }
  catch (error) { status.textContent = error.message; }
  finally { button.disabled = false; setTimeout(() => { if (status.textContent.startsWith("Alterações salvas")) status.textContent = ""; }, 6000); }
});
