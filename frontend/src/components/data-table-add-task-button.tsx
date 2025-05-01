import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { main } from "../../wailsjs/go/models"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { AddTask } from "../../wailsjs/go/main/App";
import { useState } from "react"

interface AddTaskButtonProps {
    updateTasks: () => Promise<void>
}

export function AddTaskButton({ updateTasks }: AddTaskButtonProps) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [status, setStatus] = useState("")
    const [label, setLabel] = useState("")
    const [priority, setPriority] = useState("")
    const [savingTask, setSavingTask] = useState(false)

    async function onClick(e: React.MouseEvent<HTMLButtonElement>) {
        setSavingTask(true)
        let task = main.Task.createFrom({
            title,
            status: status as main.Status,
            label: label as main.Label,
            priority: priority as main.Priority,
        });
        await AddTask(task)
        await updateTasks()
        setOpen(false)
        setSavingTask(false)
        setTitle("")
        setStatus("")
        setLabel("")
        setPriority("")
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <PlusCircle />
                    Add
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add a Task</DialogTitle>
                    <DialogDescription>
                        <p>Fill out the details about your task here.</p><p>Click save when you're done.</p>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                            Status
                        </Label>
                        <Select onValueChange={(value) => setStatus(value)}>
                            <SelectTrigger className="w-70">
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    {Object.values(main.Status).map((value) => (
                                        <SelectItem key={value} value={value}>
                                            {value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="label" className="text-right">
                            Label
                        </Label>
                        <Select onValueChange={(value) => setLabel(value)}>
                            <SelectTrigger className="w-70">
                                <SelectValue placeholder="Select a label" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Label</SelectLabel>
                                    {Object.values(main.Label).map((value) => (
                                        <SelectItem key={value} value={value}>
                                            {value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="priority" className="text-right">
                            Priority
                        </Label>
                        <Select onValueChange={(value) => setPriority(value)}>
                            <SelectTrigger className="w-70">
                                <SelectValue placeholder="Select a priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Priority</SelectLabel>
                                    {Object.values(main.Priority).map((value) => (
                                        <SelectItem key={value} value={value}>
                                            {value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={onClick} disabled={savingTask}>{savingTask ? 'Saving task...' : 'Save Task'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}