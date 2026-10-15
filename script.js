const whatsappNumber = "5588996736799";
const whatsappMessage =
  "Olá, Inovarejo! Vim pelo site e gostaria de entender como vocês podem ajudar minha empresa com marketing, campanhas e comunicação.";

const canonicalUrl = window.location.href.split("#")[0];
const canonicalLink = document.createElement("link");
canonicalLink.rel = "canonical";
canonicalLink.href = canonicalUrl;
document.head.appendChild(canonicalLink);

const ogUrlMeta = document.createElement("meta");
ogUrlMeta.setAttribute("property", "og:url");
ogUrlMeta.content = canonicalUrl;
document.head.appendChild(ogUrlMeta);

const organizationSchema = document.getElementById("organization-schema");
if (organizationSchema) {
  const schemaData = JSON.parse(organizationSchema.textContent);
  schemaData.url = canonicalUrl;
  schemaData.telephone = "+55-88-99673-6799";
  schemaData.contactPoint = [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: "+55-88-99673-6799",
      availableLanguage: ["pt-BR"]
    }
  ];
  organizationSchema.textContent = JSON.stringify(schemaData);
}

if (window.lucide && typeof window.lucide.createIcons === "function") {
  window.lucide.createIcons();
}

const buildWhatsAppLink = (customMessage = whatsappMessage) => {
  const encodedMessage = encodeURIComponent(customMessage);

  if (whatsappNumber.trim()) {
    return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  }

  return `https://wa.me/?text=${encodedMessage}`;
};

document.querySelectorAll("[data-whatsapp-cta]").forEach((link) => {
  link.setAttribute("href", buildWhatsAppLink());
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noreferrer");
});

const menuToggle = document.querySelector(".menu-toggle");
const siteMenu = document.querySelector(".site-menu");

if (menuToggle && siteMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  const closeMenu = () => {
    siteMenu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  siteMenu.querySelectorAll("a").forEach((item) => {
    item.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!siteMenu.classList.contains("is-open")) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    if (siteMenu.contains(target) || menuToggle.contains(target)) {
      return;
    }

    closeMenu();
  });
}

const faqButtons = document.querySelectorAll(".faq-question");
faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";

    faqButtons.forEach((item) => {
      item.setAttribute("aria-expanded", "false");
      const answer = item.nextElementSibling;
      if (answer) {
        answer.style.maxHeight = null;
      }
    });

    if (!expanded) {
      button.setAttribute("aria-expanded", "true");
      const answer = button.nextElementSibling;
      if (answer) {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    }
  });
});

const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll(".about-carousel-slide")];
  const dots = [...carousel.querySelectorAll("[data-carousel-dot]")];
  const prevButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
  let autoplayTimer;

  if (activeIndex < 0) {
    activeIndex = 0;
  }

  const setSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = undefined;
    }
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = window.setInterval(() => {
      setSlide(activeIndex + 1);
    }, 5500);
  };

  prevButton?.addEventListener("click", () => {
    setSlide(activeIndex - 1);
    startAutoplay();
  });

  nextButton?.addEventListener("click", () => {
    setSlide(activeIndex + 1);
    startAutoplay();
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      setSlide(dotIndex);
      startAutoplay();
    });
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", startAutoplay);

  setSlide(activeIndex);
  startAutoplay();
});

const sectionIds = [
  "inicio",
  "clientes",
  "solucoes",
  "segmentos",
  "quem-somos",
  "metodo",
  "diferenciais",
  "resultados",
  "estrutura",
  "depoimentos",
  "portfolio",
  "parceria",
  "faq",
  "contato",
  "formulario"
];

const navLinks = document.querySelectorAll(".site-menu a[href^='#']");
const sectionVisibility = new Map();

const setActiveNav = (activeId) => {
  navLinks.forEach((link) => {
    const isMatch = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("is-active", isMatch);
  });
};

const pickActiveSection = () => {
  let activeId = sectionIds[0];
  let maxRatio = 0;

  sectionIds.forEach((id) => {
    const ratio = sectionVisibility.get(id) || 0;
    if (ratio > maxRatio) {
      maxRatio = ratio;
      activeId = id;
    }
  });

  if (maxRatio > 0) {
    setActiveNav(activeId);
  }
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      sectionVisibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
    });
    pickActiveSection();
  },
  {
    rootMargin: "-12% 0px -55% 0px",
    threshold: [0, 0.12, 0.25, 0.4, 0.55, 0.7]
  }
);

sectionIds.forEach((id) => {
  const section = document.getElementById(id);
  if (section) {
    sectionVisibility.set(id, 0);
    sectionObserver.observe(section);
  }
});

const leadForm = document.getElementById("lead-form");
const formFeedback = document.getElementById("form-feedback");

if (leadForm && formFeedback) {
  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(leadForm);
    const selectedServices = formData.getAll("servicos");

    if (selectedServices.length === 0) {
      formFeedback.textContent = "Selecione pelo menos um serviço para continuar.";
      return;
    }

    const structuredMessage = [
      "Olá, Inovarejo! Vim pelo site e gostaria de receber uma proposta personalizada.",
      "",
      `Nome: ${formData.get("nome")}`,
      `WhatsApp: ${formData.get("whatsapp")}`,
      `Empresa/Projeto: ${formData.get("empresa")}`,
      `Cidade/Estado: ${formData.get("cidadeEstado")}`,
      `O que procura: ${selectedServices.join(", ")}`,
      `Marketing ativo: ${formData.get("maturidadeMarketing")}`,
      `Principal desafio: ${formData.get("desafioPrincipal")}`
    ].join("\n");

    formFeedback.textContent = "Abrindo WhatsApp com sua mensagem estruturada...";
    window.open(buildWhatsAppLink(structuredMessage), "_blank", "noopener,noreferrer");
    leadForm.reset();
  });
}
