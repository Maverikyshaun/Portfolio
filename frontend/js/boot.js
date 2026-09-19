(() => {
  const mark = (event) => {
    if (event?.target?.closest?.("a, [data-close-panel], input, textarea, select, button[data-quality], button[data-respawn]")) {
      return;
    }
    window.__pendingPlay = true;
    document.body.classList.add("is-want-play");
  };

  document.addEventListener(
    "pointerdown",
    (event) => {
      if (event.target.closest("[data-enter], [data-intro]")) mark(event);
    },
    true
  );
  document.addEventListener(
    "click",
    (event) => {
      if (event.target.closest("[data-enter]")) mark(event);
    },
    true
  );
  document.addEventListener("keydown", (event) => {
    if (document.body.classList.contains("is-playing")) return;
    if (event.code === "Enter" || event.code === "KeyE" || event.key === "Enter" || event.key === "e" || event.key === "E") mark(event);
  });
})();
