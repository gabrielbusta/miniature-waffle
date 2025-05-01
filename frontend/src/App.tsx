import { useEffect, useState } from 'react';
import './App.css';

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { main } from "../wailsjs/go/models"
import { GetTasks } from "../wailsjs/go/main/App";

function App() {
    const [tasks, setTasks] = useState<main.Task[]>([]);

    async function updateTasks() {
        const result = await GetTasks();
        setTasks(result);
    }

    useEffect(() => {
        updateTasks();
    }, []);

    return (
        <>
            <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
                        <p className="text-muted-foreground">
                            Here&apos;s a list of your tasks.
                        </p>
                    </div>
                </div>
                <DataTable data={tasks} columns={columns} updateTasks={updateTasks} />
            </div>
        </>
    )
}

export default App;
