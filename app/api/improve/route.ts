import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  // extract the promp from the body of the request
  const { prompt } = await req.json();

  if (typeof prompt !== "string") {
    return new Error("Invalid prompt, expected a string");
  }

  // ask ai for a streaing response completion given the prompt
  const response = await openai.chat.completions
    .create({
      model: "gpt-3.5-turbo-1106",
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "You are an AI IELTS writing tutor that checks the student's essay. " +
            "Identifies the most important points to improve to get around +1 IELTS score. " +
            "Generates a model essay that displays how the essay could have been written to get around +1 IELTS score more than the students current essay. " +
            "Limit your response to no more than 600 words, but make sure to point out what changes are made.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 200, // adjust as needed
      temperature: 0.7, // adjust as needed
      frequency_penalty: 0.3,
    })
    .asResponse();

  // converst the response to a streaming text response
  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
