function notify(title, message) {
  const width = 400;
  const height = 200;
  const left = screen.width - width;
  const top = screen.height - height;

  const encodedMessage = encodeURIComponent(message);
  const encodedTitle = encodeURIComponent(title);
  const theme = localStorage.getItem("-theme");
  const encodedTheme = encodeURIComponent(theme);

  const url = `/notification?message=${encodedMessage}&title=${encodedTitle}&theme=${encodedTheme}`;

  const win = window.open(
    url,
    "_blank",
    `width=${width},height=${height},left=${left},top=${top}`
  );
}

function setAlarm(alarmTime) {
  // Parse the alarm time
  const [alarmHours, alarmMinutes] = alarmTime.split(":").map(Number);

  // Validate the time format
  if (
    isNaN(alarmHours) ||
    isNaN(alarmMinutes) ||
    alarmHours < 0 ||
    alarmHours > 23 ||
    alarmMinutes < 0 ||
    alarmMinutes > 59
  ) {
    print("> Invalid time format. Please use HH:MM in 24-hour format.");
    return;
  }

  // Function to check the current time
  function checkAlarm() {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    if (currentHours === alarmHours && currentMinutes === alarmMinutes) {
      notify(
        `ALARM FOR ${alarmTime}`,
        `<div>ALERT: Your alarm for ${alarmTime} is sounding.</div>
         <div>Do you wish to silence it? (y/n)</div>`
      );
      clearInterval(alarmInterval);
    }
  }

  const alarmInterval = setInterval(checkAlarm, 1000);
}

async function fetchVersion() {
  try {
    const response = await fetch("/version");
    const data = await response.json();
    return data.version;
  } catch (error) {
    console.error("Error fetching version:", error);
  }
}

async function checkPassword(password) {
  try {
    const response = await fetch("/check-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (data.message === "Access granted") {
      console.log("Access granted");
      await fetchAndExecuteAdminScript(data.token);
      return true;
    } else {
      console.log("Access denied");
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

async function fetchAndExecuteAdminScript(atk) {
  if (!atk) {
    console.error("No authorization token available");
    return;
  }

  try {
    const response = await fetch("/get-admin-script", {
      headers: {
        Authorization: atk,
      },
    });

    if (response.ok) {
      const scriptText = await response.text();
      const scriptElement = document.createElement("script");
      scriptElement.textContent = scriptText;
      scriptElement.id = "admin-script";
      document.body.appendChild(scriptElement);
      for (let i = 0; i < 64; i++) {
        authed += String(Math.floor(Math.random() * 10));
      }

      console.log("Admin script executed successfully");
      UfYsNr6jxCIZrJjH = atk;
    } else {
      console.error("Unauthorized to access admin script");
    }
  } catch (error) {
    console.error("Error fetching or executing admin script:", error);
  }
}

function scrollDown() {
  requestAnimationFrame(() => {
    objDiv.scrollTop = objDiv.scrollHeight;
  });
}

const displayCommands = async () => {
  try {
    const response = await fetch("help.json");
    if (!response.ok) throw new Error("Failed to fetch commands");

    const commands = await response.json();

    commands.sort((a, b) => {
      const commandA = a.command.toLowerCase();
      const commandB = b.command.toLowerCase();
      if (commandA < commandB) return -1;
      if (commandA > commandB) return 1;
      return 0;
    });
    preContainer.innerHTML += `
      <div>> [system] Commands:</div>`;
    commands.forEach((command, index) => {
      setTimeout(() => {
        const div = document.createElement("div");
        // Display the command and its description
        div.textContent = `${command.command} - ${command.description}`;
        preContainer.appendChild(div);
        scrollDown();
      }, index * 10);
    });
  } catch (error) {
    console.error("Error loading commands:", error);
  }
};

const listThemes = async () => {
  const numColumns = 4;
  try {
    const response = await fetch("themes.json");
    if (!response.ok) throw new Error("Failed to fetch themes");

    const themes = await response.json();

    // Sort the themes alphabetically by name
    themes.sort((a, b) => {
      const themeA = a.name.toLowerCase();
      const themeB = b.name.toLowerCase();
      if (themeA < themeB) return -1;
      if (themeA > themeB) return 1;
      return 0;
    });

    // Start by adding a header for the themes
    preContainer.innerHTML += `
      <div>> [system] Themes:</div>`;

    // Create the table element
    const table = document.createElement("table");
    const rowCount = Math.ceil(themes.length / numColumns);

    for (let row = 0; row < rowCount; row++) {
      const tr = document.createElement("tr");

      // Loop through 3 themes per row
      for (let col = 0; col < numColumns; col++) {
        const themeIndex = row * numColumns + col;
        const theme = themes[themeIndex];

        const td = document.createElement("td");
        if (theme) {
          // Display the theme name
          td.textContent = `${theme.name}`;
        }
        tr.appendChild(td);
      }

      table.appendChild(tr);
    }

    const div = document.createElement("div");
    div.appendChild(table);
    preContainer.appendChild(div);
    scrollDown();
  } catch (error) {
    console.error("Error loading themes:", error);
  }
};

function popOutPageAndClose() {
  const isPopOut =
    window.outerWidth < screen.availWidth ||
    window.outerHeight < screen.availHeight;
  if (isPopOut) {
    return "error";
  }
  const url = window.location.href;
  const windowFeatures =
    "width=1105,height=600,resizable=no,scrollbars=no,location=no,menubar=no,toolbar=no,status=no";
  window.open(url, "_blank", windowFeatures);
  window.close();
  preContainer.innerHTML += `
      <div>> Shutdown failed. Browser functionality may not support this command.</div>`;
}

function putLoadingBar() {
  const loadingBar = document.createElement("div");
  loadingBar.id = "loadingbar";
  const barLength = 40;
  let position = 0;
  let direction = 1;

  preContainer.appendChild(loadingBar);

  function updateLoadingBar() {
    const leftPart = "-".repeat(position);
    const rightPart = "-".repeat(barLength - position - 1);
    loadingBar.textContent = `[${leftPart}0${rightPart}]`;

    position += direction;
    if (position === 0 || position === barLength - 1) {
      direction *= -1; // Reverse direction
    }
  }
  scrollDown();

  setInterval(updateLoadingBar, 25);
}

const getUA = () => {
  let device = "Unknown";
  const ua = {
    "Generic Linux": /Linux/i,
    Android: /Android/i,
    BlackBerry: /BlackBerry/i,
    Bluebird: /EF500/i,
    "Chrome OS": /CrOS/i,
    Datalogic: /DL-AXIS/i,
    Honeywell: /CT50/i,
    iPad: /iPad/i,
    iPhone: /iPhone/i,
    iPod: /iPod/i,
    macOS: /Macintosh/i,
    Windows: /IEMobile|Windows/i,
    Zebra: /TC70|TC55/i,
  };
  Object.keys(ua).map((v) => navigator.userAgent.match(ua[v]) && (device = v));
  return device;
};

function getFormattedDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}

function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
}

function allStorage() {
  var values = [],
    keys = Object.keys(localStorage),
    i = keys.length;

  while (i--) {
    values.push(localStorage.getItem(keys[i]));
  }

  return values;
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

async function loadThemes() {
  var root = document.querySelector(":root");

  try {
    const response = await fetch("themes.json");
    themes = await response.json(); // Load JSON data into the themes array
  } catch (error) {
    console.error("Error fetching themes:", error);
  }
}

async function setTheme(themeName) {
  var root = document.querySelector(":root");

  const theme = themes.find((t) => t.name === themeName);

  if (!theme) {
    print(`> Error: Theme "${themeName}" not found, using default.`);
    return;
  }

  localStorage.setItem("-theme", theme.name);
  generateFavicon(theme["main-color"]);
  root.style.setProperty("--main-color", theme["main-color"]);
  root.style.setProperty("--second-color", theme["second-color"]);
  root.style.setProperty("--bg-color", theme["bg-color"]);
  root.style.setProperty("--caret-color", theme["caret-color"]);
  root.style.setProperty("--font-family", theme["font"]);
}

//CONSOLE LOGS
console.all = [];

console.defaultLog = console.log.bind(console);
console.logs = [];
console.log = function(){
    console.defaultLog.apply(console, arguments);
    console.logs.push(Array.from(arguments));
    console.all.push(Array.from(arguments));
}

console.defaultError = console.error.bind(console);
console.errors = [];
console.error = function(){
    console.defaultError.apply(console, arguments);
    console.errors.push(Array.from(arguments));
    console.all.push(Array.from(arguments));
}

console.defaultWarn = console.warn.bind(console);
console.warns = [];
console.warn = function(){
    console.defaultWarn.apply(console, arguments);
    console.warns.push(Array.from(arguments));
    console.all.push(Array.from(arguments));
}
