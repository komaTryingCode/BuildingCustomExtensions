"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";

// This type is used to define the shape of our data.
export type Essays = {
  taskType: "Task One" | "Task Two";
  title: string;
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
          <span role="button" className="max-w-[500px] truncate font-medium hover:underline hover:cursor-pointer">
            {row.getValue("title")}
          </span>
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
