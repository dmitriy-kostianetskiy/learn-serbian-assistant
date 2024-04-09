export interface OpenAiService {
  promptAsJson<T>(prompt: string): Promise<T>;
}
