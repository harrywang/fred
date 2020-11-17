# pull official base image
FROM python:3.8.1-alpine

# change Alpine Source
# for bad connection in China
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories

# install dependencies
# updated
RUN apk update && \
    apk add --no-cache --virtual build-deps \
    openssl-dev libffi-dev gcc python3-dev musl-dev \
    postgresql-dev netcat-openbsd

# set environment varibles
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# set working directory
WORKDIR /usr/src/fred

# install dependencies
# using Tsinghua source for bad connection in China
RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple --upgrade pip
COPY ./requirements.txt /usr/src/fred/requirements.txt
COPY ./requirements-dev.txt /usr/src/fred/requirements-dev.txt
RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements-dev.txt

# add entrypoint.sh
COPY ./entrypoint.sh /usr/src/fred/entrypoint.sh
RUN chmod +x /usr/src/fred/entrypoint.sh

# add app
COPY . /usr/src/fred
