"use client";

import * as React from "react";
import { debounce } from "lodash";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Button } from "./ui/button";

interface TipTapProps {
  onConvexUpdate: (value: string) => void;
  initialContent?: string;
  isEditable?: boolean;
}

const TipTap = ({
  onConvexUpdate,
  initialContent,
  isEditable,
}: TipTapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: `Let's start writing something amazing...`,
      }),
      CharacterCount.configure({}),
    ],
    content: initialContent ? JSON.parse(initialContent) : undefined,
    autofocus: "end", // the default cursor position is at the end of the text
    editable: isEditable,
    editorProps: {
      attributes: {
        class: "",
      },
    },
  });

  // Create a debounced auto-save function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedAutoSave = React.useCallback(
    debounce(() => {
      if (editor) {
        onConvexUpdate(JSON.stringify(editor.getHTML()));
      }
    }, 10000),
    [editor, onConvexUpdate]
  ); // Triggers after 10 seconds of inactivity

  React.useEffect(() => {
    const handleEditorUpdate = () => {
      debouncedAutoSave();
    };

    if (editor) {
      editor.on("update", handleEditorUpdate);
    }

    // Cleanup
    return () => {
      if (editor) {
        editor.off("update", handleEditorUpdate);
      }
      debouncedAutoSave.cancel(); // Cancel any pending auto-saves on cleanup
    };
  }, [editor, debouncedAutoSave]);

  // Function to manually save content
  const saveContent = () => {
    if (editor) {
      onConvexUpdate(JSON.stringify(editor.getHTML()));
    }
  };

  return (
    <div
      className={`editor ${
        editor?.getHTML().trim().length === 0 ? "is-editor-empty" : ""
      }`}
    >
      <>
        <EditorContent editor={editor} className="min-h-[500px] pb-6" />
        <span className="text-muted-foreground pt-4">
          {editor?.storage.characterCount.words()} words written...
        </span>
        <div className="pt-4">
          <Button onClick={saveContent} className="px-6">Save</Button>
        </div>
      </>
    </div>
  );
};

export default TipTap;