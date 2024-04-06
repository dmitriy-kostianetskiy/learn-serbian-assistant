import { Context } from 'telegraf';
import { Dependencies } from '../dependencies';

export const updateUserMiddleware =
  ({ userRepository }: Pick<Dependencies, 'userRepository'>) =>
  async (context: Context) => {
    if (!context.message) {
      return;
    }

    const { id, first_name, last_name, username } = context.message.from;

    const userId = id.toFixed(0);

    await userRepository.add(userId, {
      userName: username,
      firstName: first_name,
      lastName: last_name,
    });
  };
