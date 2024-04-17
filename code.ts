figma.showUI(__html__, { themeColors: true, height: 300, width: 300 });



async function runStyles() {

  const colorCollection = figma.variables.createVariableCollection("colors");

  const localColorStyles = await figma.getLocalPaintStylesAsync();
  for (let style of localColorStyles) {
    if (style.paints[0].type === "SOLID") {
      let variable = figma.variables.createVariable(
        style.name.toLowerCase(),
        colorCollection.id,
        "COLOR"
      );
      variable.setValueForMode(
        colorCollection.defaultModeId,
        style.paints[0].color
      );
    }
  }
  figma.notify("Styles have been converted successfully! Collection name: 'colors' ");

}

async function runTextStyles() {
  const localTextStyles = await figma.getLocalTextStylesAsync();
    const textCollection = figma.variables.createVariableCollection("textStyles");
    const modeId = textCollection.modes[0].modeId;

    localTextStyles.forEach(style => {
        if (style.fontName && style.fontName.family && style.fontName.family.trim() !== '') {
            createVariable(`${style.name}/fontFamily`, textCollection, modeId, style.fontName.family, 'STRING');
        }
        if (style.fontName && style.fontName.style && style.fontName.style.trim() !== '') {
            createVariable(`${style.name}/fontStyle`, textCollection, modeId, style.fontName.style, 'STRING');
        }

        const fontWeight = parseFontWeight(style.fontName.style);
        if (fontWeight !== undefined) {
            createVariable(`${style.name}/fontWeight`, textCollection, modeId, fontWeight, 'FLOAT');
        }

        if (typeof style.fontSize === 'number') {
            createVariable(`${style.name}/fontSize`, textCollection, modeId, style.fontSize, 'FLOAT');
        }
      
      if (typeof style.paragraphSpacing === 'number') {
            createVariable(`${style.name}/paragraphSpacing`, textCollection, modeId, style.paragraphSpacing, 'FLOAT');
        }
      
      

        if (style.letterSpacing && !isNaN(style.letterSpacing.value)) {
            createVariable(`${style.name}/letterSpacing`, textCollection, modeId, style.letterSpacing.value, 'FLOAT');
        }
      
      if (style.lineHeight && typeof style.lineHeight === 'object') {
    let lineHeightValue: number;

    if ('value' in style.lineHeight && style.lineHeight.unit !== 'AUTO') {
        if (style.lineHeight.unit === 'PERCENT') {
            lineHeightValue = style.fontSize * (style.lineHeight.value / 100);
        } else {
            lineHeightValue = style.lineHeight.value;
        }
    } else {
        lineHeightValue = style.fontSize;
    }

    createVariable(`${style.name}/lineHeight`, textCollection, modeId, lineHeightValue, 'FLOAT');
}

    });

  console.log("Variables created for each text style property in the 'textStyles' collection.");
  figma.notify("Text styles have been converted successfully! Collection name: 'textStyles' ");
}

function createVariable(name: any, collection: any, modeId: any, value: any, type: any) {
  const resolvedType = type;
  const variable = figma.variables.createVariable(name, collection, resolvedType);
  variable.setValueForMode(modeId, value);
  return variable;
}

type FontWeightStyle = "Thin" | "ExtraLight" | "Light" | "Regular" | "Medium" | "SemiBold" | "Bold" | "ExtraBold" | "Black";

function parseFontWeight(fontStyle: FontWeightStyle): number | undefined {
    const weightMap: { [key in FontWeightStyle]: number } = {
        "Thin": 100,
        "ExtraLight": 200,
        "Light": 300,
        "Regular": 400,
        "Medium": 500,
        "SemiBold": 600,
        "Bold": 700,
        "ExtraBold": 800,
        "Black": 900
    };
    return weightMap[fontStyle] || undefined;
}


figma.ui.onmessage = (message) => {
  if (message.type === "run-styles") {
    runStyles();
  } else if (message.type === 'run-text-styles') {
    runTextStyles();
  }
};
