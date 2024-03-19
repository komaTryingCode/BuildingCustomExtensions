"use client";

import * as React from "react";
import { useQuery } from "convex/react";

import { DashboardProgressChart } from "@/components/charts/dashboard-progress";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/colums";
import { api } from "@/convex/_generated/api";

const DashboardPage = () => {
  const essays = useQuery(api.documents.getAllDocuments);

  // Transform the data to match the Essays type
  const essaysData =
    essays?.map((doc) => ({
      id: doc._id,
      taskType: doc.taskType,
      title: doc.title,
      content: doc.content || "",
      _creationTime: new Date(doc._creationTime).toLocaleString(), // conversion goes here
      category: doc.category || "", // default to empty string if category is undefined
      overallScore: doc.overallScore,
    })) || [];

  return (
    <section className="container max-w-6xl py-24 mx-auto space-y-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tighter md:text-4xl py-4 text-foreground">
          This is a Dashboard page
        </h1>
        <p className="text-xl">Lets get some dashboard UI items build here.</p>
      </div>
      <div className="flex flex-col item space-y-4">
        <p className="text-xl">This is where the progress chart will go.</p>
        <DashboardProgressChart />
      </div>
      <div className="flex flex-col item space-y-4">
        <p className="text-xl">
          This is where the essay history table will go.
        </p>
        <DataTable columns={columns} data={essaysData}/>
      </div>
      <div>
        <p className="text-xl">This is where the skills chart will go.</p>
      </div>
    </section>
  );
};

export default DashboardPage;
