"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { ScrollArea } from "@/components/_ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/_ui/table";
import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  label: string;
  align?: "start" | "end" | "center";
  render: (row: T) => ReactNode;
};

const ALIGN = {
  start: "justify-start",
  end: "justify-end tabular-nums",
  center: "justify-center",
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  rowLabel?: (row: T) => string;
  empty: string;
  countLabel: string;
};

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  rowLabel,
  empty,
  countLabel,
}: DataTableProps<T>) {
  function handleKey(event: KeyboardEvent, row: T) {
    if (!onRowClick || event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRowClick(row);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScrollArea orientation="both" className="min-h-0 flex-1">
        <Table
          role="table"
          className="grid w-full min-w-max justify-between"
          style={{ gridTemplateColumns: `repeat(${columns.length}, max-content)` }}
        >
          <TableHeader role="rowgroup" className="contents">
            <TableRow role="row" className="col-span-full grid grid-cols-subgrid">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  role="columnheader"
                  className={cn("flex items-center", ALIGN[column.align ?? "start"])}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody role="rowgroup" className="contents">
            {rows.map((row) => (
              <TableRow
                key={rowKey(row)}
                role="row"
                tabIndex={onRowClick ? 0 : undefined}
                aria-label={onRowClick && rowLabel ? rowLabel(row) : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={(event) => handleKey(event, row)}
                className={cn(
                  "col-span-full grid grid-cols-subgrid outline-none",
                  onRowClick &&
                    "hover:bg-card/60 focus-visible:bg-card cursor-pointer",
                )}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    role="cell"
                    className={cn("flex items-center", ALIGN[column.align ?? "start"])}
                  >
                    {column.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow role="row" className="col-span-full grid grid-cols-subgrid">
                <td
                  role="cell"
                  className="caption-style text-muted-foreground col-span-full flex h-[120px] items-center justify-center"
                >
                  {empty}
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="caption-style border-border flex shrink-0 items-center gap-2 border-t p-3">
        <span className="text-foreground tabular-nums">{rows.length}</span>
        <span className="text-muted-foreground">{countLabel}</span>
      </div>
    </div>
  );
}
