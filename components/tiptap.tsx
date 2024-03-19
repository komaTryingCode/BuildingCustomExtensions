"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import va from "@vercel/analytics";
import { toast } from "sonner";
import { useCompletion } from "ai/react";

import SlashCommand from "./extensions/slash-command";
import { getPrevText } from "@/lib/editor";

interface TipTapProps {
  onConvexUpdate: (value: string) => void;
  initialContent?: string;
  isEditable?: boolean;
  onEditorReady?: (editor: Editor) => void; // Add this line
}

const TipTap = ({
  onConvexUpdate,
  initialContent,
  isEditable,
  onEditorReady,
}: TipTapProps) => {
  const [hydrated, setHydrated] = useState(false);

  // No need to parse as JSON
  const content = initialContent || '';

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        dropcursor: {
          color: "#DBEAFE",
          width: 4,
        },
        gapcursor: false,
      }),
      Placeholder.configure({
        placeholder: `Let's start writing something amazing...`,
      }),
      CharacterCount.configure({}),
      SlashCommand,
    ],
    content: content,
    autofocus: "end", // the default cursor position is at the end of the text
    editable: isEditable,
    onUpdate: (e) => {
      const selection = e.editor.state.selection;
      const lastTwo = getPrevText(e.editor, {
        chars: 2,
      });
      if (lastTwo === "++" && !isLoading) {
        e.editor.commands.deleteRange({
          from: selection.from - 2,
          to: selection.from,
        });
        complete(
          getPrevText(e.editor, {
            chars: 5000,
          }),
        );
        // complete(e.editor.storage.markdown.getMarkdown());
        va.track("Autocomplete Shortcut Used");
      } else {
        debouncedAutoSave();
      }
    },
    editorProps: {
      attributes: {
        class: "",
      },
    },
  });

  const { complete, completion, isLoading, stop } = useCompletion({
    id: "novel",
    api: "/api/generate",
    onFinish: (_prompt, completion) => {
      editor?.commands.setTextSelection({
        from: editor.state.selection.from - completion.length,
        to: editor.state.selection.from,
      });
    },
    onError: (err) => {
      toast.error(err.message);
      if (err.message === "You have reached your request limit for the day.") {
        va.track("Rate Limit Reached");
      }
    },
  });

  const prev = useRef("");

  // Insert chunks of the generated text
  useEffect(() => {
    const diff = completion.slice(prev.current.length);
    prev.current = completion;
    editor?.commands.insertContent(diff);
  }, [isLoading, editor, completion]);

  useEffect(() => {
    // if user presses escape or cmd + z and it's loading,
    // stop the request, delete the completion, and insert back the "++"
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || (e.metaKey && e.key === "z")) {
        stop();
        if (e.key === "Escape") {
          editor?.commands.deleteRange({
            from: editor.state.selection.from - completion.length,
            to: editor.state.selection.from,
          });
        }
        editor?.commands.insertContent("++");
      }
    };
    const mousedownHandler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      stop();
      if (window.confirm("AI writing paused. Continue?")) {
        complete(editor?.getText() || "");
      }
    };
    if (isLoading) {
      document.addEventListener("keydown", onKeyDown);
      window.addEventListener("mousedown", mousedownHandler);
    } else {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", mousedownHandler);
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", mousedownHandler);
    };
  }, [stop, isLoading, editor, complete, completion.length]);

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

  // When the editor is ready, call onEditorReady with the editor instance
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // Hydrate the editor with the initial content when available
  useEffect(() => {
    if (editor && content && !hydrated) {
      editor.commands.setContent(content);
      setHydrated(true);
    }
  }, [editor, content, hydrated]);

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
      </>
    </div>
  );
};

export default TipTap;
