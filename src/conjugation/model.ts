export type ConjugationPerson = {
  first: string;
  second: string;
  third: string;
};

export type ConjugationOutput = {
  singular: ConjugationPerson;
  plural: ConjugationPerson;
};
