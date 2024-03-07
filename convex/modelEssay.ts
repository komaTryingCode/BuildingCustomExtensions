import { v } from "convex/values";
import { z } from "zod";
import OpenAI from "openai";
import Instructor from "@instructor-ai/instructor";

import { internal } from "./_generated/api";
import { action, internalMutation } from "./_generated/server";

const oai = new OpenAI();

// Instructor for returning structured JSON
const client = Instructor({
  client: oai,
  mode: "JSON",
});

const ModelEssaySchema = z.object({
  modelEssay: z.string().describe("Model Essay"),
  modelEssayComments: z.string().describe("Model Essay Comments"),
});

export const generateModelEssay = action({
  args: {
    id: v.id("documents"),
    title: v.string(),
    body: v.string(),
    trScore: v.optional(v.number()),
    ccScore: v.optional(v.number()),
    grScore: v.optional(v.number()),
    lrScore: v.optional(v.number()),
    overallScore: v.optional(v.number()),
    improveToScore: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content:
            "You are an AI IELTS writing tutor that helps students improve their writing skills" +
            "Analyze the user's essay and generate a model essay that displays how the essay could have been written to get a higher IELTS writing score. " +
            `Here's user's original essay: Essay topic: ${args.title} \n ${args.body}. Ignore the HTML tags. ` +
            "The model essay you generate is just a paraphrased version of the user's original essay. " +
            `Here's the score breakdown: trScore: ${args.trScore}, ccScore: ${args.ccScore}, grScore: ${args.grScore}, lrScore: ${args.lrScore}, overall score: ${args.overallScore}` +
            "Only paraphrase the parts of the essay that need to be improved based on the score breakdown and the desired score the user wants for the model essay. " +
            "Limit your response to no more than 600 words, but make sure to point out what changes are made.",
        },
        {
          role: "user",
          content:
            `Generate a model essay that displays how the essay could have been written to get a higher IELTS writing score. Please, ${args.improveToScore}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 1200,
      response_model: { schema: ModelEssaySchema, name: "Model Essay" },
    });

    const { modelEssay, modelEssayComments } = completion;

    await ctx.runMutation(internal.modelEssay.updateModelEssay, {
      id: args.id,
      modelEssay,
      modelEssayComments,
    });
  },
});

export const updateModelEssay = internalMutation({
  args: {
    id: v.id("documents"),
    modelEssay: v.optional(v.string()),
    modelEssayComments: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("document not found");
    }

    await ctx.db.patch(args.id, { ...rest });
  },
});
