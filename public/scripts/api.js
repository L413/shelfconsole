let lastWeatherData = "";

async function createQR(link) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = `https://api.qrserver.com/v1/create-qr-code/?data=${link}&size=256x256`;

    img.onload = () => {
      preContainer.innerHTML += `<div><img src="${img.src}"/></div>`;
      resolve();
    };

    img.onerror = (error) => reject(error);
  });
}

async function shortenURL(url) {
  try {
    const response = await fetch(`/shorten?url=${encodeURIComponent(url)}`);
    const shortenedUrl = await response.text();
    return shortenedUrl;
  } catch (error) {
    console.error("Error shortening the URL:", error);
    return null;
  }
}

async function numConnected() {
  try {
    const response = await fetch(`/clients-num`);
    const num = await response.text();
    return num;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

async function weather(zip) {
  try {
    const response = await fetch(`https://wttr.in/${zip}?format=1`);
    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Error shortening the URL:", error);
    return null;
  }
}

async function checkForWeatherChange(zip, interval = 60000) {
  lastWeatherData = await weather(zip);
  setInterval(async () => {
    const currentWeatherData = await weather(zip);

    if (currentWeatherData && currentWeatherData !== lastWeatherData) {
      notify(
        "Weather Update",
        `<div>Weather: ${currentWeatherData}</div>
        <div>Close notifcation (y/n)</div>`
      );

      lastWeatherData = currentWeatherData;
    }
  }, interval);
}

async function getBitcoinPrice() {
  try {
    const response = await fetch(
      "https://api.coindesk.com/v1/bpi/currentprice/BTC.json"
    );
    const data = await response.json();
    return data.bpi.USD.rate_float;
  } catch (error) {
    console.error("Error fetching Bitcoin price:", error);
    return null;
  }
}

async function getIPAddress() {
  try {
    let response = await fetch("https://api.ipify.org?format=json");
    let data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP address:", error);
  }
}

async function fetchChangelog() {
  const response = await fetch("changelog.json");
  if (!response.ok) {
    throw new Error("Failed to fetch changelog data");
  }
  return response.json();
}

async function getLastLogs(n, token) {
  try {
    const response = await fetch(`/logs?n=${n}`, {
      headers: {
        'Authorization': token // Pass the token in the Authorization header
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching logs: ${response.status}`);
    }

    const logs = await response.text();
    return logs.split('\n'); // Return logs as an array of strings
  } catch (error) {
    print('Failed to fetch logs:', error);
    return null;
  }
}

async function triggerShutdown(url, token, shutdownTime) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shutdownTime }), // Send the shutdown time in the request body
    });

    if (!response.ok) {
      throw new Error(`Shutdown request failed with status ${response.status}`);
    }

    const message = await response.text();
    console.log(message);
  } catch (error) {
    console.error("Error:", error);
  }
}