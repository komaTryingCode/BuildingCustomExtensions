import * as React from "react";
import { useCompletion } from "ai/react";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function ShowImprovedEssay() {
  const params = useParams();

  const document = useQuery(api.documents.getDocumentById, {
    documentId: params.documentId as Id<"documents">,
  });

  const update = useMutation(api.documents.update);

  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const updateImprovedEssay = React.useCallback(
    (improvedEssay: string) => {
      update({
        id: params.documentId as Id<"documents">,
        improvedEssay,
      });
    },
    [update, params.documentId]
  );

  const [isImprovedEssay, setIsImprovedEssay] = React.useState("");

  const { complete, completion, isLoading } = useCompletion({
    api: "/api/improve",

    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleClick = React.useCallback(
    async (c: string) => {
      console.log("handleClick called with:", c);
      setIsImprovedEssay(""); // Clear the previous ideas first

      try {
        const response = await fetch("/api/improve", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: c }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate improved essay");
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullImprovedEssay = ""; // Initialize an empty string to accumulate the improved essay chunks

        reader.read().then(function processText({ done, value }) {
          if (done) {
            console.log("Stream complete");
            setIsImprovedEssay(fullImprovedEssay); // Update the state with the full improved essay
            updateImprovedEssay(fullImprovedEssay); // Update backend with the full improved essay
            return;
          }

          // Decode the received chunk
          const chunk = value ? decoder.decode(value, { stream: true }) : "";
          console.log("Received chunk:", chunk);
          fullImprovedEssay += chunk; // Accumulate the chunks into fullImprovedEssay
          setIsImprovedEssay((prev) => prev + chunk); // Update the state with the new chunk

          reader.read().then(processText);
        });
      } catch (error) {
        console.error("Failed to fetch improved essay sample: ", error);
      }
    },
    [updateImprovedEssay]
  );

  if (document === null) {
    return null;
  }

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>Show Improved Essay</Button>
        </SheetTrigger>
        <SheetContent className="w-full container max-w-3xl">
          <SheetHeader>
            <SheetTitle>Component Title</SheetTitle>
            <SheetDescription className="grid gap-2 pb-4">
              Component Description. Lorem ipsum dolor sit amet consectetur.
              {!document?.improvedEssay && (
                <Button
                  onClick={() => handleClick(document?.content || "")}
                  disabled={isLoading}
                  className="w-full max-w-fit px-16"
                >
                  Generate Improved Essay
                </Button>
              )}
            </SheetDescription>
          </SheetHeader>
          <div className="flex items-center p-2 border w-full">
            {isLoading
              ? "Loading..."
              : isImprovedEssay ||
                document?.improvedEssay ||
                "Click the button to generate improved essay"}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Show Improved Essay</Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-h-[70%]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Component Title</DrawerTitle>
          <DrawerDescription className="grid gap-2">
            Component Description. Lorem ipsum dolor sit amet consectetur.
            {!document?.improvedEssay && (
              <Button
                onClick={() => handleClick(document?.content || "")}
                disabled={isLoading}
                className="w-full max-w-fit px-16"
              >
                Generate Improved Essay
              </Button>
            )}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex items-center p-2 border w-full">
          {isLoading
            ? "Loading..."
            : isImprovedEssay ||
              document?.improvedEssay ||
              "Click the button to generate improved essay"}
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
