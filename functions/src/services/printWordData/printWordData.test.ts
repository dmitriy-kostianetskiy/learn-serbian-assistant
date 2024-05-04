import { GIVE_EXAMPLE } from '../../test/examples/give';
import { TABLE_EXAMPLE } from '../../test/examples/table';
import { printPhraseSummary } from './printWordData';

describe('print word data', () => {
  test('should print verb', () => {
    // Act
    const message = printPhraseSummary(GIVE_EXAMPLE);

    // Assert
    expect(message).toContain('<strong>dati</strong>');

    // Assert Example
    expect(message).toContain('Molim dajte kafu!');

    // Assert translations
    expect(message).toContain('🇺🇸 to give');
    expect(message).toContain('🇷🇺 давать');

    // Assert definitions
    expect(message).toContain('🇷🇸 pružiti nešto');
    expect(message).toContain('🇺🇸 to move, shift, provide something');
    expect(message).toContain('🇷🇺 перемещать что-либо');

    // Assert cases
    expect(message).toContain('Ja <strong>dajem</strong>');
    expect(message).toContain('Ti <strong>daješ</strong>');
    expect(message).toContain('On/Ona/Ono <strong>daje</strong>');
    expect(message).toContain('Mi <strong>dajemo</strong>');
    expect(message).toContain('Vi <strong>dajete</strong>');
    expect(message).toContain('Oni/One/Ona <strong>daju</strong>');
  });

  test('should print noun', () => {
    // Act
    const message = printPhraseSummary(TABLE_EXAMPLE);

    // Assert

    expect(message).toContain('<strong>sto</strong>');

    // Assert Example
    expect(message).toContain('Ostavite to na stolu.');

    // Assert translations
    expect(message).toContain('🇺🇸 table');
    expect(message).toContain('🇷🇺 стол');

    // Assert definitions
    expect(message).toContain('🇷🇸 komad nameštaja');
    expect(message).toContain('🇺🇸 a piece of furniture');
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
