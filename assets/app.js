const CONFIG = {
  business: "N&B Automotriz SpA",
  phone: "+56992870585",
  phoneDisplay: "+56 9 9287 0585",
  email: "n.b.automotrizspa@gmail.com",
  address: "Los Remos 995, 9720323 Padre Hurtado, Región Metropolitana",
  mapsPlaceUrl:
    "https://www.google.com/maps/place/N%26B+AUTOMOTRIZ+SPA/@-33.5689649,-70.8263648,17z/data=!3m1!4b1!4m6!3m5!1s0x9662e78df1216275:0x427aa48f041149a3!8m2!3d-33.5689649!4d-70.8263648!16s%2Fg%2F11zhlj987t",
  mapsDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=N%26B+AUTOMOTRIZ+SPA,+Los+Remos+995,+Padre+Hurtado",
  mapsEmbedUrl:
    "https://www.google.com/maps?q=N%26B+AUTOMOTRIZ+SPA,+Los+Remos+995,+Padre+Hurtado&z=17&output=embed",
  facebookUrl: "https://www.facebook.com/niko.polarizados",
  tiktokUrl: "https://www.tiktok.com/@niko_jorquera.p",
  defaultWhatsApp:
    "Hola, quiero cotizar un trabajo con N&B Automotriz.",
};

function whatsAppUrl(text) {
  const msg = text || CONFIG.defaultWhatsApp;
  return "https://wa.me/56992870585?text=" + encodeURIComponent(msg);
}

function applyBindings() {
  document.querySelectorAll("[data-wa]").forEach((el) => {
    el.setAttribute("href", whatsAppUrl(CONFIG.defaultWhatsApp));
  });
  document.querySelectorAll("[data-call]").forEach((el) => {
    el.setAttribute("href", "tel:" + CONFIG.phone);
  });
  document.querySelectorAll("[data-email]").forEach((el) => {
    el.setAttribute("href", "mailto:" + CONFIG.email);
  });
  document.querySelectorAll("[data-facebook]").forEach((el) => {
    el.setAttribute("href", CONFIG.facebookUrl);
  });
  document.querySelectorAll("[data-tiktok]").forEach((el) => {
    el.setAttribute("href", CONFIG.tiktokUrl);
  });
  document.querySelectorAll("[data-maps-link]").forEach((el) => {
    el.setAttribute("href", CONFIG.mapsPlaceUrl);
  });
  document.querySelectorAll("[data-maps-dir]").forEach((el) => {
    el.setAttribute("href", CONFIG.mapsDirectionsUrl);
  });
  const iframe = document.getElementById("map-frame");
  if (iframe) {
    iframe.src = CONFIG.mapsEmbedUrl;
    iframe.title = "Mapa de N&B AUTOMOTRIZ SPA en " + CONFIG.address;
  }
}

function setupMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  const backdrop = document.querySelector(".nav-backdrop");
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove("is-open");
    backdrop?.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  const open = () => {
    nav.classList.add("is-open");
    backdrop?.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.addEventListener("click", () => {
    if (nav.classList.contains("is-open")) close();
    else open();
  });
  backdrop?.addEventListener("click", close);
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function setupForm() {
  const form = document.getElementById("cotizacion-form");
  if (!form) return;

  const fields = {
    marca: form.querySelector("#marca"),
    modelo: form.querySelector("#modelo"),
    anio: form.querySelector("#anio"),
    problema: form.querySelector("#problema"),
  };

  const setError = (input, message) => {
    const wrap = input.closest(".field");
    const err = wrap.querySelector(".error");
    wrap.classList.add("invalid");
    if (err) err.textContent = message;
    input.setAttribute("aria-invalid", "true");
  };
  const clearError = (input) => {
    const wrap = input.closest(".field");
    wrap.classList.remove("invalid");
    input.removeAttribute("aria-invalid");
  };

  Object.values(fields).forEach((input) => {
    input.addEventListener("input", () => clearError(input));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    const marca = fields.marca.value.trim();
    const modelo = fields.modelo.value.trim();
    const anio = fields.anio.value.trim();
    const problema = fields.problema.value.trim();

    if (!marca) {
      setError(fields.marca, "Indica la marca del vehículo.");
      ok = false;
    }
    if (!modelo) {
      setError(fields.modelo, "Indica el modelo.");
      ok = false;
    }
    if (!anio) {
      setError(fields.anio, "Indica el año.");
      ok = false;
    } else if (!/^\d{4}$/.test(anio) || Number(anio) < 1980 || Number(anio) > 2027) {
      setError(fields.anio, "Usa un año de cuatro dígitos, por ejemplo 2018.");
      ok = false;
    }
    if (!problema) {
      setError(fields.problema, "Describe el problema o el trabajo que necesitas.");
      ok = false;
    }
    if (!ok) {
      const first = form.querySelector(".field.invalid input, .field.invalid textarea");
      first?.focus();
      return;
    }

    const message = [
      "Hola, quiero cotizar un trabajo con N&B Automotriz.",
      "",
      "Marca: " + marca,
      "Modelo: " + modelo,
      "Año: " + anio,
      "Problema: " + problema,
    ].join("\n");

    window.location.href = whatsAppUrl(message);
  });
}

function setupInstall() {
  const btn = document.getElementById("install-btn");
  if (!btn) return;
  let deferred = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e;
    btn.hidden = false;
  });
  btn.addEventListener("click", async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    deferred = null;
    btn.hidden = true;
  });
}

function registerWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

function setupFollow() {
  const widget = document.getElementById("follow-widget");
  const toggle = document.getElementById("follow-toggle");
  const menu = document.getElementById("follow-menu");
  if (!widget || !toggle || !menu) return;

  const close = () => {
    widget.classList.remove("is-open");
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  };
  const open = () => {
    widget.classList.add("is-open");
    menu.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    if (widget.classList.contains("is-open")) close();
    else open();
  });
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  document.addEventListener("click", (e) => {
    if (!widget.contains(e.target)) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyBindings();
  setupMenu();
  setupFollow();
  setupForm();
  setupInstall();
  registerWorker();
});
