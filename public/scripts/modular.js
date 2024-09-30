function importCommands(link) {
  const scriptElement = document.createElement("script");
  scriptElement.src = link;
  scriptElement.async = true;
  document.body.appendChild(scriptElement);
}

function importThemes(file) {
  const reader = new FileReader();

  reader.onload = async (event) => {
    try {
      const json = event.target.result;
      const importedThemes = JSON.parse(json);

      if (Array.isArray(importedThemes)) {
        importedThemes.forEach((importedTheme) => {
          const exists = themes.some((t) => t.name === importedTheme.name);
          if (!exists) {
            themes.push(importedTheme);
          } else {
            console.warn(
              `> Error: Theme "${importedTheme.name}" already exists.`
            );
          }
        });
        print("> [system] Themes imported successfully:", themes);
      } else {
        print("> Error: Imported data is not a valid array of themes.");
      }
    } catch (error) {
      print("> Error importing themes:", error);
    }
  };
  reader.onerror = (error) => {
    print("> File reading error:", error);
  };
  reader.readAsText(file);
}

window.addEventListener("message", (event) => {
  if (event.data.type === "importCommands") {
    importCommands(event.data.command);
  } else if (event.data.type === "importThemes") {
    importThemes(event.data.theme);
  }
});
