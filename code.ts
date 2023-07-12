figma.showUI(__html__, { themeColors: true, height: 300, width: 300 });

// Fonction pour exécuter le plugin
function runStyles() {
  // Créez une nouvelle collection de variables nommée "colors"
  const colorCollection = figma.variables.createVariableCollection("colors");

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
  // Envoyez une notification pour informer l'utilisateur que le plugin a été exécuté avec succès
  figma.notify("Styles have been converted successfully! Collection name: 'colors' ");

}

// Écoutez les messages du code de l'interface utilisateur
figma.ui.onmessage = (message) => {
  if (message.type === "run-styles") {
    // Exécutez le plugin lorsque le message "run-styles" est reçu de l'interface utilisateur
    runStyles();
  }
};
