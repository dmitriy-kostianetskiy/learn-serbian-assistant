import { getTestDependencies } from '../dependencies';
import { CasesByNumber, SimpleConjugations } from '../model/summary';

describe('SummaryService', () => {
  test('should summarise word "ići"', async () => {
    // Arrange
    const { summaryService } = getTestDependencies();

    // Act
    const summary = await summaryService.generate('ići');

    // Assert
    expect(summary.input).toBe('ići');

    // Assert translations
    expect(summary.translation?.english).toBeTruthy();
    expect(summary.translation?.russian).toBeTruthy();

    // Assert definition
    expect(summary.definition?.english).toBeTruthy();
    expect(summary.definition?.russian).toBeTruthy();
    expect(summary.definition?.serbian).toBeTruthy();

    // Assert synonyms
    expect(summary.synonyms).not.toHaveLength(0);

    // Assert example
    expect(summary.example).toBeTruthy();

    // Assert verb-specific data
    const { additionalInfo } = summary;

    expect(additionalInfo.partOfSpeech).toBe('verb');

    if (additionalInfo.partOfSpeech === 'verb') {
      expect(additionalInfo.infinitive).toBe('ići');
      expect(
        additionalInfo.conjugations.present,
      ).toMatchObject<SimpleConjugations>({
        singular: {
          first: 'idem',
          second: 'ideš',
          third: 'ide',
        },
        plural: {
          first: 'idemo',
          second: 'idete',
          third: 'idu',
        },
      });

      expect(
        additionalInfo.conjugations.perfect,
      ).toMatchObject<SimpleConjugations>({
        singular: {
          first: 'išao sam',
          second: 'išao si',
          third: 'išao je',
        },
        plural: {
          first: 'išli smo',
          second: 'išli ste',
          third: 'išli su',
        },
      });

      expect(
        additionalInfo.conjugations.future,
      ).toMatchObject<SimpleConjugations>({
        singular: {
          first: 'ići ću',
          second: 'ići ćeš',
          third: 'ići će',
        },
        plural: {
          first: 'ići ćemo',
          second: 'ići ćete',
          third: 'ići će',
        },
      });
    }
  });

  test('should summarise word "dati"', async () => {
    // Arrange
    const { summaryService } = getTestDependencies();

    // Act
    const summary = await summaryService.generate('dati');

    // Assert
    expect(summary.input).toBe('dati');

    // Assert translations
    expect(summary.translation?.english).toBeTruthy();
    expect(summary.translation?.russian).toBeTruthy();

    // Assert definition
    expect(summary.definition?.english).toBeTruthy();
    expect(summary.definition?.russian).toBeTruthy();
    expect(summary.definition?.serbian).toBeTruthy();

    // Assert synonyms
    expect(summary.synonyms).not.toHaveLength(0);

    // Assert example
    expect(summary.example).toBeTruthy();

    // Assert verb-specific data
    const { additionalInfo } = summary;

    expect(additionalInfo.partOfSpeech).toBe('verb');

    if (additionalInfo.partOfSpeech === 'verb') {
      expect(additionalInfo.infinitive).toBe('dati');
      expect(
        additionalInfo.conjugations.present,
      ).toMatchObject<SimpleConjugations>({
        singular: {
          first: 'dajem',
          second: 'daješ',
          third: 'daje',
        },
        plural: {
          first: 'dajemo',
          second: 'dajete',
          third: 'daju',
        },
      });

      expect(
        additionalInfo.conjugations.perfect,
      ).toMatchObject<SimpleConjugations>({
        singular: {
          first: 'dao sam',
          second: 'dao si',
          third: 'dao je',
        },
        plural: {
          first: 'dali smo',
          second: 'dali ste',
          third: 'dali su',
        },
      });

      expect(
        additionalInfo.conjugations.future,
      ).toMatchObject<SimpleConjugations>({
        singular: {
          first: 'daću',
          second: 'daćeš',
          third: 'daće',
        },
        plural: {
          first: 'daćemo',
          second: 'daćete',
          third: 'daće',
        },
      });
    }
  });

  test('should summarise word "dete"', async () => {
    // Arrange
    const { summaryService } = getTestDependencies();

    // Act
    const summary = await summaryService.generate('dete');

    // Assert
    expect(summary.input).toBe('dete');

    // Assert translations
    expect(summary.translation?.english).toBeTruthy();
    expect(summary.translation?.russian).toBeTruthy();

    // Assert definition
    expect(summary.definition?.english).toBeTruthy();
    expect(summary.definition?.russian).toBeTruthy();
    expect(summary.definition?.serbian).toBeTruthy();

    // Assert synonyms
    expect(summary.synonyms).not.toHaveLength(0);

    // Assert example
    expect(summary.example).toBeTruthy();

    // Assert noun-specific data
    const { additionalInfo } = summary;

    expect(additionalInfo.partOfSpeech).toBe('noun');

    if (additionalInfo.partOfSpeech === 'noun') {
      expect(additionalInfo.grammaticalGender).toBe('n');
      expect(additionalInfo.grammaticalNumber).toBe('s');
      expect(additionalInfo.cases).toMatchObject<CasesByNumber>({
        singular: {
          nominative: 'dete',
          genitive: 'deteta',
          dative: 'detetu',
          accusative: 'dete',
          instrumental: 'detetom',
          locative: 'detetu',
          vocative: 'dete',
        },
        plural: {
          nominative: 'deca',
          genitive: 'dece',
          dative: 'deci',
          accusative: 'decu',
          instrumental: 'decom',
          locative: 'deci',
          vocative: 'deco',
        },
      });
    }
  });

  test('should summarise word "talas"', async () => {
    // Arrange
    const { summaryService } = getTestDependencies();

    // Act
    const summary = await summaryService.generate('talas');

    // Assert
    expect(summary.input).toBe('talas');

    // Assert translations
    expect(summary.translation?.english).toBe('wave');
    expect(summary.translation?.russian).toBe('волна');
  });

  test('should summarise word "lep"', async () => {
    // Arrange
    const { summaryService } = getTestDependencies();

    // Act
    const summary = await summaryService.generate('lep');

    // Assert
    expect(summary.input).toBe('lep');

    // Assert translations
    expect(summary.additionalInfo.partOfSpeech).toBe('adjective');
  });

  test('should summarise word "jederenjak"', async () => {
    // Arrange
    const { summaryService } = getTestDependencies();

    // Act
    const summary = await summaryService.generate('jedrenjak');

    // Assert
    expect(summary.input).toBe('jedrenjak');

    // Assert translations
    expect(summary.translation?.english).toBe('sailing ship');
    expect(summary.translation?.russian).toBe('парусник');
  });
});
