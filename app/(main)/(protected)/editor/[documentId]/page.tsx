"use client";

import { useMutation, useQuery } from "convex/react";
import { useAction } from "convex/react";
import dynamic from "next/dynamic";
import { useMemo, useRef } from "react";
import { Editor } from "@tiptap/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import ShowFeedback from "@/components/show-feedback";
import ShowImprovedEssay from "@/components/show-improved-essay";
import DisplayScore from "@/components/display-score";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const editorRef = useRef<Editor | null>(null); //keep a reference to the editor instance.

  const TipTap = useMemo(
    () => dynamic(() => import("@/components/tiptap"), { ssr: false }),
    []
  ); // TipTap editor fynamically imported using useMemo hook.

  const document = useQuery(api.documents.getDocumentById, {
    documentId: params.documentId,
  });

  const update = useMutation(api.documents.update);

  // convex action call:
  const assessEssay = useAction(api.assessEssay.giveAssessment);

  // Function to count words in the content
  const countWords = (content: string): number => {
    const text = content.replace(/<[^>]*>/g, ""); // Remove HTML tags
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length; // Split by whitespace and filter out empty strings
  };

  function onConvexUpdate(content: string) {
    update({
      id: params.documentId,
      content: content,
    });
  }

  // Function to manually save content
  const saveContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.getHTML();
      const wordCount = countWords(content);
      if (wordCount >= 100) {
        onConvexUpdate(JSON.stringify(content));
        // Let's try AI assessment here
        if (document && document.title) {
          assessEssay({
            title: document.title,
            body: content,
            id: params.documentId,
          });
        }
        update({
          id: params.documentId,
          isChecked: true,
        });
      } else {
        toast.error("You need at least 100 words to submit for feedback."); // Fire the toast with the message
      }
    }
  };

  // Assign the editor instance to editorRef when it's available
  const handleEditorReady = (editor: Editor) => {
    editorRef.current = editor;
  };

  //TODO: Change return null to notFound() later as you create 404 page:
  if (!document) {
    return null;
  }

  return (
    <div className="container border-t space-y-6 py-4 md:py-8 lg:py-12">
      <div className="max-w-3xl mx-auto w-full space-y-3">
        <h1 className="scroll-m-20 pb-4 text-2xl md:text-2xl leading-7 font-semibold tracking-tight">
          {document.title}
        </h1>
        <TipTap
          initialContent={document.content}
          onConvexUpdate={onConvexUpdate}
          isEditable
          onEditorReady={handleEditorReady}
        />
      </div>
      <div className="max-w-3xl mx-auto w-full pt-8">
        {!document.isChecked ? (
          <Button onClick={saveContent}>Submit for feedback</Button>
        ) : (
          <div className="space-y-4">
            <DisplayScore
              overallScore={document.overallScore || ""}
              ccScore={document.ccScore || ""}
              grScore={document.grScore || ""}
              lrScore={document.lrScore || ""}
              trScore={document.trScore || ""}
            />
            <p className="text-sm">
              Click the buttons below for a detailed feedback:
            </p>
            <div className="flex items-center space-x-4">
              <ShowFeedback />
              <ShowImprovedEssay />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentIdPage;
