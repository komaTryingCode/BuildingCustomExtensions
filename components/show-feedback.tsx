import * as React from "react";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";

import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ShowFeedbackChart from "./charts/show-feedback-chart";

export default function ShowFeedback() {
  const params = useParams();

  const document = useQuery(api.documents.getDocumentById, {
    documentId: params.documentId as Id<"documents">,
  });

  const [isLoading, setIsLoading] = React.useState(false); // Add this line to define loading state

  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const feedbackSections = [
    {
      label: "Task Response",
      score: document?.trScore,
      feedback: document?.trScoreFeedback,
    },
    {
      label: "Coherence and Cohesion",
      score: document?.ccScore,
      feedback: document?.ccScoreFeedback,
    },
    {
      label: "Grammar Range and Accuracy",
      score: document?.grScore,
      feedback: document?.grScoreFeedback,
    },
    {
      label: "Lexical Resources",
      score: document?.lrScore,
      feedback: document?.lrScoreFeedback,
    },
  ];

  if (document === null) {
    return null;
  }

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button>Show Feedback</Button>
        </SheetTrigger>
        <SheetContent className="w-full container max-w-3xl">
          <SheetHeader>
            <SheetTitle>Assessment Feedback</SheetTitle>
            <SheetDescription className="p-2 border-b">
              <Card className="">
                <CardHeader>
                  <CardTitle>
                    Your score based on official IELTS assessment criteria
                  </CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ShowFeedbackChart
                    trscore={document?.trScore ?? 0}
                    ccscore={document?.ccScore ?? 0}
                    grscore={document?.grScore ?? 0}
                    lrscore={document?.lrScore ?? 0}
                  />
                </CardContent>
              </Card>
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[600px] w-full p-4">
            <div className="flex items-center w-full p-2 pt-6">
              {isLoading ? (
                "Loading Skeleton..."
              ) : (
                <div>
                  <div className="flex flex-col gap-3">
                    {feedbackSections.map((section, index) => (
                      <div key={index} className="flex flex-col gap-2">
                        <h3 className="text-xl">
                          {section.label}: {section.score}
                        </h3>
                        <p className="text-[18px] font-light">
                          {section.feedback}
                        </p>
                      </div>
                    ))}
                    <p className="text-[18px] font-light">
                      {document?.overallScoreFeedback}
                    </p>
                  </div>
                </div>
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
        <Button>Show Feedback</Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-h-[80%]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Assessment Feedback</DrawerTitle>
          <DrawerDescription className="p-2 border-b">
            <Card className="">
              <CardHeader>
                <CardTitle>
                  Your score based on official IELTS assessment criteria
                </CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ShowFeedbackChart
                  trscore={document?.trScore ?? 0}
                  ccscore={document?.ccScore ?? 0}
                  grscore={document?.grScore ?? 0}
                  lrscore={document?.lrScore ?? 0}
                />
              </CardContent>
            </Card>
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[600px] p-4 mx-4">
          <div className="flex items-center w-full p-2">
            {isLoading ? (
              "Loading Skeleton..."
            ) : (
              <div>
                <div className="flex flex-col gap-3">
                  {feedbackSections.map((section, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <h3 className="text-xl">
                        {section.label}: {section.score}
                      </h3>
                      <p className="text-[18px] font-light">
                        {section.feedback}
                      </p>
                    </div>
                  ))}
                  <p className="text-[18px] font-light">
                    {document?.overallScoreFeedback}
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
