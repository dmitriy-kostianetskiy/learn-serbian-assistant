import { getTestDependencies } from '../dependencies';
import { CasesByNumber, ConjugationsByNumber } from '../model/summary';

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
      expect(additionalInfo.conjugations).toMatchObject<ConjugationsByNumber>({
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
});
