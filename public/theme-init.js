// Theme bootstrap — runs before paint to avoid a flash of the wrong theme.
(() => {
  var p = null;
  var dark = false;
  try {
    p = localStorage.getItem("themePreference");
    dark =
      p === "dark" ||
      (!p && window.matchMedia("(prefers-color-scheme: dark)").matches);
  } catch (_e) {}
  if (dark) document.documentElement.classList.add("dark");
})();
