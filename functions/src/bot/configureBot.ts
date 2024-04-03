import { message } from 'telegraf/filters';
import { Dependencies } from '../dependencies';
import { printWordData } from '../services/printWordData/printWordData';
import { UserQuotaExceededError } from '../services/dictionary';

export const configureBot = (dependencies: Dependencies) => () => {
  const { telegraf, dictionary, userRepository } = dependencies;

  telegraf.start(async (context) => {
    const { id, first_name, last_name, username } = context.message.from;

    const userId = id.toFixed(0);

    await Promise.all([
      // add user to DB
      userRepository.add(userId, {
        userName: username,
        firstName: first_name,
        lastName: last_name,
      }),
      // send a message
      context.reply(
        [
          'Hello!',
          '',
          'I am an assistant for those who are learning Serbian 🇷🇸.',
          'Just type in any word in Serbian or English and will come up with useful insights.',
          '',
          'Go try it now! Good luck in learning! 🎓📚',
        ].join('\n'),
      ),
    ]);
  });

  telegraf.on(message('text'), async (context) => {
    try {
      const userId = context.message.from.id.toFixed(0);

      const wordData = await dictionary.getWordData(context.text, userId);

      const message = printWordData(wordData);

      await context.reply(message, {
        parse_mode: 'HTML',
        reply_parameters: { message_id: context.message.message_id },
      });
    } catch (e) {
      if (e instanceof UserQuotaExceededError) {
        await context.reply(e.message, {
          reply_parameters: { message_id: context.message.message_id },
        });
      } else {
        throw e;
      }
    }
  });
};
