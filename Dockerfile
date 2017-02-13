FROM node
MAINTAINER charlieamer
RUN mkdir /Knowlead-WebClient
ADD package.json /Knowlead-WebClient
RUN cd /Knowlead-WebClient && npm update
ADD src /Knowlead-WebClient/src
ADD angular-cli.json /Knowlead-WebClient
EXPOSE 4200
WORKDIR /Knowlead-WebClient
ENTRYPOINT ["node_modules/@angular/cli/bin/ng", "serve", "--prod", "--host", "0.0.0.0", "--port", "4200", "--live-reload", "false", "--aot", "true"]
