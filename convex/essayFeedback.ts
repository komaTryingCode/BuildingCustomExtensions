import { v } from "convex/values";
import { z } from "zod";
import OpenAI from "openai";
import Instructor from "@instructor-ai/instructor";

import { action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

const oai = new OpenAI();

// Instructor for returning structured JSON
const client = Instructor({
  client: oai,
  mode: "JSON",
});

const FeedbackSchema = z.object({
  trFeedback: z
    .string()
    .describe(
      "In-depth feedback on Task Response with specific examples from the essay and suggestions for improvement."
    ),
  ccFeedback: z
    .string()
    .describe(
      "In-depth feedback on Coherence and Cohesion with specific examples from the essay and suggestions for improvement."
    ),
  grFeedback: z
    .string()
    .describe(
      "In-depth feedback on Grammar Range and Accuracy with specific examples from the essay and suggestions for improvement."
    ),
  lrFeedback: z
    .string()
    .describe(
      "In-depth feedback on Lexical Resources with specific examples from the essay and suggestions for improvement."
    ),
  overallFeedback: z
    .string()
    .describe(
      "Comprehensive overall feedback providing constructive criticism and actionable steps tailored to the student's needs."
    ),
  modelAnswer: z
    .string()
    .describe(
      "A superior model answer to the essay prompt, including an explanation of its superiority in bullet points."
    ),
  modelAnswerJustification: z
    .string()
    .describe(
      "Explanation in bullet points why the model answer demonstrates a higher band score, focusing on Task Response, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy."
    ),
});

export const giveFeedback = action({
  args: {
    id: v.id("documents"),
    title: v.string(),
    body: v.string(),
    trScore: v.string(),
    ccScore: v.string(),
    grScore: v.string(),
    lrScore: v.string(),
    overallScore: v.string(),
  },
  handler: async (ctx, args) => {
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content:
            "As an AI trained to act as an experienced IELTS writing task examiner, you have assessed the given essay. " +
            "Now, generate detailed feedback for each scoring criterion using specific examples from the essay. " +
            "This feedback should highlight strengths, pinpoint weaknesses, and suggest targeted improvements. " +
            "Maintain a supportive and encouraging tone throughout to foster a positive learning environment. " +
            "Conclude with actionable steps for overall improvement. " +
            "Additionally, produce a model answer for the same prompt that embodies higher quality writing. " +
            "The word count for the model essay is between 250 and 310 words. " +
            "Explain in bullet points why this model answer is superior, addressing specific aspects like Task Response, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy. " +
            "Ensure the explanation encourages reflection and understanding of key areas for development.",
        },
        {
          role: "user",
          content: `Essay Title: ${args.title}. Essay Body: ${args.body}. Task Response score: ${args.trScore}. 
          Coherence and cohesion score: ${args.ccScore}. Grammar Range and accuracy score: ${args.grScore}. 
          Lexical Resources score: ${args.lrScore}. IELTS Writing band score: ${args.overallScore}.`,
        },
      ],
      response_model: { schema: FeedbackSchema, name: "Essay Feedback" },
    });

    const {
      trFeedback,
      ccFeedback,
      grFeedback,
      lrFeedback,
      overallFeedback,
      modelAnswer,
      modelAnswerJustification,
    } = completion;

    await ctx.runMutation(internal.essayFeedback.updateFeedback, {
      id: args.id,
      trScoreFeedback: trFeedback,
      ccScoreFeedback: ccFeedback,
      lrScoreFeedback: lrFeedback,
      grScoreFeedback: grFeedback,
      overallScoreFeedback: overallFeedback,
      modelEssay: modelAnswer,
      modelEssayComments: modelAnswerJustification,
    });
  },
});

export const updateFeedback = internalMutation({
  args: {
    id: v.id("documents"),
    trScoreFeedback: v.optional(v.string()),
    ccScoreFeedback: v.optional(v.string()),
    lrScoreFeedback: v.optional(v.string()),
    grScoreFeedback: v.optional(v.string()),
    overallScoreFeedback: v.optional(v.string()),
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
