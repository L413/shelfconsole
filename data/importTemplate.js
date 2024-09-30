// YOU MUST PUT THIS IN YOUR MAIN SCRIPT TO IMPORT THE COMMANDS
const iframe = document.querySelector("iframe"); // The iframe that shelf console is in.
if (iframe) {
  iframe.addEventListener("load", () => {
    iframe.contentWindow.postMessage(
      {
        type: "importCommands",
        command: "https://example.com/your-commands.js", // The url of your script with the code below
      },
      "*"
    );
  });
}
// REMINDER: This (^^^^^) is NOT recomended to be in the imported script, keep this in the main script if possible

// CUSTOM COMMANDS TEMPLATE (Anything under this is the required import)

// --------------------------Settings (Customize this)--------------------------------------------------
const prefix = "example"; // Prefix: What you must type first to access imported commands
// WARNING: IMPORTING COMMANDS WITHOUT A CUSTOM PREFIX WILL NOT WORK

// --------------------------Define any other functions here--------------------------------------------
function myCommand() {
  alert("Hello World!");
}

// -----------------------Commands (Customize this)-----------------------------------------------------
const runCommand = async function (command) {
  if (command[1] === "command1") {
    // A command
    alert("Running command1!");
  } else if (command[1] === "command2") {
    // Another command
    myCommand();
    if ((command[2] = "sub")) {
      // A sub-command
    }
  } else {
    if (command[1] === undefined) {
      return;
    } else {
      preContainer.innerHTML += `<div>> Error no such "${command[1]}" command in imported "${prefix}" hierarchy.</div>`;
    }
  }
};

// -----------------------DO NOT TOUCH------------------------------------------------------------------
const runInput = function (event) {
  if (event.keyCode === 13) {
    const text = input.value;
    const command = text.split(" ");
    if (command[0] === prefix) {
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
      runCommand(command);
    }
  }

  scrollDown();
  updateCaret();
};

usedPrefixes.push(prefix);
input.addEventListener("keypress", runInput);
