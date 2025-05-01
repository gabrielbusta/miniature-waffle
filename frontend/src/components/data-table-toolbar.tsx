"use client"

import { Table } from "@tanstack/react-table"
import { X, PlusCircle, ArrowBigUp, Activity } from "lucide-react"

import React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

import { priorities, statuses } from "../data/data"
import { main } from "../../wailsjs/go/models"
import { AddTask } from "../../wailsjs/go/main/App";
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { AddTaskButton } from "./data-table-add-task-button"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  updateTasks: () => Promise<void>
}

export function DataTableToolbar<TData>({
  table,
  updateTasks,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* AddTaskButton */}
        <AddTaskButton updateTasks={updateTasks} />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
            icon={Activity}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
            icon={ArrowBigUp}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
