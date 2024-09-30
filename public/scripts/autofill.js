async function loadCommands(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.commands;
  } catch (error) {
    console.error("Error loading commands:", error);
    return {};
  }
}

function getSuggestions(commands, inputParts) {
  let suggestions = commands;

  // Traverse the nested commands based on input parts
  for (let i = 0; i < inputParts.length - 1; i++) {
    const part = inputParts[i];
    if (suggestions[part]) {
      suggestions = suggestions[part];
    } else {
      return [];
    }
  }

  // Provide suggestions based on the last part
  const lastPart = inputParts[inputParts.length - 1];
  return Object.keys(suggestions)
    .filter((cmd) => cmd.startsWith(lastPart))
    .sort(); // Sort suggestions alphabetically
}

function initializeAutoFill(commandsUrl) {
  const input = document.querySelector("input");
  const caret = document.querySelector(".caret");
  const suggestionsContainer = document.querySelector(".suggestions-container");
  let currentIndex = 0;
  let suggestions = [];

  if (!input || !caret) {
    alert("Input or caret element not found");
    return;
  }

  loadCommands(commandsUrl).then((commands) => {
    input.addEventListener("input", () => {
      if (input.type == "password") {
        suggestionsContainer.style.display = "none";
        return;
      }
      const value = input.value.trim();
      const parts = value.split(" ");

      // Get suggestions based on the current input
      suggestions = getSuggestions(commands, parts);

      // Clear existing suggestions
      clearSuggestions();

      if (suggestions.length > 0) {
        suggestionsContainer.style.display = "block"; // Show the suggestions box
        suggestions.forEach((suggestion, index) => {
          const suggestionElement = document.createElement("div");
          suggestionElement.textContent = suggestion;
          suggestionElement.classList.add("suggestion");
          suggestionElement.addEventListener("click", () => {
            // Update the input with the selected suggestion
            const newValue =
              parts.slice(0, -1).concat(suggestion).join(" ") + " ";
            input.value = newValue;
            clearSuggestions();
          });
          suggestionElement.dataset.index = index;
          suggestionsContainer.appendChild(suggestionElement);
        });

        // Reposition the suggestions container based on the caret
        updateSuggestionsPosition();

        // Always highlight the first suggestion
        currentIndex = 0;
        updateSuggestionHighlight();
      } else {
        suggestionsContainer.style.display = "none"; // Hide the suggestions box
      }
    });

    function clearSuggestions() {
      while (suggestionsContainer.firstChild) {
        suggestionsContainer.removeChild(suggestionsContainer.firstChild);
      }
      currentIndex = 0;
    }

    input.addEventListener("keydown", (event) => {
      const suggestionElements = Array.from(suggestionsContainer.children);
      updateSuggestionsPosition();
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          if (suggestionElements.length > 0) {
            currentIndex = (currentIndex + 1) % suggestionElements.length;
            updateSuggestionHighlight();
            scrollToHighlighted();
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          if (suggestionElements.length > 0) {
            currentIndex =
              (currentIndex - 1 + suggestionElements.length) %
              suggestionElements.length;
            updateSuggestionHighlight();
            scrollToHighlighted();
          }
          break;
        case "Tab":
          event.preventDefault();
          if (currentIndex >= 0 && currentIndex < suggestionElements.length) {
            const selectedSuggestion =
              suggestionElements[currentIndex].textContent;
            const parts = input.value.trim().split(" ");
            const newValue =
              parts.slice(0, -1).concat(selectedSuggestion).join(" ") + " ";
            input.value = newValue;
            clearSuggestions();
            updateSuggestionsPosition();
          }
          break;
        case " ":
          event.preventDefault();
          input.value += " ";
          clearSuggestions();
          updateSuggestionsPosition();
          break;
        case "Enter":
          clearSuggestions();
          updateSuggestionsPosition();
          break;
      }
    });

    function updateSuggestionHighlight() {
      const suggestionElements = Array.from(suggestionsContainer.children);
      suggestionElements.forEach((el, index) => {
        el.classList.toggle("highlight", index === currentIndex);
      });
    }

    function scrollToHighlighted() {
      const highlighted = suggestionsContainer.querySelector(".highlight");
      if (highlighted) {
        highlighted.scrollIntoView({
          block: "nearest",
          inline: "nearest",
        });
      }
    }

    function updateSuggestionsPosition() {
      const caretRect = caret.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const containerHeight = suggestionsContainer.offsetHeight;
      const scrollY = window.scrollY; // Page scroll in Y-axis
      const scrollX = window.scrollX; // Page scroll in X-axis

      // Check if there's enough space above the caret, if not, place it below
      if (caretRect.top - containerHeight >= 0) {
        suggestionsContainer.style.top = `${
          scrollY + caretRect.top - containerHeight
        }px`; // Above caret
      } else if (caretRect.bottom + containerHeight <= viewportHeight) {
        suggestionsContainer.style.top = `${scrollY + caretRect.bottom}px`; // Below caret
      } else {
        suggestionsContainer.style.top = `${
          scrollY + viewportHeight - containerHeight
        }px`; // Bottom of the viewport if no space
      }

      suggestionsContainer.style.left = `${scrollX + caretRect.left}px`;
    }
  });
}

initializeAutoFill("commands.json");
