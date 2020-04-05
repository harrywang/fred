# pull official base image
FROM node:13.5.0-alpine

# set working directory
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# --no-cache: download package index on-the-fly, no need to cleanup afterwards
# --virtual: bundle packages, remove whole bundle at once, when done
RUN apk update
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json
RUN npm ci
RUN npm install react-scripts@3.4.0 -g --silent

# remove whole bundle at once, when done
RUN apk del build-dependencies

# start app
CMD ["npm", "start"]
