const preContainer = document.getElementById("pre-container");
const input = document.getElementById("input");
var objDiv = document.querySelector("body");

function scrollDown() {
  requestAnimationFrame(() => {
    objDiv.scrollTop = objDiv.scrollHeight;
  });
}

async function setTheme(themeName) {
  var root = document.querySelector(":root");

  try {
    const response = await fetch("/themes.json");
    const themes = await response.json();

    const theme = themes.find((t) => t.name === themeName);

    if (!theme) {
      theme = "Default";
    }
    localStorage.setItem("-theme", theme.name);
    generateFavicon(theme["main-color"]);
    root.style.setProperty("--main-color", theme["main-color"]);
    root.style.setProperty("--second-color", theme["second-color"]);
    root.style.setProperty("--bg-color", theme["bg-color"]);
    root.style.setProperty("--caret-color", theme["caret-color"]);
  } catch (error) {
    console.error("Error fetching themes:", error);
  }
}

function generateFavicon(color) {
  const canvas = document.createElement("canvas");
  const size = 32;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, size, size);

  ctx.font = "28px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(">$", size / 2, size / 2);

  const faviconUrl = canvas.toDataURL("image/png");

  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }

  link.href = faviconUrl;
}

const caret = document.querySelector(".caret");

function updateCaret() {
  const inputStyles = window.getComputedStyle(input);
  const caretPosition = input.selectionStart;

  // Create a temporary span to measure text width up to caret position
  const tempSpan = document.createElement("span");
  tempSpan.style.font = inputStyles.font;
  tempSpan.style.visibility = "hidden";
  tempSpan.style.position = "absolute";
  tempSpan.style.whiteSpace = "pre";
  tempSpan.textContent = input.value.substring(0, caretPosition);
  document.body.appendChild(tempSpan);

  // Get the bounding box of the input and span to find the caret position
  const inputRect = input.getBoundingClientRect();
  const spanRect = tempSpan.getBoundingClientRect();

  // Calculate caret position
  const caretLeft =
    spanRect.width + parseFloat(inputStyles.paddingLeft) - input.scrollLeft;

  // Adjust the height of the caret to match the height of the input's line height
  const lineHeight = parseFloat(inputStyles.lineHeight);
  const highlightHeight =
    spanRect.height > lineHeight ? spanRect.height : lineHeight;

  caret.style.height = `${highlightHeight}px`;
  caret.style.left = `${caretLeft}px`;
  caret.style.display = "block";

  document.body.removeChild(tempSpan);
}

async function defaultInput(event) {
  if (event.keyCode === 13) {
    const text = input.value;
    input.value = "";
    // Commands
    const command = text.split(" ");
    if (command[0] === "y") {
      window.close();
    } else if (command[0] === "n") {
    }
  }
  scrollDown();
  updateCaret();
}

input.addEventListener("input", updateCaret);
input.addEventListener("click", updateCaret);
input.addEventListener("keyup", updateCaret);
input.addEventListener("keydown", updateCaret);
document.addEventListener("focus", updateCaret);
input.addEventListener("keypress", defaultInput);
input.addEventListener("blur", () => (caret.style.display = "none"));

updateCaret();
window.resizeTo(400, 300);

window.onload = function () {
  const params = new URLSearchParams(window.location.search);
  const title = params.get("title");
  const message = params.get("message");
  const theme = params.get("theme");

  document.title = decodeURIComponent(title);
  setTheme(decodeURIComponent(theme));
  preContainer.innerHTML = message;
  const dur = 120;
  setTimeout(function () {
    window.close();
  }, dur*1000);
};
