"use client";

import * as React from "react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "./ui/skeleton";
import { useCompletion } from "ai/react";

interface DisplayScoreProps {
  overallScore: number;
  ccScore: number;
  grScore: number;
  lrScore: number;
  trScore: number;
}

export default function DisplayScore({
  overallScore,
  ccScore,
  grScore,
  lrScore,
  trScore,
}: DisplayScoreProps) {
  const [trProgress, setTrProgress] = React.useState(0);
  const [ccProgress, setCcProgress] = React.useState(0);
  const [grProgress, setGrProgress] = React.useState(0);
  const [lrProgress, setLrProgress] = React.useState(0);

  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const trTimer = setTimeout(() => setTrProgress((trScore / 9) * 100), 500);
    const ccTimer = setTimeout(() => setCcProgress((ccScore / 9) * 100), 500);
    const grTimer = setTimeout(() => setGrProgress((grScore / 9) * 100), 500);
    const lrTimer = setTimeout(() => setLrProgress((lrScore / 9) * 100), 500);

    return () => {
      clearTimeout(trTimer);
      clearTimeout(ccTimer);
      clearTimeout(grTimer);
      clearTimeout(lrTimer);
    };
  }, [trScore, ccScore, grScore, lrScore]);

  const scoreSections = [
    { label: "Task Response", score: trScore, progress: trProgress },
    { label: "Coherence & cohesion", score: ccScore, progress: ccProgress },
    { label: "Grammar range & accuracy", score: grScore, progress: grProgress },
    { label: "Lexical resources", score: lrScore, progress: lrProgress },
  ];

  return (
    <div className="flex flex-col space-y-4 border-b border-t py-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">
          Your Score: {overallScore}
        </h1>
        <div className="grid grid-cols-2 gap-4">
          {isLoading
            ? scoreSections.map((section, index) => (
                <div key={index} className="flex flex-col space-y-2">
                  <Skeleton className="h-5" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ))
            : scoreSections.map((section, index) => (
                <div key={index} className="flex flex-col space-y-2">
                  <h2 className="text-lg font-normal">
                    {section.label}: {section.score}
                  </h2>
                  <Progress value={section.progress} max={100} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
