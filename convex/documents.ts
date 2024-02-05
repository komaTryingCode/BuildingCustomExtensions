import { v } from "convex/values";

import { query, mutation } from "./_generated/server";

export const createDocument = mutation({
  args: {
    title: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // fetching currently logged in user:
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("You are not authorized to perform this action.");
    }

    const userId = identity.subject;

    // define what we are inserting into the essays table:
    const document = await ctx.db.insert("documents", {
      title: args.title,
      category: args.category,
      userId: userId,
    });

    return document;
  },
});

// Update document (it will be used everytime we need to update the document):
export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    isChecked: v.optional(v.boolean()),
    feedback: v.optional(v.string()),
    improvedEssay: v.optional(v.string()),
    // isRechecked: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("You are not authorized to perform this action");
    }

    const userId = identity.subject;

    // extracting Id & the "rest" of arguments from args, 'cuz we aints sending id to be updated
    // instead id is used to find what document to be updated:
    const { id, ...rest } = args;

    // Now, lets fetch by unique id:
    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument) {
      throw new Error("document not found");
    }

    if (existingDocument.userId !== userId) {
      throw new Error("You are not authorized to perform this action");
    }

    const document = await ctx.db.patch(args.id, { ...rest });

    return document;
  },
});

export const getDocumentById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const document = await ctx.db.get(args.documentId);

    if (!document) {
      throw new Error("document not found");
    }

    // Check if the user is authorized:
    if (!identity) {
      throw new Error("You are not authorized to perform this action");
    }

    const userId = identity.subject;

    if (document.userId !== userId) {
      throw new Error("You are not authorized to perform this action");
    }

    return document;
  },
});
