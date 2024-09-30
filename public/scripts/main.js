let version;
let screensaver = false;
let usedPrefixes = [];
let disabledCommands = [];
let themes = [];
let authed = "";
const title = "Shelf";
let history = (localStorage.getItem("-history") || "")
  .split(",")
  .filter(Boolean);
let historyIndex = -1;
const MAX_HISTORY_LENGTH = 20;
let QzsTyAx2SIOk8m0c,
  qz3EOsPqd9hcroGN,
  cdCOixEQtkwizyaS,
  ZEJI8FX4EYujOBvd,
  wfqywVBVK863uFUI,
  UfYsNr6jxCIZrJjH,
  q62OpVdwFLZIrmi8,
  XPNKGwTYhBBd1UaQ,
  pCwEfR5Qv6IMKeqB,
  AMvzYPBpSpCtqSfq,
  OV2UnteHyYvszSx1,
  k4DL0foOQm4b302Y,
  zNgfdYm0cNo2Qlnn,
  IsnVfHF4Bj72YyCs,
  hGh7MisSMHPigws9,
  h4FTZwhDPednIiW1,
  rnVE7yRvrDdlbKvx,
  of8VBcrWXCuYHSqS,
  hVNTKgRs04Dejk0m,
  z1zAueC1GjTG0Ivy;

const preContainer = document.getElementById("pre-container");
var objDiv = document.querySelector("body");
const input = document.getElementById("input");
let adminScript = document.getElementById("admin-script");

window.print = function (text) {
  preContainer.innerHTML += `<div>${text}</div>`;
};

var elem = document.documentElement;
var fullScreen = false;

const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
const ws = new WebSocket(`${protocol}${window.location.host}`);

ws.onmessage = (event) => {
  notify(
    "ADMIN MESSAGE",
    `<div>ADMIN MESSAGE</div>
    <div>${event.data}</div>
    <div>Close message (y/n)</div>`
  );
};

function sendMessage(content, auth) {
  const message = {
    auth: auth,
    content: content,
  };

  ws.send(JSON.stringify(message));
}

(async () => {
  version = await fetchVersion();
  printData();
  await loadThemes();
  setTheme(localStorage.getItem("-theme"));
})();

function screenSaverToggle() {
  const screensaverElem = document.getElementById("screensaver");
  if (screensaver === true) {
    screensaver = false;
    input.disabled = false;
    screensaverElem.style.display = "none";
    closeFullscreen();
  } else {
    screensaver = true;
    input.disabled = true;
    screensaverElem.style.display = "block";
    openFullscreen();
  }
}

const appLinks = {
  clever: {
    url: "https://clever.com/in/hlnd/student/portal",
    name: "clever",
  },
  gmail: {
    url: "https://gmail.google.com",
    name: "gmail",
  },
  ps: {
    url: "https://pshi.ohconnect.org/guardian/home.html?_userTypeHint=student",
    name: "ps",
  },
  mario: {
    url: "https://mario64-game.glitch.me",
    name: "mario",
  },
  allform: {
    url: "https://docs.google.com/forms/d/e/1FAIpQLSceKr_YIXDawP7w-_kgWampOwYJmx-dpV7KitIuAoLmrvshnw/viewform",
    name: "allform",
  },
};

function printData() {
  const content = [
    "Redstone Network > " + title + " [Version " + version + "]",
    "(c) Redstone Network. All Rights Reserved.",
    "███████╗ ██╗  ██╗ ███████╗ ██╗      ███████╗",
    "██╔════╝ ██║  ██║ ██╔════╝ ██║      ██╔════╝",
    "███████╗ ███████║ █████╗   ██║      █████╗  ",
    "╚════██║ ██╔══██║ ██╔══╝   ██║      ██╔══╝  ",
    "███████║ ██║  ██║ ███████╗ ███████╗ ██║     ",
    "╚══════╝ ╚═╝  ╚═╝ ╚══════╝ ╚══════╝ ╚═╝     ",
    'Type "help" for a list of commands.',
  ];

  const targetDiv = preContainer;
  let index = 0;
  const interval = setInterval(() => {
    if (index < content.length) {
      if (index > 1 && index < 7) {
        const newDiv = document.createElement("div");
        newDiv.style.whiteSpace = "pre";
        newDiv.style.lineHeight = "1.19em";
        newDiv.innerHTML = content[index];
        targetDiv.appendChild(newDiv);
        index++;
      } else {
        const newDiv = document.createElement("div");
        newDiv.style.whiteSpace = "pre";
        newDiv.innerHTML = content[index];
        targetDiv.appendChild(newDiv);
        index++;
      }
    } else {
      clearInterval(interval);
    }
  }, 10);
}

document.addEventListener("keydown", () => {
  if (document.activeElement !== input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }
});

async function defaultInput(event) {
  if (event.keyCode === 13 && screensaver === false) {
    const text = input.value;
    // Commands
    const command = text.split(" ");
    if (
      usedPrefixes.includes(command[0]) ||
      disabledCommands.includes(command[0])
    ) {
      return;
    } else {
      const line = document.createElement("div");
      line.innerText = text;
      preContainer.appendChild(line);
      input.value = "";
      if (text && text != history[0]) {
        history.unshift(text);
        while (history.length > MAX_HISTORY_LENGTH) {
          history.pop();
        }
        localStorage.setItem("-history", history);
        historyIndex = -1;
      }
    }

    if (command[0] === "help") {
      displayCommands();
    } else if (command[0] === "clear" || command[0] === "cc") {
      // Clear console
      preContainer.innerHTML = "";
    } else if (command[0] === "reload" || command[0] === "r") {
      location.reload();
    } else if (command[0] === "app") {
      // Launch application
      if (command.length > 1) {
        const appName = command[1];

        if (appName === "-list" || appName === "-l") {
          preContainer.innerHTML += `
      <div>> [system] Applications:</div>
      ${Object.values(appLinks)
        .map(
          (app) =>
            `<div>${app.name} - <a href="${app.url}" target="_blank">${app.url}</a></div>`
        )
        .join("")}`;
        } else if (appLinks[appName]) {
          window.open(appLinks[appName].url);
        } else {
          const error = document.createElement("div");
          error.innerText = "> Error parsing request. Application not found.";
          preContainer.appendChild(error);
        }
      }
    } else if (command[0] === "echo") {
      // Output message
      if (command.length > 1) {
        const message = command.slice(1).join(" ");
        preContainer.innerHTML += `<div>${message}</div>`;
      } else {
        const error = document.createElement("div");
        error.innerText =
          "> Error parsing request. Echo command must include a message.";
        preContainer.appendChild(error);
      }
    } else if (command[0] === "alert") {
      // Output message
      if (command.length > 1) {
        const message = command.slice(1).join(" ");
        alert(message);
      } else {
        const error = document.createElement("div");
        error.innerText =
          "> Error parsing request. Alert command must include a message.";
        preContainer.appendChild(error);
      }
    } else if (command[0] === "title") {
      // Set window title for this session
      if (command.length > 1) {
        if (command[1] === "-r") {
          document.title = title;
          return;
        }
        const newTitle = command.slice(1).join(" ");
        document.title = newTitle;
      } else {
        const error = document.createElement("div");
        error.innerText =
          "> Error parsing request. Title command must include a title.";
        preContainer.appendChild(error);
      }
    } else if (command[0] === "date") {
      preContainer.innerHTML += `<div>${getFormattedDate()}</div>`;
    } else if (command[0] === "hostname") {
      preContainer.innerHTML += `<div>${window.location.hostname}</div>`;
    } else if (command[0] === "test") {
      print("no test func rn");
    } else if (command[0] === "ip") {
      const ip = await getIPAddress();
      preContainer.innerHTML += `<div>${ip}</div>`;
    } else if (command[0] === "set") {
      const fileName = command[1];
      const data = command.slice(2).join(" ");

      if (fileName.includes("-")) {
        if (fileName === "-list" || fileName === "-l") {
          let list = "<div>> [local] Variables:</div>";
          if (command[2] === "-s") {
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              const value = localStorage.getItem(key);
              list += `<div>${key}: ${value}</div>`;
            }
          } else {
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              const value = localStorage.getItem(key);
              if (!key.includes("-")) {
                list += `<div>${key}: ${value}</div>`;
              }
            }
          }
          preContainer.innerHTML += list;
        } else if (fileName && data) {
          if (fileName.includes("-")) {
            preContainer.innerHTML += `<div>> Error file name can not contain "-".</div>`;
            return;
          }
          localStorage.setItem(fileName, data);
          preContainer.innerHTML += `<div>> Success.</div>`;
        } else {
          preContainer.innerHTML += `<div>> Error no such "${fileName}" in file system hierarchy.</div>`;
        }
      }
    } else if (command[0] === "print") {
      const fileName = command[1];
      if (fileName) {
        const data = localStorage.getItem(fileName);
        if (data) {
          preContainer.innerHTML += `<div>${data}</div>`;
        } else {
          preContainer.innerHTML += `<div>> Error no data found for ${fileName}.</div>`;
        }
      }
    } else if (command[0] === "del") {
      const fileName = command[1];
      if (fileName === "-a") {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (!key.includes("-")) {
            localStorage.removeItem(key);
          }
        }
        preContainer.innerHTML += `<div>> Success.</div>`;
      } else if (fileName) {
        if (localStorage.getItem(fileName)) {
          if (fileName.includes("-")) {
            preContainer.innerHTML += `<div>> Error file name can not contain "-".</div>`;
            return;
          }
          localStorage.removeItem(fileName);
          preContainer.innerHTML += `<div>> Success.</div>`;
        } else {
          preContainer.innerHTML += `<div>> Error no such "${fileName}" in file system hierarchy.</div>`;
        }
      }
    } else if (command[0] === "shutdown") {
      // Close window
      window.close();
      const error = document.createElement("div");
      error.innerText =
        "> Shutdown failed. Browser functionality may not support this command.";
      preContainer.appendChild(error);
    } else if (command[0] === "$$$") {
      // Open goofy ahh casino
      window.open("https://goofy-ahh-casino.glitch.me");
      preContainer.innerHTML +=
        "<div>Sending you to the casino --> <a href='https://goofy-ahh-casino.glitch.me' target='_blank'>https://goofy-ahh-casino.glitch.me</a></div>";
    } else if (command[0] === "bit") {
      const price = await getBitcoinPrice();
      preContainer.innerHTML += `<div>${price} USD</div>`;
    } else if (command[0] === "os") {
      preContainer.innerHTML += `<div>${getUA()}</div>`;
    } else if (command[0] === "fullscreen" || command[0] === "fs") {
      if (fullScreen) {
        closeFullscreen();
        fullScreen = !fullScreen;
      } else {
        openFullscreen();
        fullScreen = !fullScreen;
      }
    } else if (command[0] === "sudo") {
      if (window.self !== window.top) {
        if (document.referrer !== "https://glitch.com/") {
          preContainer.innerHTML += `<div>[sudo] Access disabled, must be on main site</div>`;
          return;
        }
      }
      if (command[1] === "-") {
        if (!adminScript) {
          preContainer.innerHTML += `<div>[sudo] password:</div>`;
          input.type = "password";
          await waitForPassword();
        } else {
          preContainer.innerHTML += `<div>> [sudo] Access Granted</div>
        <div>Type "su help" for a list of [sudo] commands</div>`;
        }
      } else if (command[1] === "exit") {
        adminScript.textContent = "";
        input.removeEventListener("keypress", adminScriptRun);
        adminScript.remove();
        authed = "";
        document.getElementById("tag").textContent = "";
        preContainer.innerHTML += `<div>> [sudo] logged out successfully</div>`;
      }
    } else if (command[0] === "changelog") {
      const changelog = await fetchChangelog();
      if (command[1] && (command[1] === "-latest" || command[1] === "-l")) {
        const latestChange = changelog[changelog.length - 1];
        preContainer.innerHTML += `
                <div>
                    v${latestChange.version} (${latestChange.date}): ${latestChange.description}
                </div>
            `;
      } else if (!command[1]) {
        preContainer.innerHTML += changelog
          .map(
            (change) => `
              <div>
                    v${change.version} (${change.date}): ${change.description}
                </div>
            `
          )
          .join("");
      }
    } else if (command[0] === "theme") {
      if (command[1] && !command[1].includes("-")) {
        setTheme(command[1]);
      } else if (command[1] === "-list" || command[1] === "-l") {
        listThemes();
      } else if (command[1] === "-r") {
        setTheme("default");
      }
    } else if (command[0] === "su") {
      if (authed.length < 63.94206) {
        preContainer.innerHTML += `<div>> You do not have permission to execute admin commands.</div>`;
      }
    } else if (command[0] === "cam") {
      var start = command[1];
      var end = command[2];

      if (end === undefined) {
        end = start;
      }

      await listCameraLinks(start, end);
    } else if (command[0] === "qr") {
      if (command[1]) {
        try {
          new URL(command[1]);
          await createQR(command[1]);
        } catch (error) {
          preContainer.innerHTML += `<div>> Invalid URL</div>`;
        }
      }
    } else if (command[0] === "short") {
      if (command[1]) {
        var url;
        try {
          new URL(command[1]);
          url = await shortenURL(command[1]);
          preContainer.innerHTML += `<div><a href="${url}" target="_blank">${url}</a></div>`;
        } catch (error) {
          preContainer.innerHTML += `<div>> Invalid URL</div>`;
        }
      }
    } else if (command[0] === "weather") {
      if (command[1]) {
        const data = await weather(command[1]);
        if (data) {
          preContainer.innerHTML += `<div>Weather Data: ${data}</div>`;
        } else {
          preContainer.innerHTML += `<div>> Error fetching data</div>`;
        }
      }
    } else if (command[0] === "screensaver") {
      screenSaverToggle();
    } else if (command[0] === "console") {
      if (command[1] === "logs") {
      } else if (command[1] === "errors") {
      } else if (command[1] === "warns") {
      } else if (command[1] === "all" || command[1] === "-a") {
      } else {
      }
    } else if (command[0] === "watch") {
      if (command[1] === "weather") {
        if (command[2]) {
          checkForWeatherChange(command[2]);
          preContainer.innerHTML += `<div>> Watching weather for ${command[2]}</div>`;
        } else {
          preContainer.innerHTML += `<div>> Error: Invalid Zipcode</div>`;
        }
      } else if (command[1] === "date") {
        if (command[2]) {
          setAlarm(command[2]);
          preContainer.innerHTML += `<div>> Alarm set for ${command[2]}</div>`;
        } else {
          preContainer.innerHTML += `<div>> Error: Invalid time</div>`;
        }
      } else if (command[1] === "-l" || command[1] === "-list") {
        preContainer.innerHTML += `<div>> [system] watchable apis</div>
        <div>weather &lt;zipcode&gt;</div>
        <div>date &lt;HH:MM&gt;</div>`;
      }
    } else if (command[0] === "popout") {
      const x = popOutPageAndClose();
      if (x == "error") {
        preContainer.innerHTML += `<div>> The window is already popped out.</div>`;
      }
    } else if (command[0] === "clients") {
      const numClients = await numConnected();
      preContainer.innerHTML += `<div>Clients connected: ${numClients}</div>`;
    } else if (command[0] === "command") {
    } else {
      if (command[0] === "") {
        return;
      } else {
        preContainer.innerHTML += `<div>> Error no such "${command[0]}" command in file system hierarchy.</div>`;
      }
    }
    scrollDown();
    updateCaret();
  }
}

function waitForPassword() {
  return new Promise((resolve) => {
    async function onKeyPress(event) {
      if (event.key === "Enter" || event.keyCode === 13) {
        const text = input.value;
        input.value = "";
        // Commands
        const command = text.split(" ");

        if (command[0]) {
          let pass;
          if (!adminScript) {
            pass = await checkPassword(command[0]);
          } else {
            pass = true;
          }
          if (pass) {
            preContainer.innerHTML += `<div>> Admin Access Granted</div>
        <div>Type "su help" for a list of admin commands</div>`;
            adminScript = document.getElementById("admin-script");
          } else {
            preContainer.innerHTML += `<div> Admin Access Denied</div>`;
          }
        }
        input.removeEventListener("keypress", onKeyPress);
        input.addEventListener("keypress", defaultInput);
        input.type = "text";
        resolve();
      }
    }
    input.addEventListener("keypress", onKeyPress);
    input.removeEventListener("keypress", defaultInput);
  });
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

function updateHistory(event) {
  if (event.deltaY > 0) {
    if (history.length > 0) {
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = history[historyIndex] || "";
    }
    event.preventDefault();
    input.setSelectionRange(input.value.length, input.value.length);
    updateCaret();
  } else if (event.deltaY < 0) {
    if (history.length > 0) {
      historyIndex = Math.min(history.length - 1, historyIndex + 1);
      input.value =
        historyIndex === history.length ? "" : history[historyIndex] || "";
    }
    event.preventDefault();
    input.setSelectionRange(input.value.length, input.value.length);
    updateCaret();
  }
}

input.addEventListener("input", updateCaret);
input.addEventListener("click", updateCaret);
input.addEventListener("keyup", updateCaret);
input.addEventListener("keydown", updateCaret);
input.addEventListener("keypress", defaultInput);
document
  .getElementById("input-container")
  .addEventListener("wheel", updateHistory);
document.addEventListener("focus", updateCaret);
document.addEventListener("click", () => {
  if (screensaver === true) {
    screenSaverToggle();
  }
});

input.addEventListener("blur", () => (caret.style.display = "none"));

updateCaret();
document.title = title;
window.resizeTo(1150, 650);
