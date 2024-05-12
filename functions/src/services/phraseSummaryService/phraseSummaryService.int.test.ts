import { getTestDependencies } from '../../dependencies';
import { CasesOutput, ConjugationsOutput } from '../../model/phraseSummary';
import {
  getPhraseSummaryService,
} from './phraseSummaryService';
import { PhraseSummaryService } from './phraseSummaryService.model';

describe('PhraseSummaryService', () => {
  let service: PhraseSummaryService;

  beforeAll(() => {
    const dependencies = getTestDependencies();

    service = getPhraseSummaryService(dependencies);
  });

  test('should summarise word "dati"', async () => {
    // Act
    const summary = await service.generate('dati');

    // Assert
    expect(summary.phrase).toBe('dati');
    expect(summary.partOfSpeech).toBe('verb');

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

    if (summary.partOfSpeech === 'verb') {
      expect(summary.infinitive).toBe('dati');

      expect(summary.conjugations).toMatchObject<ConjugationsOutput>({
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
    }
  });

  test('should summarise word "dete"', async () => {
    // Act
    const summary = await service.generate('dete');

    // Assert
    expect(summary.phrase).toBe('dete');
    expect(summary.partOfSpeech).toBe('noun');

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

    if (summary.partOfSpeech === 'noun') {
      expect(summary.grammaticalGender).toBe('srednji');
      expect(summary.grammaticalNumber).toBe('jednina');

      expect(summary.cases).toMatchObject<CasesOutput>({
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
});
