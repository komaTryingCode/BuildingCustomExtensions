import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    content: v.optional(v.string()),
    category: v.optional(v.string()),
    isChecked: v.optional(v.boolean()),
    // isRechecked: v.optional(v.boolean()),
    feedback: v.optional(v.string()),
    improvedEssay: v.optional(v.string()),
    trScore: v.optional(v.string()), //Task Response Score
    ccScore: v.optional(v.string()), //Coherence & cohesion Score
    lrScore: v.optional(v.string()), //Lexical Resources Score
    grScore: v.optional(v.string()), //Grammar Range & accuracy Score
    overallScore: v.optional(v.string()), // IELTS Writing band score
  }).index("by_user", ["userId"]),
});
