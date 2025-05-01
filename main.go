package main

import (
	"database/sql"
	"embed"
	"errors"
	"log"
	"os"
	"path/filepath"

	_ "github.com/mattn/go-sqlite3"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	userConfigDir, err := os.UserConfigDir()
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("userConfigDir is %s\n", Colorf(userConfigDir, "blue"))
	appDir := filepath.Join(userConfigDir, "io.odinzen.tasks")
	log.Printf("appDir is %s\n", Colorf(appDir, "blue"))
	err = os.MkdirAll(appDir, os.ModePerm)
	if err != nil {
		log.Fatal(err)
	}
	dbPath := filepath.Join(appDir, "tasks.sqlite")
	log.Println("SQLite DB path:", Colorf(dbPath, "blue"))
	_, err = os.Stat(dbPath)
	dbExistsAtStartUp := true
	if errors.Is(err, os.ErrNotExist) {
		dbExistsAtStartUp = false
	}
	// os.Remove(dbPath)
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	if !dbExistsAtStartUp {
		query := `
		create table tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, status TEXT, label TEXT, priority TEXT);
		`
		_, err = db.Exec(query)
		if err != nil {
			log.Printf("%q: %s\n", err, query)
			return
		}
	}

	// Create an instance of the app structure
	app := NewApp(db)

	// Create application with options
	err = wails.Run(&options.App{
		Width:  1280,
		Height: 800,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 245, G: 245, B: 245, A: 1},
		OnStartup:        app.startup,
		Bind: []any{
			app,
		},
		EnumBind: []any{
			AllLabels,
			AllPriorities,
			AllStatuses,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
