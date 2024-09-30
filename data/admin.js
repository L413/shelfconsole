document.getElementById("tag").textContent = "Root";

async function adminScriptRun(event) {
  if (event.keyCode === 13) {
    const text = input.value;
    const command = text.split(" ");
    if (command[0] === "su") {
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
      // Commands
      if (command[1] === "help") {
        preContainer.innerHTML += `<div>> [sudo] Commands ("su" as prefix)</div>
        <div>execute | exc - Run JS</div>
        <div>halt &lt;time&gt; - Shut down the server for a certain amount of miliseconds.</div>
        <div>msg &lt;text&gt; - Send a notification to all connected clients.</div>
        <div>logs &lt;int&gt; - Outputs the [int] latest logs.</div>`;
      } else if (command[1] === "execute" || command[1] === "exc") {
        const codeToExecute = command.slice(2).join(" ");
        try {
          eval(codeToExecute);
          preContainer.innerHTML += `<div>> JS Executed Successfully</div>`;
        } catch (error) {
          preContainer.innerHTML += `<div>> Error: ${error.message}</div>`;
        }
      } else if (command[1] === "halt") {
        alert("Shutting down the server for " + command[2] + " miliseconds.");
        triggerShutdown("/shutdown", UfYsNr6jxCIZrJjH, command[2]);
      } else if (command[1] === "msg") {
        const msg = command.slice(2).join(" ");
        sendMessage(msg, UfYsNr6jxCIZrJjH);
        const numClients = await numConnected();
        print(`> "${msg}" sent to ${numClients} clients.`);
      } else if (command[1] === "logs") {
        if (command[2]) {
          const logs = await getLastLogs(Number(command[2]) + 1, UfYsNr6jxCIZrJjH);
          logs.pop();
          print("[server] logs:")
          logs.forEach((log, index) => {
            print(log);
          });
        } else {
          print("> Error: Missing parameter");
        }
      }
    }
  }
  scrollDown();
  updateCaret();
}

usedPrefixes.push("su");
input.addEventListener("keypress", adminScriptRun);
