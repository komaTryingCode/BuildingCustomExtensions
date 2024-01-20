"use client";

import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";

import { CreateBlankDocumentBtn } from "@/components/create-blank";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const OverviewPage = () => {
  const router = useRouter();

  const create = useMutation(api.documents.createDocument);

  return (
    <section className="contaner max-w-6xl mx-auto py-24">
      <div className="pt-12">
        <h1 className="text-3xl font-extrabold tracking-tighter md:text-4xl py-4 text-foreground ">
          Creating a document will take you to the [ protected ] page:
        </h1>
        <div className="flex items-center justify-between max-w-44 space-x-8 pt-8">
            <CreateBlankDocumentBtn />
            <Button
              variant={"outline"}
              onClick={() => {
                const promise = create({
                  title: "Test Document Title",
                  category: "Test Category",
                }).then((documentId) => router.push(`/editor/${documentId}`));
                toast.promise(promise, {
                  loading: "Creating a new document...",
                  success: "A new document has been created!",
                  error: "Failed to create a new document",
                });
              }}
            >
              Click this to start with a test title
            </Button>
        </div>
      </div>
    </section>
  );
};

export default OverviewPage;
