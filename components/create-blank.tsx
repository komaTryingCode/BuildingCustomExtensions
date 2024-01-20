"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { Textarea } from "./ui/textarea";

export function CreateBlankDocumentBtn() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"link"}
            className="px-4 border-l font-normal border-blue-500 dark:border-blue-400 rounded-none md:text-lg text-blue-800 dark:text-blue-400"
          >
            Get started with a topic of your choice
            <ArrowTopRightIcon className="ml-2 h-5 md:h-6 w-5 md:w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">
              Start a custom document.
            </DialogTitle>
            <DialogDescription className="text-base">
              Write on a topic of your choice. Type in your custom title below
              to get started:
            </DialogDescription>
          </DialogHeader>
          <GetTitleForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant={"link"}
          className="px-4 border-l font-normal border-blue-500 dark:border-blue-400 rounded-none md:text-lg text-blue-800 dark:text-blue-400"
        >
          Get started with a topic of your choice
          <ArrowTopRightIcon className="ml-2 h-5 md:h-6 w-5 md:w-6" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left text-xl">
          <DrawerTitle className="text-xl">
            Start a custom document.
          </DrawerTitle>
          <DrawerDescription className="text-base">
            Write on a topic of your choice. Type in your custom title below to
            get started:
          </DrawerDescription>
        </DrawerHeader>
        <GetTitleForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function GetTitleForm({ className }: React.ComponentProps<"form">) {
  const [title, setTitle] = React.useState(""); // State to store the input value
  const router = useRouter();
  const create = useMutation(api.documents.createDocument);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent the default form submission
    const promise = create({ title: title, category: "Custom task" }).then(
      (documentId) => router.push(`/editor/${documentId}`)
    );

    toast.promise(promise, {
      loading: "Creating a new document...",
      success: "The document has been created!",
      error: "Failed to create the document",
    });
  }

  function handleTitleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setTitle(event.target.value); // Update the title state with the input value
  }

  return (
    <form
      className={cn("grid items-start gap-4", className)}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2">
        <Label htmlFor="title" className="text-base">
          Enter a custom title:
        </Label>
        <Textarea
          id="title"
          placeholder="My new document title..."
          value={title}
          onChange={handleTitleChange} // Set the handler for the textarea change
          className="text-base" // Add your styling class for textareas
          rows={5} // Set the number of rows to define the initial height
          // You can add more attributes as needed
        />
      </div>
      <Button type="submit">Create document</Button>
    </form>
  );
}
