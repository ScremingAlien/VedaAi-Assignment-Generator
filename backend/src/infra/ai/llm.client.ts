import { ChatGoogle } from '@langchain/google';
import { ChatGroq } from '@langchain/groq';
import { ChatOpenAI } from '@langchain/openai';

export class Model {
  static Grok() {
    const model = new ChatGroq({
      model: 'llama-3.3-70b-versatile',
      apiKey: process.env.GROK_API_KEY,
    });
    return model;
  }

  static OpenAI() {
    const model = new ChatOpenAI({
      model: 'riverflow-v2.5-fast:free',
      apiKey: process.env.OPENROUTER_API_KEY,

      configuration: {
        baseURL: 'https://openrouter.ai/api/v1',
      },
    });
  }

  static Google() {
    const model = new ChatGoogle('gemini-2.5-flash', {
      apiKey: process.env.GOOGLE_API_KEY,
    });

    return model;
  }
}
