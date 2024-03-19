import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const deleteDocument = useMutation(api.documents.deleteDocument);

  const selectedRowIds = table.getState().rowSelection;
  const selectedRowCount = Object.keys(selectedRowIds).length;

  // TODO: Fix the delete logic
  // function handleDelete(id: Id<"documents">) {
  //   deleteDocument({ id }).then(() => {
  //     toast.success("The essay has been deleted!");
  //   })
  //   .catch((error) => {
  //     console.error("Deletion error:", error);
  //     toast.error("Failed to delete the essay");
  //   });
  // }

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 flex items-center gap-4 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
        {/* <div>
          {selectedRowCount === 1 && (
            <Button
              className="h-8 px-4"
              onClick={() => {
                // Assuming `selectedRowIds` contains the `id` as the key
                const selectedId = Object.keys(selectedRowIds)[0];
                handleDelete(selectedId as Id<"documents">);
              }}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          {selectedRowCount > 1 && (
            <Button
              className="h-8 px-4"
              onClick={() => {
                Object.keys(selectedRowIds).forEach((selectedId) => {
                  handleDelete(selectedId as Id<"documents">);
                });
              }}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete all
            </Button>
          )}
        </div> */}
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
