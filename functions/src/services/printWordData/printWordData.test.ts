import { WordData } from '../aiDictionary/model';
import { printWordData } from './printWordData';

describe('print word data', () => {
  test('should print verb', () => {
    // Arrange
    const wordData: WordData = {
      word: 'dati',
      infinitive: 'dati',
      partOfSpeech: 'verb',
      definition: {
        serbian: 'pružiti nešto',
        english: 'to move, shift, provide something',
        russian: 'перемещать что-либо',
      },
      translation: {
        english: 'to give',
        russian: 'давать',
      },
      synonyms: ['prineti', 'pružiti', 'darovati', 'pokloniti'],
      conjugations: {
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
      },
    };

    // Act
    const message = printWordData(wordData);

    // Assert

    expect(message).toContain('<strong>dati</strong>');

    // Assert translations
    expect(message).toContain('🇬🇧 to give');
    expect(message).toContain('🇷🇺 давать');

    // Assert definitions
    expect(message).toContain('🇷🇸 pružiti nešto');
    expect(message).toContain('🇬🇧 to move, shift, provide something');
    expect(message).toContain('🇷🇺 перемещать что-либо');

    // Assert cases
    expect(message).toContain('Ja <strong>dajem</strong>');
    expect(message).toContain('Ti <strong>daješ</strong>');
    expect(message).toContain('On\\Ona\\Ono <strong>daje</strong>');
    expect(message).toContain('Mi <strong>dajemo</strong>');
    expect(message).toContain('Vi <strong>dajete</strong>');
    expect(message).toContain('Oni\\One\\Ona <strong>daju</strong>');
  });

  test('should print noun', () => {
    // Arrange
    const wordData: WordData = {
      word: 'sto',
      partOfSpeech: 'noun',
      definition: {
        english: 'a piece of furniture',
        russian: 'предмет мебели',
        serbian: 'komad nameštaja',
      },
      translation: {
        english: 'table',
        russian: 'стол',
      },
      synonyms: ['astal', 'trpeza'],
      cases: {
        singular: {
          nominative: 'sto',
          genitive: 'stola',
          dative: 'stolu',
          accusative: 'sto',
          instrumental: 'stolom',
          locative: 'stolu',
          vocative: 'sto',
        },
        plural: {
          nominative: 'stolovi',
          genitive: 'stolova',
          dative: 'stolovima',
          accusative: 'stolove',
          instrumental: 'stolovima',
          locative: 'stolovima',
          vocative: 'stolovi',
        },
      },
    };

    // Act
    const message = printWordData(wordData);

    // Assert

    expect(message).toContain('<strong>sto</strong>');

    // Assert translations
    expect(message).toContain('🇬🇧 table');
    expect(message).toContain('🇷🇺 стол');

    // Assert definitions
    expect(message).toContain('🇷🇸 komad nameštaja');
    expect(message).toContain('🇬🇧 a piece of furniture');
    expect(message).toContain('🇷🇺 предмет мебели');

    // Assert synonyms
    expect(message).toContain('astal, trpeza');

    // Assert singular conjugations
    expect(message).toContain('Nominative: <strong>sto</strong>');
    expect(message).toContain('Genitive: <strong>stola</strong>');
    expect(message).toContain('Dative: <strong>stolu</strong>');
    expect(message).toContain('Accusative: <strong>sto</strong>');
    expect(message).toContain('Instrumental: <strong>stolom</strong>');
    expect(message).toContain('Locative: <strong>stolu</strong>');
    expect(message).toContain('Vocative: <strong>sto</strong>');

    // Assert plural conjugations
    expect(message).toContain('Nominative: <strong>stolovi</strong>');
    expect(message).toContain('Genitive: <strong>stolova</strong>');
    expect(message).toContain('Dative: <strong>stolovima</strong>');
    expect(message).toContain('Accusative: <strong>stolove</strong>');
    expect(message).toContain('Instrumental: <strong>stolovima</strong>');
    expect(message).toContain('Locative: <strong>stolovima</strong>');
    expect(message).toContain('Vocative: <strong>stolovi</strong>');
  });
});
