export interface OpenAiService {
  promptAsJson<T>(prompt: string, systemPrompt?: string): Promise<T>;
}
