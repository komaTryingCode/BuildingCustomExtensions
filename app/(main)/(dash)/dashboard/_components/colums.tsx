"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Id } from "@/convex/_generated/dataModel";

// This type is used to define the shape of our data.
export type Essays = {
  id: Id<"documents">;
  taskType: "Task One" | "Task Two";
  title: string;
  content: string | undefined;
  _creationTime: string;
  category: string;
  overallScore: number | undefined;
};

// Very important to check for the typos, specifically accessorKey to type Essays props!
export const columns: ColumnDef<Essays>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const taskType = row.original.taskType;
      return (
        <div className="flex space-x-2">
          {taskType && <Badge variant="outline">{taskType}</Badge>}
          <DataTableRowActions
            row={row}
            id={row.original.id}
            content={row.original.content || ""}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "_creationTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created at" />
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },
  {
    accessorKey: "overallScore",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Band Score" />
    ),
  },
];
