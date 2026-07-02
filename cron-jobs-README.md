# Cron Jobs & Shell Scripting on Linux (Ubuntu EC2)

A complete reference guide for automating tasks on a Linux server using shell scripting and cron jobs.

---

## What is a Shell Script?

A shell script is a file containing a series of Linux commands. Instead of typing commands one by one manually, you put them all in a file and run it once — the server executes them in order.

---

## What is a Cron Job?

A cron job is a scheduled task on Linux. You tell the server "run this command/script at this time, repeatedly" — and it does it automatically as long as the server is on.

The service that handles this in the background is called **cron** (a daemon — a background process always running).

---

## Step 1: Create Your Script

### Navigate to your working directory
```bash
cd /var/www/
```

### Create the script file with nano
```bash
nano your-script-name.sh
```

### Basic script structure
```bash
#!/bin/bash
# The first line (shebang) MUST start with #!/bin/bash
# It tells Linux to use bash to run this script

echo "Your message here"
echo "Current date and time: $(date)"
```

> ⚠️ The shebang line must be `#!/bin/bash` — not `#!bin/bash`. The `/` before bin is critical.

### Save and exit nano
- `Ctrl + X` → `Y` → `Enter`

### Verify the file content
```bash
cat your-script-name.sh
```

---

## Step 2: Make the Script Executable

By default, a new file cannot be executed. You must give it execute permission first.

```bash
chmod +x your-script-name.sh
```

### Verify permissions changed
```bash
ls -la
```

Before: `-rw-rw-r--` (no execute)  
After: `-rwxrwxr-x` (execute added — see the `x`)

---

## Step 3: Test the Script Manually

Always test your script manually before scheduling it with cron.

```bash
./your-script-name.sh
```

> `./` means "run this file from the current directory." Linux doesn't look in your current folder by default — `./` tells it to look right here.

---

## Step 4: Configure Server Timezone (Important!)

By default, Linux servers run on **UTC** time. If you're in Lagos, Nigeria, your timezone is **WAT (UTC+1)**. Always set this before scheduling cron jobs or your timestamps will be wrong.

### Check current timezone
```bash
timedatectl
```

### Change timezone to Lagos
```bash
sudo timedatectl set-timezone Africa/Lagos
```

### Verify the change
```bash
timedatectl
```

You should now see `WAT` instead of `UTC` in the output.

---

## Step 5: Schedule with Cron

### Open your crontab
```bash
crontab -e
```
> First time? It will ask you to choose an editor — choose nano (option 1).

### Cron Syntax

```
* * * * * command_to_run
│ │ │ │ │
│ │ │ │ └── Day of week (0-6 | 0=Sunday, 1=Monday ... 6=Saturday)
│ │ │ └──── Month (1-12)
│ │ └────── Day of month (1-31)
│ └──────── Hour (0-23)
└────────── Minute (0-59)
```

### Common Cron Examples

| Schedule | Cron Expression |
|---|---|
| Every minute | `* * * * *` |
| Every hour | `0 * * * *` |
| Every day at 10am | `0 10 * * *` |
| Every Monday at 8am | `0 8 * * 1` |
| Monday & Friday at 10am | `0 10 * * 1,5` |
| Every 5 minutes | `*/5 * * * *` |
| Every day at midnight | `0 0 * * *` |

### Save output to a file (recommended)
Always redirect your script output to a file so you can review it later:

```
0 10 * * 1,5 /var/www/your-script.sh >> /var/www/output.txt 2>&1
```

- `>>` appends output to the file (doesn't overwrite)
- `2>&1` captures errors too, not just normal output

---

## Step 6: Verify Cron is Running

### Check your scheduled jobs
```bash
crontab -l
```

### Check cron logs to confirm it's executing
```bash
grep CRON /var/log/syslog | tail -10
```

### Watch output file update in real time
```bash
tail -f /var/www/output.txt
```
Press `Ctrl + C` to stop watching.

---

## Real World Example: Server Maintenance Report

This is the script we built — automatically generates a server health report.

### The Script (`/var/www/server-report.sh`)
```bash
#!/bin/bash

echo "====================================="
echo "   SERVER MAINTENANCE REPORT"
echo "   Generated on: $(date)"
echo "====================================="

echo ""
echo "--- UPTIME ---"
uptime

echo ""
echo "--- DISK SPACE ---"
df -h

echo ""
echo "--- MEMORY USAGE ---"
free -h

echo ""
echo "--- LOGGED IN USERS ---"
who

echo ""
echo "====================================="
echo "   END OF REPORT"
echo "====================================="
```

### The Cron Schedule (Every Monday & Friday at 10am)
```
0 10 * * 1,5 /var/www/server-report.sh >> /var/www/server-report.txt 2>&1
```

---

## Useful Cron Management Commands

| Command | What it does |
|---|---|
| `crontab -e` | Open and edit your crontab |
| `crontab -l` | List all your scheduled jobs |
| `crontab -r` | Delete ALL your cron jobs (careful!) |
| `sudo crontab -e` | Edit root's crontab (avoids permission issues) |

---

## Permission Issues

If your cron job runs but the output file is not being created, it's likely a **permissions issue**. The user running cron doesn't have write access to the directory.

### Fix option 1 — Run as root (simplest)
```bash
sudo crontab -e
```

### Fix option 2 — Give write permission to the directory
```bash
sudo chmod 777 /var/www
```
> ⚠️ `777` gives everyone full access. Fine for learning, but in production use more restrictive permissions.

---

## Cron vs AWS Lambda

| | Cron | AWS Lambda + EventBridge |
|---|---|---|
| Requires server to be on | ✅ Yes | ❌ No (serverless) |
| Cost | Server must run 24/7 | Pay per execution only |
| Setup complexity | Simple | Requires AWS config |
| Best for | Server already running anyway | Saving credits, no server |

> **Key insight:** If your EC2 instance is off when a cron job is scheduled to run — it simply skips. No retry. No catchup. This is why Lambda exists for scheduled cloud tasks.

---

## Commands Used Today

```bash
# Create directory
sudo mkdir -p /var/www/arthurapp

# Navigate into directory
cd /var/www/

# Create and edit script
nano server-report.sh

# View script contents
cat server-report.sh

# Make script executable
chmod +x server-report.sh

# Run script manually
./server-report.sh

# Check timezone
timedatectl

# Set timezone to Lagos
sudo timedatectl set-timezone Africa/Lagos

# Open crontab
crontab -e

# List cron jobs
crontab -l

# Delete all cron jobs
crontab -r

# Check cron logs
grep CRON /var/log/syslog | tail -10

# Watch output file live
tail -f /var/www/server-report.txt

# Delete a file
rm -rf filename

# View directory with permissions
ls -la
```
