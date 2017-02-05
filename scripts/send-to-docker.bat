cd ..
@FOR /f "tokens=*" %%i IN ('docker-machine env default') DO @%%i
docker build . -t webclient
docker rm -f webclient
docker run -d -p 4200:4200 --name  webclient webclient