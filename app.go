package main

import (
	"context"
	"database/sql"
	"log"
)

type Status string

const (
	Backlog    Status = "backlog"
	Todo       Status = "todo"
	InProgress Status = "in_progress"
	Done       Status = "done"
	Canceled   Status = "canceled"
)

var AllStatuses = []struct {
	Value  Status
	TSName string
}{
	{Backlog, "BACKLOG"},
	{Todo, "TODO"},
	{InProgress, "IN_PROGRESS"},
	{Canceled, "CANCELED"},
}

type Priority string

const (
	Low    Priority = "low"
	Medium Priority = "medium"
	High   Priority = "high"
)

var AllPriorities = []struct {
	Value  Priority
	TSName string
}{
	{Low, "LOW"},
	{Medium, "MEDIUM"},
	{High, "HIGH"},
}

type Label string

const (
	Bug           Label = "bug"
	Documentation Label = "documentation"
	Feature       Label = "feature"
)

var AllLabels = []struct {
	Value  Label
	TSName string
}{
	{Bug, "BUG"},
	{Documentation, "DOCUMENTATION"},
	{Feature, "FEATURE"},
}

type Task struct {
	ID       int64  `json:"id"`
	Title    string `json:"title"`
	Status   string `json:"status"`
	Label    string `json:"label"`
	Priority string `json:"priority"`
}

func reverseTasks(s *[]Task) {
	tasks := *s
	for i, j := 0, len(tasks)-1; i < j; i, j = i+1, j-1 {
		tasks[i], tasks[j] = tasks[j], tasks[i]
	}
}

// App struct
type App struct {
	ctx context.Context
	db  *sql.DB
}

// NewApp creates a new App application struct
func NewApp(db *sql.DB) *App {
	return &App{
		db: db,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (app *App) startup(ctx context.Context) {
	app.ctx = ctx
}

func (app *App) AddTask(t Task) {
	log.Printf("Adding task %v\n", t)
	log.Println("Begin transaction...")
	tx, err := app.db.Begin()
	if err != nil {
		log.Fatal(err)
	}
	stmt, err := tx.Prepare("insert into tasks(title, status, label, priority) values(?, ?, ?, ?)")
	log.Printf("Running: %v\n", stmt)
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()
	result, err := stmt.Exec(t.Title, t.Status, t.Label, t.Priority)
	if err != nil {
		log.Fatal(err)
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("Updating %v row.\n", rowsAffected)
	if err != nil {
		log.Fatal(err)
	}
	err = tx.Commit()
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Finished transaction!")
}

func (app *App) GetTasks() []Task {
	log.Println("Getting tasks from the DB!")
	rows, err := app.db.Query("select * from tasks")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	log.Println("Got tasks from the DB.")
	var tasks []Task
	log.Println("Scanning rows and creating task structs!")
	for rows.Next() {
		var task Task
		err := rows.Scan(&task.ID, &task.Title, &task.Status, &task.Label, &task.Priority)
		if err != nil {
			log.Fatal(err)
		}
		tasks = append(tasks, task)
	}
	log.Println("Done scanning rows and creating task structs.")
	log.Printf("Tasks: %v\n", tasks)
	err = rows.Err()
	if err != nil {
		log.Fatal(err)
	}
	/* display the most recent tasks first */
	reverseTasks(&tasks)
	return tasks
}
