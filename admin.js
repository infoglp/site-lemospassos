const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "Lemos2@30!";
const CMS_KEY = "lemospassos-cms-v1";
const categories = ["Hospitalar", "Restaurantes", "Área de Segurança", "Merenda Escolar"];
const defaults = { metrics: { meals: 400000, employees: 3500, restaurants: 431 }, partners: { Hospitalar: ["https://www.lemospassos.com.br/wp-content/uploads/2019/08/HDT.png", "https://www.lemospassos.com.br/wp-content/uploads/2023/01/RD_DROGASIL.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/2.png"], Restaurantes: ["https://www.lemospassos.com.br/wp-content/uploads/2023/01/AMBEV.png", "https://www.lemospassos.com.br/wp-content/uploads/2023/01/CARREFOUR.png", "https://www.lemospassos.com.br/wp-content/uploads/2023/01/IBIRA.png", "https://www.lemospassos.com.br/wp-content/uploads/2023/01/BRISA.png"], "Área de Segurança": ["https://www.lemospassos.com.br/wp-content/uploads/2023/01/ERB.png", "https://www.lemospassos.com.br/wp-content/uploads/2023/01/MOTECH.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/9.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/11.png"], "Merenda Escolar": ["https://www.lemospassos.com.br/wp-content/uploads/2019/06/12.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/13.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/14.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/34.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/16.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/17.png"] }, news: [{ title: "Relatório de Transparência e Igualdade Salarial de Mulheres e Homens", excerpt: "Confira o relatório institucional disponibilizado pelo Grupo LemosPassos.", image: "./assets/contato.jpg", url: "https://www.lemospassos.com.br/relatorio-de-transparencia-e-igualdade-salarial-de-mulheres-e-homens/" }, { title: "60 anos da Administração", excerpt: "Uma homenagem à história, à ética e à boa gestão.", image: "./assets/card-atuacoes.jpg", url: "https://www.lemospassos.com.br/60-anos-da-administracao/" }, { title: "Dia do Cliente", excerpt: "A confiança nasce nos gestos diários e se fortalece em cada etapa.", image: "./assets/card-contatos.jpg", url: "https://www.lemospassos.com.br/dia-do-cliente-2/" }, { title: "Dica da Nutri", excerpt: "Um prato colorido mostra a diversidade de nutrientes.", image: "./assets/populares.jpg", url: "https://www.lemospassos.com.br/dica-da-nutri-2/" }] };
defaults.mapImage = "./assets/mapa-lemospassos.png";
const starterBodies = [
  "Em cumprimento à legislação vigente, disponibilizamos o Relatório de Transparência e Igualdade Salarial de Mulheres e Homens, documento que reúne informações sobre a remuneração de profissionais e reforça o compromisso da organização com transparência, equidade e responsabilidade.",
  "O presidente do Grupo Lemospassos, Ademar Lemos Jr., foi homenageado pelo CRA-BA durante a solenidade do Jubileu de Diamante da Administração, realizada na FIEB no dia 17/09. O encontro reuniu profissionais e autoridades para celebrar os 60 anos da regulamentação da profissão, reforçando a importância da ética, da técnica e da boa gestão para o desenvolvimento da sociedade. A programação seguiu com visitas técnicas dedicadas à história, às conquistas e ao futuro da Administração.",
  "Ao longo dos anos, aprendemos que a confiança não se conquista de uma vez só. Ela nasce nos gestos diários, nas escolhas que se repetem e na relação que se fortalece a cada etapa. No Dia do Cliente, celebramos essa construção conjunta, feita de histórias que se entrelaçam com a nossa e dão sentido ao caminho que seguimos.",
  "Um prato colorido não é só bonito: ele mostra a diversidade de nutrientes presentes na refeição. Cada cor tem algo diferente a oferecer ao nosso organismo. Variar frutas, verduras e legumes é uma forma simples de tornar a alimentação mais equilibrada, saborosa e nutritiva.",
];
const getData = () => { try { const data = { ...defaults, ...JSON.parse(localStorage.getItem(CMS_KEY) || "{}") }; data.news = (data.news || []).map((item, index) => ({ ...item, body: item.body || starterBodies[index] || item.excerpt || "", attachments: item.attachments || [] })); return data; } catch { return defaults; } };
const saveData = (data) => localStorage.setItem(CMS_KEY, JSON.stringify(data));
const login = document.querySelector("[data-admin-login]");
const panel = document.querySelector("[data-admin-panel]");
const form = document.querySelector("[data-cms-form]");
const editor = document.querySelector("[data-partner-editor]");
const newsEditor = document.querySelector("[data-news-editor]");
document.querySelector("[data-admin-login] img")?.setAttribute("src", "./assets/logo-oficial.png");
document.querySelector("link[rel='icon']")?.setAttribute("href", "./assets/logo-oficial.png");
const backLink = document.createElement("a");
backLink.className = "admin-back-link";
backLink.href = "./home.html";
backLink.textContent = "← Voltar para o site";
document.querySelector(".admin-panel-head")?.prepend(backLink);

function render(data) {
  form.meals.value = data.metrics.meals; form.employees.value = data.metrics.employees; form.restaurants.value = data.metrics.restaurants;
  form.querySelector("[data-map-image-url]").value = data.mapImage || defaults.mapImage;
  form.querySelector("[data-map-image-preview]").src = data.mapImage || defaults.mapImage;
  editor.innerHTML = categories.map((category) => `<fieldset class="admin-fieldset"><legend>${category}</legend><div class="admin-image-list" data-category="${category}">${(data.partners[category] || []).map((url) => `<div class="admin-image-row"><img class="admin-image-preview" src="${url}" alt="" /><input value="${url}" data-image-url /><input type="file" accept="image/*" data-image-file /><button type="button" data-remove-image>Remover</button></div>`).join("")}</div><button type="button" class="admin-small-button" data-add-image data-category="${category}">+ Adicionar imagem</button></fieldset>`).join("");
  newsEditor.innerHTML = (data.news || []).map((item, index) => `<fieldset class="admin-fieldset" data-news-index="${index}"><legend>Notícia ${index + 1}</legend><label>Título<input value="${item.title || ""}" data-news-title /></label><label>Resumo<textarea data-news-excerpt>${item.excerpt || ""}</textarea></label><label>Imagem<input value="${item.image || ""}" data-news-image /></label><label>Link<input value="${item.url || ""}" data-news-url /></label><button type="button" class="admin-small-button" data-remove-news>Remover notícia</button></fieldset>`).join("");
}

function enhanceNewsEditor(data) {
  newsEditor.querySelectorAll("[data-news-index]").forEach((box, index) => {
    const item = data.news[index] || {};
    const linkInput = box.querySelector("[data-news-url]");
    if (!linkInput) return;
    const body = document.createElement("textarea");
    body.dataset.newsBody = "";
    body.value = item.body || "";
    body.rows = 7;
    linkInput.closest("label").firstChild.textContent = "Corpo da Notícia";
    linkInput.replaceWith(body);
    const attachments = document.createElement("label");
    attachments.innerHTML = `Anexos da notícia<input type="file" accept="image/*" multiple data-news-files /><div class="admin-attachment-list"></div>`;
    box.append(attachments);
    const list = attachments.querySelector(".admin-attachment-list");
    (item.attachments || []).forEach((src) => list.insertAdjacentHTML("beforeend", `<div class="admin-attachment"><img src="${src}" alt="" /><input type="hidden" value="${src}" data-news-attachment /></div>`));
  });
}

function readData() {
  const data = getData();
  data.metrics = { meals: Number(form.meals.value), employees: Number(form.employees.value), restaurants: Number(form.restaurants.value) };
  data.mapImage = form.querySelector("[data-map-image-url]").value.trim() || defaults.mapImage;
  data.partners = Object.fromEntries(categories.map((category) => [category, [...document.querySelectorAll(`[data-category="${category}"] [data-image-url]`)].map((input) => input.value.trim()).filter(Boolean)]));
  data.news = [...document.querySelectorAll("[data-news-index]")].map((box) => ({ title: box.querySelector("[data-news-title]").value.trim(), excerpt: box.querySelector("[data-news-excerpt]").value.trim(), body: box.querySelector("[data-news-body]").value.trim(), image: box.querySelector("[data-news-image]").value.trim(), attachments: [...box.querySelectorAll("[data-news-attachment]")].map((input) => input.value), url: "" })).filter((item) => item.title);
  return data;
}

document.querySelector("[data-admin-login-form]").addEventListener("submit", (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); if (data.get("username") === ADMIN_USER && data.get("password") === ADMIN_PASSWORD) { sessionStorage.setItem("lemospassos-admin", "1"); login.classList.add("is-hidden"); panel.classList.remove("is-hidden"); render(getData()); } else document.querySelector("[data-admin-error]").textContent = "Usuário ou senha inválidos."; });
document.querySelector("[data-admin-logout]").addEventListener("click", () => { sessionStorage.removeItem("lemospassos-admin"); panel.classList.add("is-hidden"); login.classList.remove("is-hidden"); });
document.querySelector("[data-admin-login-form]").addEventListener("submit", () => setTimeout(() => enhanceNewsEditor(getData()), 0));
document.querySelector("[data-add-news]").addEventListener("click", () => { const data = getData(); data.news.push({ title: "", excerpt: "", body: "", image: "./assets/hero-kitchen.png", attachments: [], url: "" }); render(data); enhanceNewsEditor(data); });
editor.addEventListener("click", (event) => { if (event.target.matches("[data-remove-image]")) event.target.closest(".admin-image-row").remove(); if (event.target.matches("[data-add-image]")) { const box = document.querySelector(`[data-category="${event.target.dataset.category}"]`); box.insertAdjacentHTML("beforeend", '<div class="admin-image-row"><img class="admin-image-preview" alt="" /><input placeholder="URL ou caminho da imagem" data-image-url /><input type="file" accept="image/*" data-image-file /><button type="button" data-remove-image>Remover</button></div>'); } });
editor.addEventListener("change", (event) => { if (!event.target.matches("[data-image-file]") || !event.target.files[0]) return; const reader = new FileReader(); reader.onload = () => { const row = event.target.closest(".admin-image-row"); row.querySelector("[data-image-url]").value = reader.result; row.querySelector(".admin-image-preview")?.setAttribute("src", reader.result); }; reader.readAsDataURL(event.target.files[0]); });
form.addEventListener("change", (event) => { if (!event.target.matches("[data-map-image-file]") || !event.target.files[0]) return; const reader = new FileReader(); reader.onload = () => { form.querySelector("[data-map-image-url]").value = reader.result; form.querySelector("[data-map-image-preview]").src = reader.result; }; reader.readAsDataURL(event.target.files[0]); });
form.querySelector("[data-map-image-url]").addEventListener("input", (event) => { form.querySelector("[data-map-image-preview]").src = event.target.value.trim() || defaults.mapImage; });
newsEditor.addEventListener("click", (event) => { if (event.target.matches("[data-remove-news]")) event.target.closest("[data-news-index]").remove(); });
form.addEventListener("submit", (event) => { event.preventDefault(); const status = document.querySelector("[data-admin-success]"); try { saveData(readData()); status.textContent = "Alterações salvas neste navegador."; } catch { status.textContent = "Não foi possível salvar. Tente uma imagem de mapa menor."; } setTimeout(() => status.textContent = "", 5000); });
if (sessionStorage.getItem("lemospassos-admin") === "1") { login.classList.add("is-hidden"); panel.classList.remove("is-hidden"); const data = getData(); render(data); enhanceNewsEditor(data); }
