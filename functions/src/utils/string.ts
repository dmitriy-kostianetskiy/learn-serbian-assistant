export const groupSections = (
  sections: string[],
  sectionMaxSize: number,
  sectionSeparator = '\n',
): string[] => {
  return sections.reduce<string[]>((acc, section) => {
    const lastSection = acc[acc.length - 1];

    if (
      acc.length !== 0 &&
      lastSection.length + section.length + sectionSeparator.length <=
        sectionMaxSize
    ) {
      acc[acc.length - 1] = lastSection + sectionSeparator + section;
    } else {
      acc.push(section);
    }

    return acc;
  }, []);
};
