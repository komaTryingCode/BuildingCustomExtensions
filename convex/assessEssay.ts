import { v } from "convex/values";
import { action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import OpenAI from "openai";
import Instructor from "@instructor-ai/instructor";
import { z } from "zod";

const oai = new OpenAI();

// Instructor for returning structured JSON
const client = Instructor({
  client: oai,
  mode: "JSON",
});

const AssessmentSchema = z.object({
  trScore: z.number().describe("Task Response Score"),
  trScoreFeedback: z
    .string()
    .describe(
      "In-depth feedback on Task Response with specific examples from the essay and suggestions for improvement."
    ),
  ccScore: z.number().describe("Coherence & Cohesion Score"),
  ccScoreFeedback: z
    .string()
    .describe(
      "In-depth feedback on Coherence and Cohesion with specific examples from the essay and suggestions for improvement."
    ),
  grScore: z.number().describe("Grammar Range & Accuracy Score"),
  grScoreFeedback: z
    .string()
    .describe(
      "In-depth feedback on Grammar Range and Accuracy with specific examples from the essay and suggestions for improvement."
    ),
  lrScore: z.number().describe("Lexical Resources Score"),
  lrScoreFeedback: z
    .string()
    .describe(
      "In-depth feedback on Lexical Resources with specific examples from the essay and suggestions for improvement."
    ),
  overallScore: z.number().describe("IELTS Writing band score"),
  overallScoreFeedback: z
    .string()
    .describe(
      "Comprehensive overall feedback providing constructive criticism and actionable steps for overall improvement of the student's writing."
    ),
});

export const giveAssessment = action({
  args: {
    id: v.id("documents"),
    title: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content:
            "As an AI trained to act as an experienced IELTS writing task examiner, assess the following essay based on the official IELTS writing assessment criteria. " +
            "Also, generate detailed feedback for each scoring criterion using specific examples from the essay. " +
            "The feedbacks should highlight strengths, pinpoint weaknesses, and suggest targeted improvements." +
            "Maintain a supportive and encouraging tone throughout the feedbacks to foster a positive learning environment. " +
            "Conclude with actionable steps for overall improvement in overallScore feedback. " +
            "Ignore the <p> tags in the body of the essay. " +
            "Consider the four criteria: 1) Task Response (TR) - assess how well the topic is understood and addressed; " +
            "2) Coherence and Cohesion (CC) - evaluate the organization and clarity of ideas; " +
            "3) Lexical Resource (LR) - judge the range and accuracy of vocabulary used; " +
            "4) Grammatical Range and Accuracy (GR) - analyze the diversity and accuracy of grammar used. " +
            "Additionally, provide an overall IELTS Writing score based on these criteria. " +
            "Output the scores as a JSON object with keys for each criterion and the overall score: " +
            "{trScore: 'number', trScoreFeedback: 'string', ccScore: 'number', ccScoreFeedback: 'string', grScore: 'number', grScoreFeedback: 'string', lrScore: 'number', lrScoreFeedback: 'string', overallScore: 'number'}, overallScoreFeedback: 'string'}. " +
            "where each 'score' is a number like 5.5, 6.0, 7.5, 9.0 representing official IELTS band scores.",
        },
        {
          role: "user",
          content: `Essay Title: ${args.title}. Essay Body: ${args.body}`,
        },
      ],
      response_model: { schema: AssessmentSchema, name: "Essay Feedback" },
    });

    const { trScore, trScoreFeedback, ccScore, ccScoreFeedback, grScore,  grScoreFeedback, lrScore, lrScoreFeedback, overallScore, overallScoreFeedback } = completion;

    await ctx.runMutation(internal.assessEssay.updateScores, {
      id: args.id,
      trScore,
      trScoreFeedback,
      ccScore,
      ccScoreFeedback,
      lrScore,
      lrScoreFeedback,
      grScore,
      grScoreFeedback,
      overallScore,
      overallScoreFeedback,
    });
  },
});

export const updateScores = internalMutation({
  args: {
    id: v.id("documents"),
    trScore: v.optional(v.number()),
    trScoreFeedback: v.optional(v.string()),
    ccScore: v.optional(v.number()),
    ccScoreFeedback: v.optional(v.string()),
    grScore: v.optional(v.number()),
    grScoreFeedback: v.optional(v.string()),
    lrScore: v.optional(v.number()),
    lrScoreFeedback: v.optional(v.string()),
    overallScore: v.optional(v.number()),
    overallScoreFeedback: v.optional(v.string()),
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
