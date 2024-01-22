"use client";

import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { Editor } from "@tiptap/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const editorRef = useRef<Editor | null>(null); //keep a reference to the editor instance.

  // Introduce new state to determine if the saveContent has been triggered
  const [isSaved, setIsSaved] = useState(false);

  const TipTap = useMemo(
    () => dynamic(() => import("@/components/tiptap"), { ssr: false }),
    []
  ); // TipTap editor fynamically imported using useMemo hook.

  const document = useQuery(api.documents.getDocumentById, {
    documentId: params.documentId,
  });

  const update = useMutation(api.documents.update);

  function onConvexUpdate(content: string) {
    update({
      id: params.documentId,
      content: content,
    });
  }

  // Function to manually save content
  const saveContent = () => {
    if (editorRef.current) {
      onConvexUpdate(JSON.stringify(editorRef.current.getHTML()));
      setIsSaved(true); // Set isSaved to true to hide the button and show the div
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
        {!isSaved ? (
          <Button onClick={saveContent}>Submit for feedback</Button>
        ) : (
          <div className="flex flex-col space-y-4 py-4">
            <div className="flex flex-col space-y-2 border-b py-2">
              <h1 className="text-xl font-semibold tracking-tight">
                Your Score: 7
              </h1>
              <p className="text-sm">Click the buttons below for a detailed feedback:</p>
            </div>
            <div className="flex space-x-4">
              <Button>Show Feedback</Button>
              <Button>Show Improved Veresion</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentIdPage;
