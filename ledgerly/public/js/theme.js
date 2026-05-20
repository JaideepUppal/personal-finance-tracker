(function () {
  const STORAGE_KEY = "ledgerly_theme";
  const THEMES = new Set(["light", "dark"]);

  function getCookieTheme() {
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${STORAGE_KEY}=([^;]*)`)
    );
    return match ? decodeURIComponent(match[1]) : null;
  }

  function storeCookieTheme(theme) {
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `${STORAGE_KEY}=${encodeURIComponent(
      theme
    )}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY) || getCookieTheme();
    } catch (error) {
      return getCookieTheme();
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // Ignore storage failures so the toggle still works for the current page.
    }
    storeCookieTheme(theme);
  }

  function normalizedTheme(theme) {
    return THEMES.has(theme) ? theme : "light";
  }

  function currentTheme() {
    return normalizedTheme(document.documentElement.dataset.theme);
  }

  function updateButtons(theme) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    const label = nextTheme === "dark" ? "Switch to dark mode" : "Switch to light mode";
    const visibleText = nextTheme === "dark" ? "Dark" : "Light";

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
      button.dataset.themeState = theme;

      const text = button.querySelector(".theme-toggle-text");
      if (text) text.textContent = visibleText;
    });
  }

  function applyTheme(theme, options = {}) {
    const nextTheme = normalizedTheme(theme);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;

    if (options.persist) {
      storeTheme(nextTheme);
    }

    updateButtons(nextTheme);
    window.dispatchEvent(
      new CustomEvent("ledgerly:themechange", { detail: { theme: nextTheme } })
    );
  }

  function toggleTheme() {
    applyTheme(currentTheme() === "dark" ? "light" : "dark", { persist: true });
  }

  applyTheme(getStoredTheme() || document.documentElement.dataset.theme, {
    persist: false,
  });

  document.addEventListener("DOMContentLoaded", () => {
    updateButtons(currentTheme());
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", toggleTheme);
    });
  });

  window.LedgerlyTheme = {
    key: STORAGE_KEY,
    get: currentTheme,
    set(theme) {
      applyTheme(theme, { persist: true });
    },
    toggle: toggleTheme,
  };
})();
