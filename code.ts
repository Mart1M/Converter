// Créez une nouvelle collection de variables nommée "color"
const colorCollection = figma.variables.createVariableCollection("color");

// Récupérez tous les styles locaux de couleur dans le fichier actuel
const localColorStyles = figma.getLocalPaintStyles();

// Parcourez chaque style de couleur local et créez une variable correspondante dans la collection "color"
for (let style of localColorStyles) {
  // Vérifiez si le style de couleur a un remplissage solide
  if (style.paints[0].type === "SOLID") {
    // Utilisez le nom du style (en minuscule) comme nom de la variable
    let variable = figma.variables.createVariable(
      style.name.toLowerCase(),
      colorCollection.id,
      "COLOR"
    );
    // Définir la valeur de la variable à style.paints[0].color
    variable.setValueForMode(
      colorCollection.defaultModeId,
      style.paints[0].color
    );
  }
}

// Fermez le plugin
figma.closePlugin();
