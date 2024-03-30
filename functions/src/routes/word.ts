import { RequestHandler } from 'express';
import { openAiToken } from '../params/openAiToken';
import { assist } from '../assistant/assist';
import { AssistantOutput } from '../assistant/model';

export const wordController: RequestHandler<
  { word: string },
  AssistantOutput,
  unknown,
  never,
  never
> = async (req, res) => {
  const word = req.params.word;

  const apiKey = openAiToken.value();

  const responseJson = await assist(apiKey, word);

  res.send(responseJson);
};
