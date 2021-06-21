# pull official base image
FROM python:3.8.1-alpine

# install dependencies
# updated
RUN apk update && \
    apk add --no-cache --virtual build-deps \
    openssl-dev libffi-dev g++ python3-dev musl-dev \
    postgresql-dev netcat-openbsd

# set environment varibles
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# set working directory
WORKDIR /usr/src/fred

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /usr/src/fred/requirements.txt
COPY ./requirements-dev.txt /usr/src/fred/requirements-dev.txt
RUN pip install -r requirements-dev.txt

# add entrypoint.sh
COPY ./entrypoint.sh /usr/src/fred/entrypoint.sh
RUN chmod +x /usr/src/fred/entrypoint.sh

# add app
COPY . /usr/src/fred
