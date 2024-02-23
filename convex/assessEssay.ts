import { v } from "convex/values";
import { action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import OpenAI from "openai";

const openai = new OpenAI();

// get essay assessed
export const giveAssessment = action({
  args: {
    id: v.id("documents"),
    title: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "As an AI trained to act as an experienced IELTS writing task examiner, assess the following essay based on the official IELTS writing assessment criteria. " +
            "Ignore the <p> tags in the body of the essay. " +
            "Consider the four criteria: 1) Task Response (TR) - assess how well the topic is understood and addressed; " +
            "2) Coherence and Cohesion (CC) - evaluate the organization and clarity of ideas; " +
            "3) Lexical Resource (LR) - judge the range and accuracy of vocabulary used; " +
            "4) Grammatical Range and Accuracy (GR) - analyze the diversity and accuracy of grammar used. " +
            "Additionally, provide an overall IELTS Writing score based on these criteria. " +
            "Output the scores as a JSON object with keys for each criterion and the overall score: " +
            "{trScore: 'string', ccScore: 'string', grScore: 'string', lrScore: 'string', overallScore: 'string'}, " +
            "where each 'score' is a number like 5.5, 6.0, 7.5, 9.0 representing official IELTS band scores.",
        },
        {
          role: "user",
          content: `Essay Title: ${args.title}. Essay Body: ${args.body}`,
        },
      ],
      model: "gpt-3.5-turbo-1106",
    });

    const messageContent = completion.choices[0].message.content ?? "";
    const scores = JSON.parse(messageContent);

    // Extract the individual scores and convert them to strings
    const trScore = scores.trScore?.toString() ?? "";
    const ccScore = scores.ccScore?.toString() ?? "";
    const lrScore = scores.lrScore?.toString() ?? "";
    const grScore = scores.grScore?.toString() ?? "";
    const overallScore = scores.overallScore?.toString() ?? "";

    await ctx.runMutation(internal.assessEssay.updateScores, {
      trScore,
      ccScore,
      lrScore,
      grScore,
      overallScore,
      id: args.id,
    });

    return completion;
  },
});

export const updateScores = internalMutation({
  args: {
    id: v.id("documents"),
    trScore: v.optional(v.string()),
    ccScore: v.optional(v.string()),
    grScore: v.optional(v.string()),
    lrScore: v.optional(v.string()),
    overallScore: v.optional(v.string()),
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
