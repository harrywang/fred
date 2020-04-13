## Heroku Deployment:

- setup nginx by adding `services/nginx/default.conf`. Note that nginx listens at `$PORT`
- add Dockerfile.deploy file. Note that `sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && \` maps `$PORT` in `services/nginx/default.conf` by the environmental variable PORT supplied by Heroku - you will supply this port when running the container later.
- create a Heroku account and setup [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- create a new app `heroku create getfred`, note that the app name `getfred` has to be unique
```
$ heroku create getfred
Creating ⬢ getfred... done
https://getfred.herokuapp.com/ | https://git.heroku.com/getfred.git
```
Empty app is created:
<img width="1261" alt="Screen Shot 2020-04-10 at 3 42 56 PM" src="https://user-images.githubusercontent.com/595772/79018546-0dee4b00-7b42-11ea-9504-d38337ccdf9e.png">
No Config Vars so far:
<img width="1266" alt="Screen Shot 2020-04-10 at 3 43 11 PM" src="https://user-images.githubusercontent.com/595772/79018552-1050a500-7b42-11ea-9122-78ac19592742.png">

- Start a new Postgres database with the hobby-dev plan: `$ heroku addons:create heroku-postgresql:hobby-dev`
```
dami:fred harrywang$ heroku addons:create heroku-postgresql:hobby-dev
Creating heroku-postgresql:hobby-dev on ⬢ getfred... free
Database has been created and is available
 ! This database is empty. If upgrading, you can transfer
 ! data from another database with pg:copy
Created postgresql-triangular-16372 as DATABASE_URL
Use heroku addons:docs heroku-postgresql to view documentation
```
Database is attached:
<img width="1271" alt="Screen Shot 2020-04-10 at 3 45 22 PM" src="https://user-images.githubusercontent.com/595772/79018664-602f6c00-7b42-11ea-8a73-e3ef9df06cb7.png">
DATABASE_URL configuration variable has been generated:
<img width="1269" alt="Screen Shot 2020-04-10 at 3 45 43 PM" src="https://user-images.githubusercontent.com/595772/79018669-61f92f80-7b42-11ea-975f-5cc5cf5a92d9.png">

- get the database URL
```
$ heroku config:get DATABASE_URL
postgres://some_random_username:some_random_password@ec2-18-235-20-228.compute-1.amazonaws.com:5432/some_random_db_name
```
- Export local environment variable DATABASE_URL - **NOTE**: the Heroku image we are going to build using `Dockerfile.deploy` reads from this local environment variable (this is automatically set on Heroku app when we started the Postgres database above).
```
$ export DATABASE_URL=postgres://some_random_username:some_random_password@ec2-18-235-20-228.compute-1.amazonaws.com:5432/some_random_db_name
```

- Set security key on remote Heroku App: `heroku config:set SECRET_KEY=you_should_choose_your_key --app getfred`
<img width="955" alt="Screen Shot 2020-04-10 at 3 54 25 PM" src="https://user-images.githubusercontent.com/595772/79019130-9caf9780-7b43-11ea-9f82-d480625f5b4c.png">

- Build and tag the image: `docker build -f Dockerfile.deploy -t registry.heroku.com/getfred/web .`
```
dami:fred harrywang$ docker image ls
REPOSITORY                        TAG                 IMAGE ID            CREATED             SIZE
registry.heroku.com/getfred/web   latest              5cf10836d5b9        9 minutes ago       306MB
```
- Start the newly built image (you can change the ports to any used ports):
`docker run -d --name getfred -e PORT=8765 -e DATABASE_URL="$(echo $DATABASE_URL)" -e "SECRET_KEY=test" -e "REACT_APP_BACKEND_SERVICE_URL=http://localhost:8007" -p 8007:8765 registry.heroku.com/getfred/web:latest`

  - `--name`:  assign a container name, see with `getfred` name below or a random name is assigned each time
  <img width="582" alt="Screen Shot 2020-04-10 at 3 26 42 PM" src="https://user-images.githubusercontent.com/595772/79017638-d5e60880-7b3f-11ea-84b6-84e0db0870e9.png">

  - `-e`: set environment variables for the container. `-e PORT=8765` says Nginx listens on port 8765
  - `-p`: Publish a container's port or a range of ports to the host. Format is `hostPort:containerPort`, `-p 8007:8765` means the host's 8007 port will be directed to the container's 8765 port
- Reset database and load data. `-it` means executing an interactive bash shell (maybe i:interactive, t: terminal) on the container.
```
$ docker exec -it getfred python manage.py reset_db
$ docker exec -it getfred python manage.py load_data
```
- Stop and remove the 'getfred' image
```
$ docker stop getfred
$ docker rm getfred
```
- Log in to the Heroku Container Registry: `$ heroku container:login`
- push image `docker push registry.heroku.com/getfred/web:latest`
```
$ heroku container:release --app getfred web
$ heroku run python manage.py reset_db
$ heroku run python manage.py load_data
```
Done! your app is running at https://getfred.herokuapp.com and https://getfred.herokuapp.com/docs/

## CircleCI

- add .circleci/config.yml
- add Docker Hub environment variables on CircleCI.com:
<img width="771" alt="Screen Shot 2020-04-11 at 10 08 35 AM" src="https://user-images.githubusercontent.com/595772/79046079-97525b80-7bdc-11ea-8c6d-b974539be00d.png">
