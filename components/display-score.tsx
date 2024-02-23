"use client";

import * as React from "react";
import { Progress } from "@/components/ui/progress";

interface DisplayScoreProps {
  overallScore: string;
  ccScore: string;
  grScore: string;
  lrScore: string;
  trScore: string;
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

  React.useEffect(() => {
    const trTimer = setTimeout(() => setTrProgress((parseFloat(trScore) / 9) * 100), 500);
    const ccTimer = setTimeout(() => setCcProgress((parseFloat(ccScore) / 9) * 100), 500);
    const grTimer = setTimeout(() => setGrProgress((parseFloat(grScore) / 9) * 100), 500);
    const lrTimer = setTimeout(() => setLrProgress((parseFloat(lrScore) / 9) * 100), 500);

    return () => {
      clearTimeout(trTimer);
      clearTimeout(ccTimer);
      clearTimeout(grTimer);
      clearTimeout(lrTimer);
    };
  }, [trScore, ccScore, grScore, lrScore]);

  return (
    <div className="flex flex-col space-y-4 border-b py-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">
          Your Score: {overallScore}
        </h1>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-normal">Task Response: {trScore} </h2>
            <Progress value={trProgress} max={100} />
          </div>
          <div>
            <h2 className="text-lg font-normal">
              Coherence & cohesion: {ccScore}
            </h2>
            <Progress value={ccProgress} max={100} />
          </div>
          <div>
            <h2 className="text-lg font-normal">
              Grammar range & accuracy: {grScore}
            </h2>
            <Progress value={grProgress} max={100} />
          </div>
          <div>
            <h2 className="text-lg font-normal">Lexical resources: {lrScore}</h2>
            <Progress value={lrProgress} max={100} />
          </div>
        </div>
      </div>
    </div>
  );
}