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

  const typeDelay = 128;
  const startDelay = 420;
  const suspenseDelay = 1180;
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
      window.location.href = "home.html";
    }, pageDelay);
  }

  function typeText(target, text, delayStart, onComplete) {
    [...text].forEach((character, index) => {
      window.setTimeout(() => {
        target.textContent += character;

        if (index === text.length - 1 && onComplete) {
          onComplete();
        }
      }, delayStart + index * typeDelay);
    });
  }

  if (reducedMotion) {
    typedLineOne.textContent = firstLine;
    typedCareLead.textContent = careLeadText;
    typedCareWord.textContent = careWordText;
    revealSignature();
    window.setTimeout(enterHome, 700);
    return;
  }

  typeText(typedLineOne, firstLine, startDelay, () => {
    window.setTimeout(() => {
      careLine.append(cursor);
      typeText(typedCareLead, careLeadText, 0, () => {
        typeText(typedCareWord, careWordText, 0, () => {
          window.setTimeout(() => {
            revealSignature();
            window.setTimeout(enterHome, zoomDelay);
          }, signatureDelay);
        });
      });
    }, suspenseDelay);
  });
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
      image: "./assets/hero-kitchen.png",
      alt: "Cozinha profissional do Grupo LemosPassos",
      href: "home.html#groupPage",
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
      image: "./assets/card-contatos.jpg",
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

  actuationCards.forEach((card) => {
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

  function animateCounter(counter, duration = 3000) {
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

const CMS_KEY = "lemospassos-cms-v1";
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
};

function getCmsData() {
  try {
    const data = { ...cmsDefaults, ...JSON.parse(localStorage.getItem(CMS_KEY) || "{}") };
    data.news = (data.news || []).map((item, index) => ({ ...item, body: item.body || cmsBodyDefaults[index] || item.excerpt || "", attachments: item.attachments || [] }));
    return data;
  } catch {
    return cmsDefaults;
  }
}

function initCmsContent() {
  const data = getCmsData();
  document.querySelectorAll("[data-metric]").forEach((counter) => {
    if (data.metrics[counter.dataset.metric] != null) counter.dataset.target = data.metrics[counter.dataset.metric];
  });

  const categoryRoot = document.querySelector("[data-partner-categories]");
  if (categoryRoot) {
    categoryRoot.innerHTML = `<div class="clients-title-row"><p class="eyebrow group-eyebrow"><span></span> Empresas que caminham conosco</p><span class="cms-hint">Por categoria</span></div><div class="partner-category-grid">${Object.entries(data.partners).map(([category, images]) => `<section class="partner-category"><h4>${category}</h4><div class="partner-window"><div class="partner-track">${images.filter(Boolean).map((image) => `<div class="client-logo"><img src="${image}" alt="Empresa parceira da categoria ${category}" /></div>`).join("")}</div></div></section>`).join("")}</div>`;
  }

  const newsMarkup = (item, index, heading = "h3") => `<a class="news-card" href="./noticias.html?noticia=${index}"><img src="${item.image}" alt="" /><span class="news-card-shade"></span><div><small>Notícia</small><${heading}>${item.title}</${heading}><p>${item.excerpt || ""}</p></div><b>↗</b></a>`;
  const newsRoot = document.querySelector("[data-news-carousel]");
  if (newsRoot) newsRoot.innerHTML = data.news.filter((item) => item.title && item.image).map((item, index) => newsMarkup(item, index)).join("");

  const newsPage = document.querySelector("[data-news-page]");
  if (newsPage) {
    const news = data.news.filter((item) => item.title && item.image);
    const selected = Number(new URLSearchParams(window.location.search).get("noticia"));
    const feature = document.querySelector("[data-news-feature]");
    if (feature && news[selected]) feature.innerHTML = `<article class="news-feature"><img src="${news[selected].image}" alt="" /><div><small>Notícia</small><h2>${news[selected].title}</h2><p class="news-feature-body">${news[selected].body || news[selected].excerpt || ""}</p>${(news[selected].attachments || []).map((attachment) => `<img class="news-attachment" src="${attachment}" alt="Anexo da notícia" />`).join("")}<a class="text-link" href="./noticias.html">Voltar para notícias ↗</a></div></article>`;
    newsPage.innerHTML = news.map((item, index) => newsMarkup(item, index, "h2")).join("");
  }
}

function initOfficialLogos() {
  document.querySelectorAll('img[src$="lemos-passos.png"]').forEach((logo) => {
    logo.src = "./assets/logo-oficial.png";
  });
  document.querySelectorAll('link[rel="icon"]').forEach((icon) => {
    icon.href = "./assets/logo-oficial.png";
  });
}

function initBrazilMap() {
  const map = document.querySelector("[data-brazil-map]");
  const image = map?.querySelector("img");
  if (!map || !image) return;

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

function initCareerDisclosure() {
  const careerForm = document.querySelector("#careerForm");
  const anchor = document.querySelector("[data-career-form-anchor]");
  if (!careerForm || !anchor) return;

  const disclosure = document.createElement("details");
  disclosure.className = "career-disclosure";
  disclosure.innerHTML = '<summary><span>Envie seu currÃ­culo</span><span aria-hidden="true">+</span></summary><p>Preencha seus dados para preparar o envio do currÃ­culo por e-mail.</p>';
  disclosure.replaceChildren();
  const summary = document.createElement("summary");
  summary.innerHTML = '<span>Envie seu curriculo</span><span aria-hidden="true">+</span>';
  const description = document.createElement("p");
  description.textContent = "Preencha seus dados para preparar o envio do curriculo por e-mail.";
  disclosure.append(summary, description);
  anchor.append(disclosure);
  disclosure.append(careerForm);
}

function initMailForms() {
  const careerForm = document.querySelector("#careerForm");
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
      "",
      form === careerForm ? "Observação: anexar currículo a este e-mail antes de enviar." : "",
    ].filter(Boolean);

    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(`${subjectPrefix}: ${subject}`)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    window.location.href = mailto;
  }

  if (careerForm) {
    careerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!careerForm.reportValidity()) return;
      openMailForm(careerForm, "curriculos@lemospassos.com", "Currículo pelo site");
    });
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
  const stylesheet = document.querySelector('link[rel="stylesheet"][href*="styles.css"]');
  if (stylesheet) {
    const stylesheetUrl = new URL(stylesheet.href);
    stylesheetUrl.searchParams.set("v", "social-footer-20260930");
    stylesheet.href = stylesheetUrl.href;
  }

  const makeSocialMarkup = (color) => `<div class="social-links" aria-label="Redes sociais" style="align-items:center;display:flex;flex:0 0 auto;gap:10px">
    <a href="https://www.instagram.com/grupolemospassos" target="_blank" rel="noopener noreferrer" aria-label="Instagram do Grupo LemosPassos" style="align-items:center;border:1px solid ${color};border-radius:50%;color:${color};display:inline-flex;height:36px;justify-content:center;width:36px"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="${color}" stroke="none"/></svg></a>
    <a href="https://www.linkedin.com/in/grupo-lemos-passos-180b8b17a" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn do Grupo LemosPassos" style="align-items:center;border:1px solid ${color};border-radius:50%;color:${color};display:inline-flex;height:36px;justify-content:center;width:36px"><svg width="20" height="20" class="linkedin-mark" viewBox="0 0 24 24" fill="${color}" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg></a>
  </div>`;

  document.querySelectorAll(".home-nav a").forEach((link) => {
    if (link.textContent.trim().toLocaleLowerCase("pt-BR") === "contato") link.remove();
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

initPageLoader();
initSocialLinks();
initOfficialLogos();
initIntro();
initFrontsExplorer();
initActuationCards();
initCmsContent();
initCounters();
initBrazilMap();
initCareerDisclosure();
initMailForms();
