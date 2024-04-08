export const substitutePlaceholders = (
  text: string,
  values: Record<string, string>,
) => {
  const keys = Object.keys(values);

  return keys.reduce((acc, key) => {
    const [textToReplace] = acc.match(`<${key}>`) || [];

    if (!textToReplace) {
      console.warn(`Placeholder <${key}> was not found.`);

      return acc;
    }

    return acc.replaceAll(textToReplace, values[key].toString());
  }, text);
};
