import { BEAUTIFUL_EXAMPLE } from '../test/examples/beautiful';
import { BELOW_EXAMPLE } from '../test/examples/below';
import { GIVE_EXAMPLE } from '../test/examples/give';
import { TABLE_EXAMPLE } from '../test/examples/table';
import { printSummary } from './print-summary';

describe('printSummary', () => {
  test('should print verb', () => {
    // Act
    const message = printSummary(GIVE_EXAMPLE);

    // Assert
    expect(message).toContain(`
📝 <strong>dati</strong> (glagol)
<em>inf.</em> dati

💡 <strong>Primer</strong>
  Moramo dati poklon učitelju za njegov rođendan.

❗️ <strong>Definicija</strong>
  🇷🇸 Preneti vlasništvo nečega drugome.
  🇺🇸 To transfer possession of something to someone else.
  🇷🇺 Перевести владение чем-либо к другому человеку.

💬 <strong>Prevod</strong>
  🇺🇸 to give
  🇷🇺 дать

📚 <strong>Sinonimi</strong>
  ponuditi, ustupiti, uručiti

🔄 <strong>Conjugacija</strong>

  <strong>⏰ Prezent</strong>

  Ja <strong>dajem</strong>
  Ti <strong>daješ</strong>
  On/Ona/Ono <strong>daje</strong>
  Mi <strong>dajemo</strong>
  Vi <strong>dajete</strong>
  Oni/One/Ona <strong>daju</strong>

  <strong>↩️ Perfekat</strong>

  Ja <strong>dao sam</strong>
  Ti <strong>dao si</strong>
  On/Ona/Ono <strong>dao je</strong>
  Mi <strong>dali smo</strong>
  Vi <strong>dali ste</strong>
  Oni/One/Ona <strong>dali su</strong>

  <strong>🔮 Futur I</strong>

  Ja <strong>daću</strong>
  Ti <strong>daćeš</strong>
  On/Ona/Ono <strong>daće</strong>
  Mi <strong>daćemo</strong>
  Vi <strong>daćete</strong>
  Oni/One/Ona <strong>daće</strong>`);
  });

  test('should print noun', () => {
    // Act
    const message = printSummary(TABLE_EXAMPLE);

    // Assert
    expect(message).toBe(`
📝 <strong>sto</strong> (imenica, srednji, jednina)

💡 <strong>Primer</strong>
  Ostavite to na stolu.

❗️ <strong>Definicija</strong>
  🇷🇸 komad nameštaja
  🇺🇸 a piece of furniture
  🇷🇺 предмет мебели

💬 <strong>Prevod</strong>
  🇺🇸 table
  🇷🇺 стол

📚 <strong>Sinonimi</strong>
  astal, trpeza

🔄 <strong>Padeži</strong>

👤 Jednina:
  Nominative: <strong>sto</strong>
  Genitive: <strong>stola</strong>
  Dative: <strong>stolu</strong>
  Akuzative: <strong>sto</strong>
  Instrumental: <strong>stolom</strong>
  Lokative: <strong>stolu</strong>
  Vokative: <strong>sto</strong>

👥 Množina:
  Nominative: <strong>stolovi</strong>
  Genitive: <strong>stolova</strong>
  Dative: <strong>stolovima</strong>
  Akuzative: <strong>stolove</strong>
  Instrumental: <strong>stolovima</strong>
  Lokative: <strong>stolovima</strong>
  Vokative: <strong>stolovi</strong>
`);
  });

  test('should print adjective', () => {
    // Act
    const message = printSummary(BEAUTIFUL_EXAMPLE);

    // Assert
    expect(message).toBe(`
📝 <strong>lep</strong> (pridev, muški, jednina)

💡 <strong>Primer</strong>
  Dan je lep i sunčan.

❗️ <strong>Definicija</strong>
  🇷🇸 Imajući osobine koje obraduju čula; estetski prijatan.
  🇺🇸 Having qualities that delight the senses; aesthetically pleasing.
  🇷🇺 Имеющий качества, которые радуют чувства; эстетически приятный.

💬 <strong>Prevod</strong>
  🇺🇸 beautiful
  🇷🇺 красивый

📚 <strong>Sinonimi</strong>
  divan, predivan, lepši

🔄 <strong>Padeži</strong>

👤 Jednina:
  Nominative: <strong>lep</strong>
  Genitive: <strong>lepog</strong>
  Dative: <strong>lepom</strong>
  Akuzative: <strong>lepog</strong>
  Instrumental: <strong>lepim</strong>
  Lokative: <strong>lepom</strong>
  Vokative: <strong>lepi</strong>

👥 Množina:
  Nominative: <strong>lepi</strong>
  Genitive: <strong>lepih</strong>
  Dative: <strong>lepim</strong>
  Akuzative: <strong>lepe</strong>
  Instrumental: <strong>lepim</strong>
  Lokative: <strong>lepim</strong>
  Vokative: <strong>lepi</strong>
`);
  });

  test('should print other', () => {
    // Act
    const message = printSummary(BELOW_EXAMPLE);

    // Assert
    expect(message).toBe(`
📝 <strong>ispod</strong>

💡 <strong>Primer</strong>
  Mačka se sakrila ispod stola.

❗️ <strong>Definicija</strong>
  🇷🇸 Pozicioniran ili postavljen na nižem nivou, ne direktno iznad.
  🇺🇸 Situated or placed at a lower level, not directly on top.
  🇷🇺 Расположен или находится на более низком уровне, не прямо на вершине.

💬 <strong>Prevod</strong>
  🇺🇸 below
  🇷🇺 ниже

📚 <strong>Sinonimi</strong>
  niž, dole, odozdo
`);
  });
});
