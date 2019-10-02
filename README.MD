# Docker deploy webhook
# Docker swarm

`docker swarm init`

`docker service create --name docker-deploy-webhook --with-registry-auth --constraint "node.role==manager" --publish=3000:3000 --mount type=bind,src=/var/run/docker.sock,dst=/var/run/docker.sock -e PORT="3000" -e CONFIG="production" -e TOKEN="123456QWERTY" siturrausach/docker-deploy-webhook:latest`

## Docker
### Construyendo el Docker

Vaya a la carpeta del proyecto en una ventana de terminal, luego ejecute el siguiente comando para construir el contenedor y etiquetarlo como docker-deploy-webhook

`docker build -t docker-deploy-webhook .`

Luego ejecute el contenedor separado de la ventana de terminal, asigne el nombre a docker-deploy-webhook y abra el puerto 80.

`docker run -i -d -p 3000:3000 -e TOKEN="123456QWERTY" -e PORT=3000 -v /var/run/docker.sock:/var/run/docker.sock --name docker-deploy-webhook docker-deploy-webhook`

Tenga en cuenta que esta compilación es para fines de desarrollo, no ejecuta la aplicación compilada dentro de la carpeta dist, por lo que se espera un contenedor grande.

Atajo: `docker stop docker-deploy-webhook && docker rm docker-deploy-webhook`

## Testing

`curl -v -H "Content-Type: application/json" --data @payload.json  http://localhost:3000/webhook/123456QWERTY`
