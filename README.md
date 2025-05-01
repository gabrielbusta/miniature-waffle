## About

This is a TODO application I build to learn some Go.
It is as simple CRUD TODO app that stores tasks in a sqlite database in the computer's userConfigDir directory.
This is based on the official Wails React-TS template.
I added tailwind and used shadcn to scaffold components in the frontend.
You can configure the project by editing `wails.json`. More information about the project settings can be found
here: https://wails.io/docs/reference/project-config

## Live Development

To run in live development mode, run `wails dev` in the project directory. This will run a Vite development
server that will provide very fast hot reload of your frontend changes. If you want to develop in a browser
and have access to your Go methods, there is also a dev server that runs on http://localhost:34115. Connect
to this in your browser, and you can call your Go code from devtools.

## Building

To build a redistributable, production mode package, use `wails build`.
