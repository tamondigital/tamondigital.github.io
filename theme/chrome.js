// tiedy theme — behaviour of the shared chrome (markup contract: README.md). Load with `defer` from every page;
// the inline head snippet in README.md applies the saved theme and text size before first paint.
(() => {
  // phone menu: the menu button opens the nav as a panel; Escape, a tap outside or a link closes it
  const head = document.querySelector(".site-head"), btn = head && head.querySelector(".menu-toggle");
  if (btn) {
    const set = (open, focusBack) => {
      head.classList.toggle("menu-open", open);
      btn.setAttribute("aria-expanded", String(open));
      if (!open && focusBack) btn.focus();
    };
    btn.addEventListener("click", () => set(btn.getAttribute("aria-expanded") !== "true"));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && head.classList.contains("menu-open")) set(false, true); });
    document.addEventListener("click", (e) => { if (head.classList.contains("menu-open") && !head.contains(e.target)) set(false); });
    head.querySelectorAll("nav a").forEach((a) => a.addEventListener("click", () => set(false)));
    matchMedia("(min-width: 641px)").addEventListener("change", (m) => { if (m.matches) set(false); });
  }
  // light / dark, remembered on this device
  document.querySelectorAll(".theme-toggle").forEach((b) => b.addEventListener("click", () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  }));
  // text size: steps of the root font size, remembered on this device
  const steps = [0.9, 1, 1.12, 1.25, 1.4, 1.6], root = document.documentElement;
  const btns = document.querySelectorAll("[data-font]");
  if (btns.length) {
    const cur = () => Math.round(parseFloat(root.style.fontSize || "100")) / 100;
    const sync = () => {
      const i = steps.indexOf(cur());
      btns.forEach((b) => { b.disabled = Number(b.dataset.font) < 0 ? i === 0 : i === steps.length - 1; });
    };
    btns.forEach((b) => b.addEventListener("click", () => {
      const i = Math.max(0, steps.indexOf(cur()));
      const f = steps[Math.min(steps.length - 1, Math.max(0, i + Number(b.dataset.font)))];
      root.style.fontSize = Math.round(f * 100) + "%";
      try { f === 1 ? localStorage.removeItem("font-scale") : localStorage.setItem("font-scale", String(f)); } catch (e) {}
      sync();
    }));
    sync();
  }
  // 目次: highlight the entry of the section being read — the last listed heading scrolled past the top band
  // (every .toc on the page, rail or menu)
  const links = [...document.querySelectorAll(".toc a[href^='#']")];
  const targets = [...new Set(links.map((l) => l.hash.slice(1)))].map((id) => document.getElementById(id)).filter(Boolean);
  if (targets.length) {
    let ticking = false;
    const mark = () => {
      ticking = false;
      const band = 120;
      let cur = null;
      for (const el of targets) { if (el.getBoundingClientRect().top <= band) cur = el.id; else break; }
      links.forEach((l) => l.classList.toggle("on", l.hash.slice(1) === cur));
    };
    targets.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(mark); } }, { passive: true });
    addEventListener("resize", mark);
    mark();
  }
})();
