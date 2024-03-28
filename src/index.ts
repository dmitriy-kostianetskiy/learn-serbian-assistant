import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_TOKEN,
});

async function main(): Promise<void> {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: 'Conjugate Serbian verb "dati"',
      },
    ],
    model: 'gpt-3.5-turbo',
  });

  const [firstChoice] = chatCompletion.choices;

  console.log(firstChoice.message.content);
}

main();
