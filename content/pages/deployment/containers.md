---
Title: Containers
Sort: 8
---

# Containers (Docker)

Official Raneto container images on [Docker Hub](https://hub.docker.com/r/raneto/raneto/tags)  

Run the default container, and access on [localhost:3000](http://localhost:3000)  
`docker run --rm -it --publish 3000:3000 raneto/raneto:latest`

Same as above, but provide your own content and configuration  
```
docker run --rm -it --publish 3000:3000 \
  --volume \
  --volume \
  raneto/raneto:latest
```

Want to poke around the files in the container? Get a shell:  
`docker run --rm -it --publish 3000:3000 --volume raneto/raneto:latest /bin/sh`
