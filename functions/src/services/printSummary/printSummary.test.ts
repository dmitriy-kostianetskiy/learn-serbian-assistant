import { GIVE_EXAMPLE } from '../../test/examples/give';
import { TABLE_EXAMPLE } from '../../test/examples/table';
import { printSummary } from './printSummary';

describe('printSummary', () => {
  test('should print verb', () => {
    // Act
    const message = printSummary(GIVE_EXAMPLE);

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
    const message = printSummary(TABLE_EXAMPLE);

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
    expect(message).toContain('Akuzative: <strong>sto</strong>');
    expect(message).toContain('Instrumental: <strong>stolom</strong>');
    expect(message).toContain('Lokative: <strong>stolu</strong>');
    expect(message).toContain('Vokative: <strong>sto</strong>');

    // Assert plural conjugations
    expect(message).toContain('Nominative: <strong>stolovi</strong>');
    expect(message).toContain('Genitive: <strong>stolova</strong>');
    expect(message).toContain('Dative: <strong>stolovima</strong>');
    expect(message).toContain('Akuzative: <strong>stolove</strong>');
    expect(message).toContain('Instrumental: <strong>stolovima</strong>');
    expect(message).toContain('Lokative: <strong>stolovima</strong>');
    expect(message).toContain('Vokative: <strong>stolovi</strong>');
  });
});
