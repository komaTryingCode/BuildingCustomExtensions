import * as React from "react";
import { useAction, useQuery } from "convex/react";
import { useParams } from "next/navigation";

import { useMediaQuery } from "@/hooks/use-media-query";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function ShowImprovedEssay() {
  const params = useParams();

  const [isLoading, setIsLoading] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [selectedScore, setSelectedScore] = React.useState("");

   // Add a state to keep track of regeneration attempts
   const [regenerateCount, setRegenerateCount] = React.useState(0);

  const document = useQuery(api.documents.getDocumentById, {
    documentId: params.documentId as Id<"documents">,
  });

  const generateModelEssay = useAction(api.modelEssay.generateModelEssay);

  const handleClick = () => {
    if (!document?.isChecked) {
      throw new Error("Document is not checked");
    }

    if (document && document?.isChecked) {
      setIsLoading(true);
      generateModelEssay({
        id: document?._id,
        title: document?.title,
        body: document?.content ?? "",
        trScore: document?.trScore,
        ccScore: document?.ccScore,
        grScore: document?.grScore,
        lrScore: document?.lrScore,
        overallScore: document?.overallScore,
        improveToScore: selectedScore,
      }).finally(() => {
        setIsLoading(false); // Reset loading to false when assessment is complete
        setRegenerateCount(prevCount => prevCount + 1); // Increment the regenerate counter
      });
    }
  };

  if (document === null) {
    return null;
  }

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>Generate Model Essay</Button>
        </SheetTrigger>
        <SheetContent className="w-full container max-w-3xl">
          <SheetHeader>
            <SheetTitle>Model Essay</SheetTitle>
            <SheetDescription className="grid gap-2 pb-4 text-lg">
              This interactive tool empowers you to understand what is needed to
              enhance your writing skills and achieve higher scores by
              demonstrating and highlighting the differences between your
              original work and an AI-improved version of it.
              <div className="grid gap-2 grid-cols-2 items-center">
                <p className="font-semibold">
                  Please, select a score for your model essay:
                </p>
                <Select onValueChange={(value) => setSelectedScore(value)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select a score..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Score ranges</SelectLabel>
                      <SelectSeparator />
                      {document?.overallScore != null &&
                        document.overallScore + 1 <= 9 && (
                          <SelectItem
                            value={(document?.overallScore + 1).toString()}
                          >
                            Improve to {document.overallScore + 1}
                          </SelectItem>
                        )}
                      {document?.overallScore != null &&
                        document.overallScore + 2 <= 9 && (
                          <SelectItem
                            value={(document?.overallScore + 2).toString()}
                          >
                            Improve to {document.overallScore + 2}
                          </SelectItem>
                        )}
                      {document?.overallScore != null &&
                        document.overallScore + 3 <= 9 && (
                          <SelectItem
                            value={(document?.overallScore + 3).toString()}
                          >
                            Improve to {document.overallScore + 3}
                          </SelectItem>
                        )}
                      {document?.overallScore != null &&
                        document.overallScore + 4 <= 9 && (
                          <SelectItem
                            value={(document?.overallScore + 4).toString()}
                          >
                            Improve to {document.overallScore + 4}
                          </SelectItem>
                        )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {isLoading && (
                <>
                  <Button disabled className="w-full max-w-fit px-16">
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </Button>
                </>
              )}
              {!document?.modelEssay && !isLoading && (
                <Button
                  onClick={() => handleClick()}
                  disabled={isLoading}
                  className="w-full max-w-fit px-16"
                >
                  Generate Improved Essay
                </Button>
              )}
              {document?.modelEssay && !isLoading && (
                <Button
                  onClick={() => handleClick()}
                  disabled={isLoading || regenerateCount >= 2} // Disable after two regenerations
                  className="w-full max-w-fit px-16"
                >
                  Re-generate Improved Essay
                </Button>
              )}
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="relative min-h-[200px] h-[80vh]">
            <div className="flex items-center p-2 w-full">
              {isLoading ? (
                <div className="flex flex-col gap-4">
                  <Skeleton className="w-[300px] h-4" />
                  <Skeleton className="w-[600px] h-4" />
                  <Skeleton className="w-[500px] h-4" />
                  <Skeleton className="w-[600px] h-4" />
                  <Skeleton className="w-[550px] h-4" />
                  <Skeleton className="w-[580px] h-4" />
                  <Skeleton className="w-[500px] h-4" />
                  <Skeleton className="w-[600px] h-4" />
                  <Skeleton className="w-[600px] h-4" />
                  <Skeleton className="w-[500px] h-4" />
                  <Skeleton className="w-[600px] h-4" />
                  <Skeleton className="w-[550px] h-4" />
                  <Skeleton className="w-[580px] h-4" />
                  <Skeleton className="w-[500px] h-4" />
                  <Skeleton className="w-[600px] h-4" />
                </div>
              ) : (
                (
                  <div className="flex flex-col gap-4">
                    <p className="text-[18px] font-light">
                      {document?.modelEssay}
                    </p>
                    <h2 className="font-semibold">Comments</h2>
                    <p className="text-[18px] font-light">
                      {document?.modelEssayComments}
                    </p>
                  </div>
                ) || "Click the button to generate an improved essay..."
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Generate Model Essay</Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-h-[70%]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Model Essay</DrawerTitle>
          <DrawerDescription className="grid gap-2">
            This interactive tool empowers you to understand what is needed to
            enhance your writing skills and achieve higher scores. It
            demonstrates & highlights the differences between your original work
            and an AI-improved version of it. Please, select a score for your
            model essay:
            {!document?.modelEssay && (
              <Button
                onClick={() => {}}
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
            : document?.modelEssay ||
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
