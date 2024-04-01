import { message } from 'telegraf/filters';
import { Dependencies } from '../dependencies';

export const bootstrapBot = (dependencies: Dependencies) => () => {
  const { telegraf, dictionary } = dependencies;

  telegraf.start((context) => {
    context.reply(
      [
        'Hello!',
        '\n',
        'I am an assistant for those who are learning Serbian 🇷🇸.',
        'Just type in any word in Serbian or English and will come up with useful insights.',
        '\n',
        'Go try it now! Good luck in learning! 🎓📚',
      ].join('\n'),
    );
  });

  telegraf.on(message('text'), async (context) => {
    const output = await dictionary.getWordData(context.text);

    context.reply(JSON.stringify(output, null, 4));
  });
};
