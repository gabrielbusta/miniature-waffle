package main

import "fmt"

type Color struct {
	name string
	code string
}

const reset = "\033[0m"

func Colorf(msg string, color string) string {
	var colors = map[string]Color{
		"red":    {name: "red", code: "\033[31m"},
		"green":  {name: "green", code: "\033[32m"},
		"yellow": {name: "yellow", code: "\033[33m"},
		"blue":   {name: "blue", code: "\033[34m"},
	}
	return fmt.Sprintf("%s%s%s", colors[color].code, msg, reset)
}

func Italicf(msg string) string {
	code := "\033[3m"
	return fmt.Sprintf("%s%s%s", code, msg, reset)
}
