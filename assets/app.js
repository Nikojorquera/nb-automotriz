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
  const btns = document.querySelectorAll("[data-install]");
  const modal = document.getElementById("install-modal");
  if (!btns.length) return;
  const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  if (standalone) { btns.forEach((b) => (b.hidden = true)); return; }
  const ua = navigator.userAgent || "";
  const isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  let deferred = null;
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; });
  window.addEventListener("appinstalled", () => { btns.forEach((b) => (b.hidden = true)); closeModal(); });

  function openModal() {
    if (!modal) return;
    modal.querySelectorAll(".install-steps").forEach((el) => {
      const os = el.getAttribute("data-os");
      el.hidden = isIOS ? os !== "ios" : /android/i.test(ua) ? os !== "android" : false;
    });
    modal.hidden = false;
    document.body.classList.add("modal-open");
  }
  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }
  btns.forEach((b) => b.addEventListener("click", async () => {
    if (deferred) {
      deferred.prompt();
      try { await deferred.userChoice; } catch (_) {}
      deferred = null;
      return;
    }
    openModal();
  }));
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.closest("[data-install-close]")) closeModal();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  }
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


function setupShare() {
  const SHARE_URL = "https://nikojorquera.github.io/nb-automotriz/";
  const SHARE_TITLE = "N&B Automotriz";
  const SHARE_TEXT = "Diagnóstico, programación y reparación de módulos automotrices. Atención en todo Chile.";
  const SHARE_MESSAGE = SHARE_TITLE + " — " + SHARE_TEXT + " " + SHARE_URL;

  const btns = document.querySelectorAll("[data-share]");
  const modal = document.getElementById("share-modal");
  if (!btns.length || !modal) return;

  const wa = modal.querySelector("[data-share-wa]");
  if (wa) wa.href = "https://wa.me/?text=" + encodeURIComponent(SHARE_MESSAGE);
  const fb = modal.querySelector("[data-share-fb]");
  if (fb) fb.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(SHARE_URL);
  const tw = modal.querySelector("[data-share-x]");
  if (tw) tw.href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(SHARE_TITLE + " — " + SHARE_TEXT) + "&url=" + encodeURIComponent(SHARE_URL);
  const tg = modal.querySelector("[data-share-tg]");
  if (tg) tg.href = "https://t.me/share/url?url=" + encodeURIComponent(SHARE_URL) + "&text=" + encodeURIComponent(SHARE_TITLE + " — " + SHARE_TEXT);

  const copyBtn = modal.querySelector("[data-share-copy]");
  const copyLabel = copyBtn?.querySelector(".share-copy-label");
  const copyStatus = modal.querySelector("[data-share-copied]");
  const defaultCopyLabel = copyLabel ? copyLabel.textContent : "Copiar enlace";
  let copyTimer = null;

  function openSheet() {
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector("[data-share-close]")?.focus();
  }
  function closeSheet() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (copyTimer) {
      clearTimeout(copyTimer);
      copyTimer = null;
    }
    if (copyLabel) copyLabel.textContent = defaultCopyLabel;
    copyBtn?.classList.remove("is-copied");
    if (copyStatus) copyStatus.hidden = true;
  }

  async function share() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url: SHARE_URL });
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return;
      }
    }
    openSheet();
  }

  btns.forEach((b) => b.addEventListener("click", share));

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest("[data-share-close]")) closeSheet();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSheet();
  });

  async function copyLink() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      ok = true;
    } catch (_) {
      const ta = document.createElement("textarea");
      ta.value = SHARE_URL;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try { ok = document.execCommand("copy"); } catch (__) { ok = false; }
      document.body.removeChild(ta);
    }
    if (!ok) return;
    if (copyLabel) copyLabel.textContent = "Enlace copiado";
    copyBtn?.classList.add("is-copied");
    if (copyStatus) {
      copyStatus.hidden = false;
      copyStatus.textContent = "Enlace copiado";
    }
    if (copyTimer) clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      if (copyLabel) copyLabel.textContent = defaultCopyLabel;
      copyBtn?.classList.remove("is-copied");
      if (copyStatus) copyStatus.hidden = true;
      copyTimer = null;
    }, 2200);
  }

  copyBtn?.addEventListener("click", copyLink);

  const params = new URLSearchParams(location.search);
  if (params.get("compartir") === "1") openSheet();
}

document.addEventListener("DOMContentLoaded", () => {
  applyBindings();
  setupMenu();
  setupFollow();
  setupForm();
  setupInstall();
  setupShare();
  registerWorker();
});
