"use client";

import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useMemo } from "react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {

  const TipTap = useMemo(
    () => dynamic(() => import("@/components/tiptap"), { ssr: false }),
    []
  );  // TipTap editor fynamically imported using useMemo hook.

  const document = useQuery(api.documents.getDocumentById, {
    documentId: params.documentId
  });

  const update = useMutation(api.documents.update);

  function onConvexUpdate(content: string) {
    update({
      id: params.documentId,
      content: content,
    });
  }

  //TODO: Change return null to notFound() later as you create 404 page:
  if (!document) {
    return null;
  }

  return (
    <div className="container border-t space-y-6 py-4 md:py-8 lg:py-12">
      <div className="max-w-3xl mx-auto lg:max-w-4xl w-full space-y-3">
        <h1 className="scroll-m-20 pb-4 text-2xl md:text-2xl leading-7 font-semibold tracking-tight">
          {document.title}
        </h1>
        <TipTap initialContent={document.content} onConvexUpdate={onConvexUpdate} isEditable />
      </div>
    </div>
  );
};

export default DocumentIdPage;
