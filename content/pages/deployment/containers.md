---
Title: Containers
Sort: 8
---

# Containers (Docker)

Official Raneto container images on [Docker Hub](https://hub.docker.com/r/raneto/raneto/tags)

Run the default container, and access on [localhost:8080](http://localhost:8080)  
`docker run --rm -it --publish 8080:8080 raneto/raneto:latest`

Same as above, but provide your own content and configuration

```
docker run --rm -it --publish 8080:8080 \
  --volume \
  --volume \
  raneto/raneto:latest
```

Want to poke around the files in the container? Get a shell:  
`docker run --rm -it --publish 8080:8080 --volume raneto/raneto:latest /bin/sh`
