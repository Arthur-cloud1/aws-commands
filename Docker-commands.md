# Docker Commands Reference

## Image Commands
- Build an image from Dockerfile - `docker build -t image-name .`
- Build from a specific path - `docker build -t image-name /path/to/dockerfile`
- List all images - `docker images`
- Remove an image - `docker rmi image-name`
- Remove all unused images - `docker image prune`

## Container Commands
- Run a container - `docker run -d -p 3000:3000 --name container-name image-name`
- See running containers - `docker ps`
- See all containers including stopped - `docker ps -a`
- Stop a container - `docker stop container-name`
- Start a stopped container - `docker start container-name`
- Restart a container - `docker restart container-name`
- Remove a container - `docker rm container-name`
- Remove a running container by force - `docker rm -f container-name`
- View container logs - `docker logs container-name`
- Watch container logs live - `docker logs -f container-name`
- Go inside a running container - `docker exec -it container-name bash`
- Exit a container - `exit`

## docker run Flags Explained
- `-d` = detached mode, runs container in background so terminal stays free
- `-p` = port mapping (outside:inside)
- `--name` = give the container a custom name
- `-it` = interactive mode, used when you want to go inside a container

## Port Mapping Explained
- `-p 3000:3000` = port 3000 on EC2 maps to port 3000 inside container
- `-p 80:3000` = port 80 on EC2 maps to port 3000 inside container
- First number = EC2 (outside), Second number = container (inside)

## Docker Hub Commands
- Login to Docker Hub - `docker login`
- Tag an image for Docker Hub - `docker tag image-name dockerhub-username/image-name`
- Push image to Docker Hub - `docker push dockerhub-username/image-name`
- Pull an image from Docker Hub - `docker pull image-name`

## Cleanup Commands
- Remove all stopped containers - `docker container prune`
- Remove all unused images - `docker image prune`
- Remove everything unused - `docker system prune`
