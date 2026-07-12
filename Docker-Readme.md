# Docker — Complete Reference Guide

A full guide for understanding and working with Docker on a Linux server.

---

## What is Docker?

Docker is a tool that packages your application and everything it needs to run — code, runtime, dependencies, environment — into one isolated unit called a **container**.

Without Docker: you'd manually install Node.js, configure the environment, set up dependencies on every server you deploy to. If you move to a new server, you start over.

With Docker: you package the app once into a container. That container runs exactly the same way on any server, anywhere in the world.

---

## Key Concepts

| Term | What it means |
|---|---|
| **Image** | The blueprint/snapshot of your app. Built from a Dockerfile. Read-only. |
| **Container** | A running instance of an image. This is what actually runs your app. |
| **Dockerfile** | A recipe file that tells Docker how to build your image. |
| **Docker Hub** | A registry where you store and share Docker images (like GitHub but for images). |
| **Port Mapping** | Connecting a port on your EC2 to a port inside the container. |

---

## The Dockerfile

The Dockerfile is the most important file in Docker. It defines how your image is built.

### Example Dockerfile (Node.js app)

```dockerfile
FROM node:18
# Start with an official Node.js 18 base image
# This means the container already has Node.js installed — you don't need to install it manually

WORKDIR /app
# Set the working directory inside the container
# All commands after this run from /app

COPY . .
# Copy everything from your current folder into the container's /app folder
# First dot = source (your machine), Second dot = destination (container)

RUN npm install
# Install your app's dependencies inside the container
# Requires a package.json file to exist

EXPOSE 3000
# Tell Docker this container will use port 3000
# This is documentation — you still need -p when running the container

CMD ["node", "app.js"]
# The command that runs when the container starts
# This starts your Node.js app
```

---

## Step by Step: Containerizing an App

### Step 1 — Create your app
```bash
mkdir /var/www/myapp
cd /var/www/myapp
nano app.js
```

### Step 2 — Initialize npm (creates package.json)
```bash
npm init -y
```

### Step 3 — Create the Dockerfile
```bash
nano Dockerfile
```

### Step 4 — Build the image
```bash
docker build -t myapp .
```
- `-t myapp` = tag/name the image "myapp"
- `.` = look for the Dockerfile in the current directory

### Step 5 — Run the container
```bash
docker run -d -p 3000:3000 --name myapp-container myapp
```
- `-d` = run in background (detached)
- `-p 3000:3000` = map EC2 port 3000 to container port 3000
- `--name myapp-container` = name the container
- `myapp` = the image to use

### Step 6 — Verify it's running
```bash
docker ps
```

### Step 7 — Visit in browser
```
http://your-ec2-ip:3000
```

---

## Updating Your App

When you change your code, the running container won't update automatically. You have to rebuild:

```bash
# Stop the old container
docker stop myapp-container

# Remove the old container
docker rm myapp-container

# Rebuild the image with new code
docker build -t myapp .

# Run a fresh container
docker run -d -p 3000:3000 --name myapp-container myapp
```

---

## Debugging

If your container crashes or won't start, check the logs:

```bash
docker logs myapp-container
```

This shows you exactly what went wrong — syntax errors, missing files, port conflicts.

To watch logs live as the container runs:
```bash
docker logs -f myapp-container
```

To go inside a running container and look around:
```bash
docker exec -it myapp-container bash
```

---

## Port Mapping — Important

```
-p 8080:3000
    │     │
    │     └── Port inside the container (what your app uses)
    └──────── Port on your EC2 (what the world connects to)
```

So `-p 80:3000` means: visitors hit port 80 on your EC2, Docker forwards that traffic to port 3000 inside the container.

---

## Common Mistakes

| Mistake | Fix |
|---|---|
| Forgot `npm init -y` | Run `npm init -y` before building |
| Missing closing `});` in JavaScript | Check your syntax carefully |
| Container not starting | Run `docker logs container-name` to find the error |
| Port already in use | Stop the old container first or use a different port |
| Changes not showing | Stop, remove, rebuild, and rerun the container |

---

## Cron vs Docker vs Lambda

| | Cron | Docker | Lambda |
|---|---|---|---|
| Requires server | Yes | Yes | No |
| Isolated environment | No | Yes | Yes |
| Portable | No | Yes | Yes |
| Best for | Scheduled tasks | Running apps consistently | Serverless functions |
