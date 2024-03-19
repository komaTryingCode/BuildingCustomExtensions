"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { Row } from "@tanstack/react-table";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  id: Id<"documents">;
  content: string;
}

export function DataTableRowActions<TData>({
  row,
  id,
  content,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();

  const deleteDocument = useMutation(api.documents.deleteDocument);
  const [isSheetOpen, setSheetOpen] = React.useState(false);

  function onSelect(id: string) {
    router.push(`/editor/${id}`);
  }

  // Later on, come up with a soft-deleting process. Maybe, use a modal?
  function handleDelete(id: Id<"documents">) {
    const promise = deleteDocument({ id });

    toast.promise(promise, {
      loading: "Deleting the essay...",
      success: "The essay has been deleted!",
      error: "Failed to delete the essay",
    });

    setSheetOpen(false);
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant={"link"}
          className="items-start justify-start px-0 max-w-[500px] truncate font-medium"
        >
          {row.getValue("title")}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full container max-w-3xl">
        <SheetHeader>
          <SheetTitle>{row.getValue("title")}</SheetTitle>
          <SheetDescription className="pt-2 font-semibold text-md">
            Essay Score: {row.getValue("overallScore")}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="xl:h-[700px] md:h-[600px] w-full">
          <div className="flex items-center w-full p-2 pt-6">
            <p className="text-[18px] font-light">{content}</p>
          </div>
        </ScrollArea>
        <SheetFooter>
          <Button onClick={() => handleDelete(id)} variant={"secondary"}>
            Delete Item
          </Button>
          <Button onClick={() => onSelect(id)}>Open in Editor</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
