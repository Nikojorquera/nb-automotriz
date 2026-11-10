const CONFIG = {
  business: "N&B Automotriz SpA",
  phone: "+56992870585",
  phoneDisplay: "+56 9 9287 0585",
  email: "n.b.automotrizspa@gmail.com",
  city: "Maipú, Santiago",
  mapsQuery: "Maipú, Santiago, Chile",
  defaultWhatsApp:
    "Hola, quiero cotizar un trabajo con N&B Automotriz.",
};

function mapsSearchUrl() {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.mapsQuery);
}

function mapsEmbedUrl() {
  return (
    "https://maps.google.com/maps?q=" +
    encodeURIComponent(CONFIG.mapsQuery) +
    "&z=13&output=embed"
  );
}

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
  document.querySelectorAll("[data-maps-link]").forEach((el) => {
    el.setAttribute("href", mapsSearchUrl());
  });
  const iframe = document.getElementById("map-frame");
  if (iframe) {
    iframe.src = mapsEmbedUrl();
    iframe.title = "Mapa de " + CONFIG.business + " en " + CONFIG.mapsQuery;
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

document.addEventListener("DOMContentLoaded", () => {
  applyBindings();
  setupMenu();
  setupForm();
  setupInstall();
  registerWorker();
});
