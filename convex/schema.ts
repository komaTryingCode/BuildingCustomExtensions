import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    content: v.optional(v.string()),
    category: v.optional(v.string()),
    isChecked: v.optional(v.boolean()),
    trScore: v.optional(v.number()), //Task Response Score
    ccScore: v.optional(v.number()), //Coherence & cohesion Score
    lrScore: v.optional(v.number()), //Lexical Resources Score
    grScore: v.optional(v.number()), //Grammar Range & accuracy Score
    overallScore: v.optional(v.number()), // IELTS Writing band score
    trScoreFeedback: v.optional(v.string()),
    ccScoreFeedback: v.optional(v.string()),
    lrScoreFeedback: v.optional(v.string()),
    grScoreFeedback: v.optional(v.string()),
    overallScoreFeedback: v.optional(v.string()),
    modelEssay: v.optional(v.string()),
    modelEssayComments: v.optional(v.string()),
  }).index("by_user", ["userId"]),
});
