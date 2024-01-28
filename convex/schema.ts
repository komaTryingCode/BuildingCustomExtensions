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
    }).index("by_user", ["userId"]),
});