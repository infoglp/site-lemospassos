const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initPageLoader() {
  const loader = document.createElement("div");
  loader.className = "page-loader";
  loader.setAttribute("aria-hidden", "true");
  loader.innerHTML = '<img src="./assets/lemos-passos.png" alt="" />';
  document.body.append(loader);
  let navigationTimer;

  function hideLoader({ clearTimer = true } = {}) {
    if (clearTimer) window.clearTimeout(navigationTimer);
    loader.classList.remove("is-visible");
    loader.setAttribute("aria-hidden", "true");
    loader.style.opacity = "0";
    loader.style.visibility = "hidden";
  }

  window.navigateWithLoader = (href) => {
    if (!href) return;

    loader.style.opacity = "";
    loader.style.visibility = "";
    loader.setAttribute("aria-hidden", "false");
    loader.classList.add("is-visible");
    navigationTimer = window.setTimeout(() => {
      window.location.href = href;
    }, reducedMotion ? 80 : 620);
  };

  hideLoader();
  window.addEventListener("load", () => hideLoader({ clearTimer: false }));
  window.addEventListener("pagehide", hideLoader);
  window.addEventListener("beforeunload", hideLoader);
  window.addEventListener("pageshow", () => {
    hideLoader();
    window.requestAnimationFrame(() => hideLoader({ clearTimer: false }));
    window.setTimeout(() => hideLoader({ clearTimer: false }), 80);
  });
  window.addEventListener("popstate", hideLoader);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") hideLoader();
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target === "_blank" || link.hasAttribute("download")) return;

    const url = new URL(link.href, window.location.href);
    const isExternal = url.origin !== window.location.origin;
    const isProtocolAction = ["mailto:", "tel:"].includes(url.protocol);
    const isSamePageHash = url.pathname === window.location.pathname && url.hash;

    if (isExternal || isProtocolAction || isSamePageHash) return;

    // The site root serves the one-time intro; internal Home/logo links should
    // always open the actual home page instead of replaying that intro.
    if (url.pathname === new URL("./", window.location.href).pathname && !url.hash) {
      url.pathname = `${url.pathname.replace(/\/$/, "")}/home.html`;
    }

    event.preventDefault();
    window.navigateWithLoader(url.href);
  });
}

function initIntro() {
  const firstLine = "acima de tudo,";
  const careLeadText = "o ";
  const careWordText = "cuidado.";
  const intro = document.querySelector(".intro");
  const typedLineOne = document.querySelector("#typedLineOne");
  const typedCareLead = document.querySelector("#typedCareLead");
  const typedCareWord = document.querySelector("#typedCareWord");
  const careLine = document.querySelector(".type-line-care");
  const cursor = document.querySelector("#cursor");
  const signature = document.querySelector("#signature");

  if (!intro || !typedLineOne || !typedCareLead || !typedCareWord || !cursor || !signature) return;

  const introSessionKey = "lemospassos-intro-seen";
  try {
    if (window.sessionStorage.getItem(introSessionKey) === "1") {
      window.location.replace(`home.html${window.location.hash}`);
      return;
    }
    window.sessionStorage.setItem(introSessionKey, "1");
  } catch {
    // If storage is unavailable, the internal navigation rewrite above still
    // prevents the intro from replaying through the site's own Home links.
  }

  const startDelay = 420;
  const lineGap = 300;
  const lineDuration = reducedMotion ? 520 : 900;
  const signatureDelay = 720;
  const zoomDelay = 1250;
  const pageDelay = 1550;

  function revealSignature() {
    cursor.remove();
    signature.classList.add("is-visible");
  }

  function enterHome() {
    intro.classList.add("is-zooming");

    window.setTimeout(() => {
      intro.classList.add("is-leaving");
    }, pageDelay - 620);

    window.setTimeout(() => {
      window.location.replace(`home.html${window.location.hash}`);
    }, pageDelay);
  }

  function animateIntroLine(line, direction, delay) {
    const offset = reducedMotion ? 0 : direction * 34;
    const animation = line.animate([
      { opacity: 0, transform: `translateY(${offset}px)` },
      { opacity: 1, transform: "translateY(0)" },
    ], {
      delay,
      duration: lineDuration,
      easing: "cubic-bezier(0.22, 0.75, 0.25, 1)",
      fill: "both",
    });
    animation.onfinish = () => animation.cancel();
  }

  typedLineOne.textContent = firstLine;
  typedCareLead.textContent = careLeadText;
  typedCareWord.textContent = careWordText;

  const secondLineDelay = startDelay + lineDuration + lineGap;
  animateIntroLine(typedLineOne.parentElement, -1, startDelay);
  animateIntroLine(careLine, 1, secondLineDelay);

  window.setTimeout(() => careLine.append(cursor), secondLineDelay);
  window.setTimeout(() => {
    revealSignature();
    window.setTimeout(enterHome, zoomDelay);
  }, secondLineDelay + lineDuration + signatureDelay);
}

function initFrontsExplorer() {
  const frontItems = document.querySelectorAll(".front-item");
  const frontPreview = document.querySelector(".front-preview");
  const frontPreviewImage = document.querySelector("#frontPreviewImage");
  const frontPreviewLabel = document.querySelector("#frontPreviewLabel");
  const frontPreviewIndex = document.querySelector(".front-preview-index");

  if (!frontItems.length || !frontPreview || !frontPreviewImage || !frontPreviewLabel || !frontPreviewIndex) return;

  const frontData = {
    grupo: {
      label: "O Grupo LemosPassos",
      index: "01 / 04",
      image: "./assets/fotos_sede_nova.png?v=20261008-2",
      alt: "Imagens das sedes do Grupo LemosPassos",
      href: "./#groupPage",
    },
    atuacoes: {
      label: "Atuações",
      index: "02 / 04",
      image: "./assets/card-atuacoes.jpg",
      alt: "Operação alimentícia profissional",
      href: "solucoes.html",
    },
    trabalhe: {
      label: "Trabalhe Conosco",
      index: "03 / 04",
      image: "./assets/gemini-gerated.png",
      alt: "Profissional do Grupo LemosPassos em uma cozinha",
      href: "trabalhe-conosco.html",
    },
    contatos: {
      label: "Contatos",
      index: "04 / 04",
      image: "./assets/img_contato.png",
      alt: "Pessoas diversas em reunião",
      href: "contato.html",
    },
  };

  function activateFront(item) {
    const data = frontData[item.dataset.front];
    if (!data) return;

    frontItems.forEach((frontItem) => {
      const isActive = frontItem === item;
      frontItem.classList.toggle("is-active", isActive);
      frontItem.setAttribute("aria-selected", String(isActive));
    });

    frontPreview.classList.add("is-changing", "is-visible");
    frontPreview.classList.toggle("is-contacts", item.dataset.front === "contatos");
    window.setTimeout(() => {
      frontPreviewImage.src = data.image;
      frontPreviewImage.alt = data.alt;
      frontPreviewLabel.textContent = data.label;
      frontPreviewIndex.textContent = data.index;
      frontPreview.classList.remove("is-changing");
    }, reducedMotion ? 0 : 180);
  }

  function moveFrontPreview(event) {
    if (window.innerWidth <= 720) return;

    const previewWidth = frontPreview.offsetWidth || 270;
    const previewHeight = frontPreview.offsetHeight || 360;
    const left = Math.min(event.clientX, window.innerWidth - previewWidth - 28);
    const top = Math.min(event.clientY, window.innerHeight - previewHeight - 28);

    frontPreview.style.left = `${Math.max(20, left)}px`;
    frontPreview.style.top = `${Math.max(20, top)}px`;
  }

  function hideFrontPreview() {
    if (window.innerWidth > 720) frontPreview.classList.remove("is-visible");
  }

  frontItems.forEach((item) => {
    item.addEventListener("mouseenter", (event) => {
      moveFrontPreview(event);
      activateFront(item);
    });
    item.addEventListener("mousemove", moveFrontPreview);
    item.addEventListener("mouseleave", hideFrontPreview);
    item.addEventListener("focus", () => {
      if (window.innerWidth > 720) {
        frontPreview.style.left = `${window.innerWidth / 2 - 135}px`;
        frontPreview.style.top = `${window.innerHeight / 2 - 180}px`;
      }
      activateFront(item);
    });
    item.addEventListener("click", () => {
      const data = frontData[item.dataset.front];
      if (data) window.navigateWithLoader(data.href);
    });
  });
}

function initActuationCards() {
  const actuationCards = document.querySelectorAll(".actuation-card");
  if (!actuationCards.length) return;

  const refreshedImages = {
    Educacional: "./assets/educacional-merenda.png?v=20261008-2",
    Facilities: "./assets/facilities-nova.jpg?v=20261008-2",
    "Administração e Alojamentos": "./assets/alojamento-novo.png?v=20261008-2",
  };

  actuationCards.forEach((card) => {
    const heading = card.querySelector("h2, h3")?.textContent.trim();
    if (refreshedImages[heading]) {
      card.style.setProperty("--card-image", `url('${refreshedImages[heading]}')`);
    }

    card.addEventListener("click", () => {
      if (card.dataset.href) {
        window.navigateWithLoader(card.dataset.href);
        return;
      }

      actuationCards.forEach((item) => item.classList.remove("is-active"));
      card.classList.add("is-active");
    });
  });
}

function initCounters() {
  const counters = document.querySelectorAll(".group-stat strong[data-target]");
  if (!counters.length) return;

  function animateCounter(counter, duration = 2000) {
    const target = Number(counter.dataset.target);
    const startTime = performance.now();
    const format = new Intl.NumberFormat("pt-BR");

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = `+${format.format(Math.floor(target * eased))}`;

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      }
    }

    window.requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      counters.forEach((counter) => {
        if (reducedMotion) {
          counter.textContent = `+${new Intl.NumberFormat("pt-BR").format(Number(counter.dataset.target))}`;
        } else if (!counter.dataset.started) {
          counter.dataset.started = "true";
          animateCounter(counter);
        }
      });

      observer.disconnect();
    });
  }, { threshold: 0.35 });

  counterObserver.observe(counters[0].closest(".group-stats"));
}

const cmsBodyDefaults = [
  "Em cumprimento à legislação vigente, disponibilizamos o Relatório de Transparência e Igualdade Salarial de Mulheres e Homens, documento que reúne informações sobre a remuneração de profissionais e reforça o compromisso da organização com transparência, equidade e responsabilidade.",
  "O presidente do Grupo Lemospassos, Ademar Lemos Jr., foi homenageado pelo CRA-BA durante a solenidade do Jubileu de Diamante da Administração, realizada na FIEB no dia 17/09. O encontro reuniu profissionais e autoridades para celebrar os 60 anos da regulamentação da profissão, reforçando a importância da ética, da técnica e da boa gestão para o desenvolvimento da sociedade. A programação seguiu com visitas técnicas dedicadas à história, às conquistas e ao futuro da Administração.",
  "Ao longo dos anos, aprendemos que a confiança não se conquista de uma vez só. Ela nasce nos gestos diários, nas escolhas que se repetem e na relação que se fortalece a cada etapa. No Dia do Cliente, celebramos essa construção conjunta, feita de histórias que se entrelaçam com a nossa e dão sentido ao caminho que seguimos.",
  "Um prato colorido não é só bonito: ele mostra a diversidade de nutrientes presentes na refeição. Cada cor tem algo diferente a oferecer ao nosso organismo. Variar frutas, verduras e legumes é uma forma simples de tornar a alimentação mais equilibrada, saborosa e nutritiva.",
];
const cmsDefaults = {
  metrics: { meals: 400000, employees: 3500, restaurants: 431 },
  partners: {
    Hospitalar: ["https://www.lemospassos.com.br/wp-content/uploads/2019/08/HDT.png", "https://www.lemospassos.com.br/wp-content/uploads/2023/01/RD_DROGASIL.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/2.png"],
    Restaurantes: ["https://www.lemospassos.com.br/wp-content/uploads/2023/01/AMBEV.png", "https://www.lemospassos.com.br/wp-content/uploads/2023/01/CARREFOUR.png", "https://www.lemospassos.com.br/wp-content/uploads/2023/01/IBIRA.png", "https://www.lemospassos.com.br/wp-content/uploads/2023/01/BRISA.png"],
    "Área de Segurança": ["https://www.lemospassos.com.br/wp-content/uploads/2023/01/ERB.png", "https://www.lemospassos.com.br/wp-content/uploads/2023/01/MOTECH.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/9.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/11.png"],
    "Merenda Escolar": ["https://www.lemospassos.com.br/wp-content/uploads/2019/06/12.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/13.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/14.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/34.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/16.png", "https://www.lemospassos.com.br/wp-content/uploads/2019/06/17.png"],
  },
  news: [
    { title: "Relatório de Transparência e Igualdade Salarial de Mulheres e Homens", excerpt: "Confira o relatório institucional disponibilizado pelo Grupo LemosPassos.", image: "./assets/contato.jpg", url: "https://www.lemospassos.com.br/relatorio-de-transparencia-e-igualdade-salarial-de-mulheres-e-homens/" },
    { title: "60 anos da Administração", excerpt: "Uma homenagem à história, à ética e à boa gestão que transformam a sociedade.", image: "./assets/card-atuacoes.jpg", url: "https://www.lemospassos.com.br/60-anos-da-administracao/" },
    { title: "Dia do Cliente", excerpt: "A confiança nasce nos gestos diários e se fortalece em cada etapa da nossa relação.", image: "./assets/card-contatos.jpg", url: "https://www.lemospassos.com.br/dia-do-cliente-2/" },
    { title: "Dica da Nutri", excerpt: "Um prato colorido mostra a diversidade de nutrientes presentes na refeição.", image: "./assets/populares.jpg", url: "https://www.lemospassos.com.br/dica-da-nutri-2/" },
  ],
  mapImage: "./assets/mapa-lemospassos.png",
  mapStates: ["AP", "AM", "PA", "CE", "PE", "BA", "SE", "MT", "GO", "DF", "MG", "SP"],
};

async function getCmsData() {
  try {
    const response = await fetch("./api/content.php", { cache: "no-store" });
    if (!response.ok) throw new Error("CMS indisponível");
    const payload = await response.json();
    const saved = payload.content || {};
    const data = { ...cmsDefaults, ...saved, metrics: { ...cmsDefaults.metrics, ...(saved.metrics || {}) }, partners: { ...cmsDefaults.partners, ...(saved.partners || {}) }, news: Array.isArray(saved.news) ? saved.news : cmsDefaults.news };
    data.news = data.news.map((item, index) => ({ ...item, body: item.body || cmsBodyDefaults[index] || item.excerpt || "", attachments: Array.isArray(item.attachments) ? item.attachments : [] }));
    return data;
  } catch {
    return cmsDefaults;
  }
}

function escapeCmsHtml(value) { return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]); }

async function initCmsContent() {
  const data = await getCmsData();
  document.querySelectorAll("[data-metric]").forEach((counter) => {
    if (data.metrics[counter.dataset.metric] != null) counter.dataset.target = data.metrics[counter.dataset.metric];
  });

  const categoryRoot = document.querySelector("[data-partner-categories]");
  if (categoryRoot) {
    categoryRoot.innerHTML = `<div class="clients-title-row"><p class="eyebrow group-eyebrow"><span></span> Empresas que caminham conosco</p><span class="cms-hint">Por categoria</span></div><div class="partner-category-grid">${Object.entries(data.partners).map(([category, images]) => `<section class="partner-category"><h4>${escapeCmsHtml(category)}</h4><div class="partner-window"><div class="partner-track">${images.filter(Boolean).map((image) => `<div class="client-logo"><img src="${escapeCmsHtml(image)}" alt="Empresa parceira da categoria ${escapeCmsHtml(category)}" /></div>`).join("")}</div></div></section>`).join("")}</div>`;
  }

  const newsMarkup = (item, index, heading = "h3") => `<a class="news-card" href="./noticias.html?noticia=${index}"><img src="${escapeCmsHtml(item.image)}" alt="" /><span class="news-card-shade"></span><div><small>Notícia</small><${heading}>${escapeCmsHtml(item.title)}</${heading}><p>${escapeCmsHtml(item.excerpt || "")}</p></div><b>↗</b></a>`;
  const newsRoot = document.querySelector("[data-news-carousel]");
  if (newsRoot) newsRoot.innerHTML = data.news.filter((item) => item.title && item.image).map((item, index) => newsMarkup(item, index)).join("");

  const newsPage = document.querySelector("[data-news-page]");
  if (newsPage) {
    const news = data.news.filter((item) => item.title && item.image);
    const selected = Number(new URLSearchParams(window.location.search).get("noticia"));
    const feature = document.querySelector("[data-news-feature]");
    if (feature && news[selected]) feature.innerHTML = `<article class="news-feature"><img src="${escapeCmsHtml(news[selected].image)}" alt="" /><div><small>Notícia</small><h2>${escapeCmsHtml(news[selected].title)}</h2><p class="news-feature-body">${escapeCmsHtml(news[selected].body || news[selected].excerpt || "")}</p>${(news[selected].attachments || []).map((attachment) => `<img class="news-attachment" src="${escapeCmsHtml(attachment)}" alt="Anexo da notícia" />`).join("")}<a class="text-link" href="./noticias.html">Voltar para notícias ↗</a></div></article>`;
    newsPage.innerHTML = news.map((item, index) => newsMarkup(item, index, "h2")).join("");
  }
  return data;
}

function initOfficialLogos() {
  document.querySelectorAll('img[src$="lemos-passos.png"]').forEach((logo) => {
    logo.src = "./assets/logo-oficial.png";
  });
  document.querySelectorAll('link[rel="icon"]').forEach((icon) => {
    icon.href = "./assets/logo-oficial.png";
  });
}

function initBrazilMap(cmsData) {
  const map = document.querySelector("[data-brazil-map]");
  const image = map?.querySelector("img");
  if (!map || !image) return;

  image.src = cmsData.mapImage || "./assets/mapa-lemospassos.png";
  const statesCaption = map.querySelector("[data-map-states]");
  if (statesCaption) {
    const states = Array.isArray(cmsData.mapStates) ? cmsData.mapStates : cmsDefaults.mapStates;
    statesCaption.textContent = states.join(" · ");
  }

  fetch(image.src)
    .then((response) => {
      if (!response.ok) throw new Error("Mapa indisponível");
      return response.text();
    })
    .then((svg) => {
      if (!svg.trim().startsWith("<svg")) return;
      const holder = document.createElement("div");
      holder.className = "brazil-units-map-svg";
      holder.innerHTML = svg;
      image.replaceWith(holder);
    })
    .catch(() => {
      image.classList.add("is-fallback-visible");
    });
}

function initMailForms() {
  const contactForm = document.querySelector("#contactForm");

  function openMailForm(form, recipient, subjectPrefix) {
    const data = new FormData(form);
    const name = data.get("name") || "";
    const email = data.get("email") || "";
    const subject = data.get("subject") || data.get("area") || "Contato pelo site";
    const message = data.get("message") || "";
    const bodyLines = [
      `Nome: ${name}`,
      `E-mail: ${email}`,
      data.get("area") ? `Área de interesse: ${data.get("area")}` : "",
      "",
      "Mensagem:",
      message,
    ].filter(Boolean);

    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(`${subjectPrefix}: ${subject}`)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    window.location.href = mailto;
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      openMailForm(contactForm, "vanessasilva@lemospassos.com", "Contato pelo site");
    });
  }
}

function initSocialLinks() {
  document.querySelectorAll('.site-credit a[href="./admin.html"]').forEach((link) => link.remove());

  const stylesheet = document.querySelector('link[rel="stylesheet"][href*="styles.css"]');
  if (stylesheet) {
    const stylesheetUrl = new URL(stylesheet.href);
    stylesheetUrl.searchParams.set("v", "mobile-menu-footer-20261008");
    stylesheet.href = stylesheetUrl.href;
  }

  const makeSocialMarkup = (color) => `<div class="social-links" aria-label="Redes sociais" style="align-items:center;display:flex;flex:0 0 auto;gap:10px">
    <a href="https://www.instagram.com/grupolemospassos" target="_blank" rel="noopener noreferrer" aria-label="Instagram do Grupo LemosPassos" style="align-items:center;border:1px solid ${color};border-radius:50%;color:${color};display:inline-flex;height:36px;justify-content:center;width:36px"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="${color}" stroke="none"/></svg></a>
    <a href="https://www.linkedin.com/in/grupo-lemos-passos-180b8b17a" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn do Grupo LemosPassos" style="align-items:center;border:1px solid ${color};border-radius:50%;color:${color};display:inline-flex;height:36px;justify-content:center;width:36px"><svg width="20" height="20" class="linkedin-mark" viewBox="0 0 24 24" fill="${color}" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg></a>
  </div>`;

  document.querySelectorAll(".home-nav a").forEach((link) => {
    if (link.textContent.trim().toLocaleLowerCase("pt-BR") === "contato") link.remove();
  });

  document.querySelectorAll(".home-nav").forEach((nav) => {
    const hasNewsLink = [...nav.querySelectorAll("a")].some((link) => {
      const target = new URL(link.href, window.location.href);
      return target.pathname.endsWith("/noticias.html");
    });
    if (hasNewsLink) return;

    const newsLink = document.createElement("a");
    newsLink.href = "./noticias.html";
    newsLink.textContent = "Notícias";
    const lgpdLink = [...nav.querySelectorAll("a")].find((link) => link.textContent.trim().toLocaleLowerCase("pt-BR") === "lgpd");
    const employeeLink = nav.querySelector(".employee-access");
    nav.insertBefore(newsLink, lgpdLink || employeeLink || null);
  });

  document.querySelectorAll(".home-header, .page-header").forEach((header) => {
    if (header.querySelector(".social-links")) return;
    const homeMenu = header.querySelector(".home-menu");
    const color = header.classList.contains("page-header") && !header.classList.contains("page-header-light") && !header.classList.contains("page-header-over") ? "#052d4b" : "#ffffff";
    if (homeMenu) homeMenu.insertAdjacentHTML("beforebegin", makeSocialMarkup(color));
  });

  document.querySelectorAll(".site-credit").forEach((footer) => {
    if (footer.querySelector(".social-links")) return;
    const links = footer.querySelectorAll("a");
    const lastLink = links[links.length - 1];
    if (lastLink) lastLink.insertAdjacentHTML("beforebegin", makeSocialMarkup("#ffffff"));
    else footer.insertAdjacentHTML("beforeend", makeSocialMarkup("#ffffff"));
  });
}

function initMobileMenus() {
  document.querySelectorAll(".home-header, .page-header").forEach((header, index) => {
    const nav = header.querySelector(".home-nav");
    if (!nav || header.querySelector(".mobile-menu-toggle")) return;

    const menuLink = header.querySelector(".home-menu");
    if (menuLink && !nav.querySelector("[data-mobile-contact]") && menuLink.getAttribute("href")) {
      const contactLink = document.createElement("a");
      contactLink.href = menuLink.href;
      contactLink.textContent = "Fale conosco";
      contactLink.dataset.mobileContact = "true";
      nav.append(contactLink);
    }

    if (!nav.id) nav.id = `primary-navigation-${index + 1}`;
    const toggle = document.createElement("button");
    toggle.className = "mobile-menu-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Abrir menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", nav.id);
    toggle.innerHTML = '<span></span><span></span><span></span>';
    header.append(toggle);

    const closeMenu = () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      nav.classList.toggle("is-open", !isOpen);
      toggle.setAttribute("aria-expanded", String(!isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("click", (event) => {
      if (!header.contains(event.target)) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  });
}

initPageLoader();
initSocialLinks();
initMobileMenus();
initOfficialLogos();
initIntro();
initFrontsExplorer();
initActuationCards();
initCmsContent().then((cmsData) => { initCounters(); initBrazilMap(cmsData); }).catch(() => { initCounters(); initBrazilMap(cmsDefaults); });
initMailForms();
