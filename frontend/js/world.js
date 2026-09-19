import { startGame } from "./game.js";

startGame().catch((error) => {
  const status = document.querySelector("[data-load-status]");
  if (status) status.textContent = error.message;
});
