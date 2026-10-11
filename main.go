
package main

import (
	"fmt"
	"os"
	"os/exec"
	"runtime"
	"strings"
)

func main() {
	fmt.Println("gothub-helper — Local Diagnostics")
	fmt.Println("---------------------------------")
	printSystemInfo()
	printGitLog()
}

func printSystemInfo() {
	hostname, err := os.Hostname()
	if err != nil {
		hostname = "unavailable"
	}
	user := os.Getenv("USER")
	if user == "" {
		user = os.Getenv("USERNAME")
	}
	if user == "" {
		user = "unavailable"
	}
	fmt.Println("\nSystem Information")
	fmt.Println("OS:", runtime.GOOS)
	fmt.Println("Architecture:", runtime.GOARCH)
	fmt.Println("Hostname:", hostname)
	fmt.Println("User:", user)
}

func printGitLog() {
	fmt.Println("\nRecent Git Commits")
	if _, err := exec.LookPath("git"); err != nil {
		fmt.Println("Git is not installed or not in PATH.")
		return
	}
	cmd := exec.Command("git", "log", "--oneline", "-5")
	output, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Println("Unable to read Git history.")
		if message := strings.TrimSpace(string(output)); message != "" {
			fmt.Println(message)
		}
		return
	}
	result := strings.TrimSpace(string(output))
	if result == "" {
		fmt.Println("No commits found.")
		return
	}
	fmt.Println(result)
}