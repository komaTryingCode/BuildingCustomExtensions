"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { useAction } from "convex/react";
import dynamic from "next/dynamic";
import { useMemo, useRef } from "react";
import { Editor } from "@tiptap/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ShowFeedback from "@/components/show-feedback";
import ShowImprovedEssay from "@/components/show-improved-essay";
import DisplayScore from "@/components/display-score";
import { ReloadIcon } from "@radix-ui/react-icons";

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

  const [isLoading, setIsLoading] = React.useState(false);

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
          setIsLoading(true);
          assessEssay({
            title: document.title,
            body: content,
            id: params.documentId,
          }).finally(() => {
            setIsLoading(false); // Reset loading to false when assessment is complete
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
        ) : isLoading ? (
          // Show loading skeletons when isLoading is true

          <div className="space-y-4">
            <Button disabled>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Assessing your essay...
            </Button>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-5" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-5" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-5" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-5" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <DisplayScore
              overallScore={document.overallScore || 0}
              ccScore={document.ccScore || 0}
              grScore={document.grScore || 0}
              lrScore={document.lrScore || 0}
              trScore={document.trScore || 0}
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
