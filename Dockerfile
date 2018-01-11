
# Changed from node image to Alpine to move from about 250Mb image to ~70Mb
#FROM node:6
FROM mhart/alpine-node:8

ARG sshKey
ARG hosts

RUN mkdir -p ~/.ssh && \
    echo "$sshKey" > ~/.ssh/id_rsa && \
    chmod 400 ~/.ssh/id_rsa

RUN echo "$hosts" > ~/.ssh/known_hosts && \
    chmod 644 ~/.ssh/known_hosts

RUN apk add --update git openssh  && \
  rm -rf /tmp/* /var/cache/apk/*

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app

RUN npm install

COPY . /usr/src/app

EXPOSE 8090

CMD ["npm", "start"]

