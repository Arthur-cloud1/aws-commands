#!/bin/bash

# --- VARIABLES ---
DISK_THRESHOLD=80
MEMORY_THRESHOLD=80
REPORT_FILE="/var/www/health-report.txt"
DATE=$(date)

# --- FUNCTIONS ---
check_disk() {
    DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | tr -d '%')
    echo "Disk Usage: $DISK_USAGE%"
    if [ $DISK_USAGE -gt $DISK_THRESHOLD ]; then
        echo "WARNING: Disk space is critically low!"
    else
        echo "Disk space is healthy."
    fi
}

check_memory() {
    MEMORY_USAGE=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
    echo "Memory Usage: $MEMORY_USAGE%"
    if [ $MEMORY_USAGE -gt $MEMORY_THRESHOLD ]; then
        echo "WARNING: Memory usage is too high!"
    else
        echo "Memory is healthy."
    fi
}

check_uptime() {
    echo "Server Uptime: $(uptime -p)"
}

# --- MAIN ---
echo "======================================"
echo "   SERVER HEALTH MONITOR"
echo "   $DATE"
echo "======================================"
echo ""

CHECKS=("disk" "memory" "uptime")

for CHECK in "${CHECKS[@]}"; do
    echo "--- Running $CHECK check ---"
    check_$CHECK
    echo ""
done

echo "======================================"
echo "   END OF REPORT"
echo "======================================"
