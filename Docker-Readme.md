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





# Docker Compose — Reference Guide

## What Problem Does Docker Compose Solve?

A real application has multiple parts:
- A Node.js app
- A database (PostgreSQL)
- A cache (Redis)

Without Compose you'd manually start each container one by one with separate docker run commands.
With Compose you define everything in one file and start it all with one command.

---

## The docker-compose.yml File

This is the file Docker Compose reads. It defines all your services (containers).

### Example — Node.js App + PostgreSQL Database

```yaml
services:
  app:
    build: .
    ports:
      - "8080:3000"
    container_name: arthurapp-container
    depends_on:
      - db

  db:
    image: postgres:15
    container_name: arthurapp-db
    environment:
      POSTGRES_USER: arthur
      POSTGRES_PASSWORD: arthur123
      POSTGRES_DB: arthurdb
    ports:
      - "5432:5432"
```

### Line by Line Explanation

**app service:**
- `build: .` — build the image from the Dockerfile in the current directory
- `ports: "8080:3000"` — map port 8080 on EC2 to port 3000 inside the container
- `container_name` — give the container a name
- `depends_on: - db` — do not start the app until the db container is running first

**db service:**
- `image: postgres:15` — pull the official PostgreSQL 15 image from Docker Hub (no Dockerfile needed)
- `container_name` — give the database container a name
- `environment` — environment variables PostgreSQL needs to set itself up:
  - POSTGRES_USER = database username
  - POSTGRES_PASSWORD = database password
  - POSTGRES_DB = name of the database to create
- `ports: "5432:5432"` — PostgreSQL default port, map EC2 port 5432 to container port 5432

---

## Key Concepts

### depends_on
Tells Compose the startup order. If app depends_on db, the database starts first.
In plain English: "Do not start this service unless the condition is met."

### services
Each service = one container. You can have as many services as your app needs.

### build vs image
- `build: .` — build a custom image from your Dockerfile
- `image: postgres:15` — pull an existing image from Docker Hub directly

### networks
Docker Compose automatically creates a private network for all your services.
This means your app container and db container can talk to each other by service name.
Example: your app can connect to the database using hostname `db` instead of an IP address.

---

## Common Issues

### Port already in use
If you get "address already in use" error:
- Something else is already running on that port
- On EC2, system PostgreSQL runs on port 5432 by default
- Fix: `sudo systemctl stop postgresql` then run docker compose up again

### Service name vs container name
- Docker Compose commands use SERVICE NAME (e.g. `app`, `db`)
- Regular Docker commands use CONTAINER NAME (e.g. `arthurapp-container`)
- Wrong: `docker compose logs arthurapp-container`
- Correct: `docker compose logs app`

---

## Docker Compose vs Regular Docker vs Kubernetes

| | Regular Docker | Docker Compose | Kubernetes |
|---|---|---|---|
| Manages | One container at a time | Multiple containers on one server | Multiple containers across many servers |
| Command | docker run | docker compose up | kubectl apply |
| Best for | Simple single container | Multi-container apps on one server | Large scale production |
