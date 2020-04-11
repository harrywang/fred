# About
FRED (Flask + REact + Docker): An End-to-End Boilerplate for Full Stack Development

Demo: [harrywang.me/fred](http://harrywang.me/fred)

<img width="1013" alt="Screen Shot 2020-04-10 at 8 46 58 PM" src="https://user-images.githubusercontent.com/595772/79031413-7b16d600-7b6c-11ea-9799-9fce00453290.png">

Tools and packages used in this repo:

- [Flask](https://flask.palletsprojects.com/): a micro web framework written in Python
- [React](https://reactjs.org/): a JavaScript library for building user interfaces
- [Docker](https://www.docker.com/): a set of platform as a service products that uses OS-level virtualization to deliver software in packages called containers
- [Postgres](https://www.postgresql.org/): a free and open-source relational database management system
- [SQLAlchemy](https://www.sqlalchemy.org/): an open-source SQL toolkit and object-relational mapper for Python
- [Flask-RESTX](https://flask-restx.readthedocs.io/):an Flask extension for building REST APIs
- [PyTest](https://docs.pytest.org/en/latest/): a Python testing framework
- [Jest](https://jestjs.io/): a JavaScript testing framework
- Python Linting and Formatting: flake8, black, isort
- JS Linting and Formatting: ESLint and Prettier
- JSON Web Tokens (JWT) via flask-bcrypt and pyjwt
- [Bulma](https://bulma.io/): a free, open source, and modern CSS framework
- [Fresh](https://github.com/cssninjaStudio/fresh): a beautiful Bulma template by CSSNinja
- Illustrations from [UnDraw.co](https://undraw.co/)
- Images from [Unsplash](https://unsplash.com/)
- [Heroku](https://www.heroku.com/): a platform as a service (PaaS) that enables developers to build, run, and operate applications entirely in the cloud.
- CircleCI (TODO)
- AWS (TODO)

Data: we use the data scraped from http://quotes.toscrape.com/. Check out my tutorial [A Minimalist End-to-End Scrapy Tutorial](https://towardsdatascience.com/a-minimalist-end-to-end-scrapy-tutorial-part-i-11e350bcdec0?source=friends_link&sk=c9f8e32f28a88c61987ec60f93b93e6d) if you are interested in learning web scraping.

Special Thanks: many parts of this repo are based on the [open-source code](https://github.com/testdrivenio/flask-react-aws) and related [courses](https://testdriven.io/payments/bundle/microservices-with-docker-flask-and-react/) offered by Michael Herman from testdriven.io - highly recommended! Please show your support by buying the courses - I am not affiliated with testdriven.io - just really enjoyed the courses :).


## Prerequisites

I recommend the following materials, which can greatly help you understand the code in this repo.
- Flask and SQLAlchemy: [The Flask Mega-Tutorial](https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world) by Miguel Grinberg
- React: [Intro to React](https://reactjs.org/tutorial/tutorial.html) and [Step-by-Step Guide](https://reactjs.org/docs/hello-world.html)
- Docker and Docker Compose: [ Getting started with Docker](https://docs.docker.com/get-started/) and [Get started with Docker Compose](https://docs.docker.com/compose/gettingstarted/)

## Setup

You need to install the followings:

- Python 3
- Node
- Docker

## Run

1. Clone the repo: `git clone https://github.com/harrywang/fred.git`
2. Switch to `fred` folder and run `docker-compose up -d --build`
3. Setup database and load data:
```
$ docker-compose exec backend python manage.py reset_db
$ docker-compose exec backend python manage.py load_data
```
4. Visit http://localhost:3007 to check the app and visit http://127.0.0.1:5001/docs/ to check API docs

Other useful commands:

```
$ docker-compose stop # stop containers
$ docker-compose down # stop and remove containers
$ docker-compose down -v # stop and remove containers and volumes
```

If something does not work, you can try to use:

```
$ docker-compose down -v
$ docker-compose up -d --build
```

Other docker commands:

```
$ docker image ls # check images
$ docker system prune -a --volumes # delete everything
```

## Tests

Run backend tests:

```
$ docker-compose exec backend python -m pytest "app/tests" -p no:warnings
$ docker-compose exec backend pytest "app/tests" -p no:warnings --cov="app"
$ docker-compose exec backend pytest "app/tests" -p no:warnings --cov="app" --cov-branch
$ docker-compose exec backend python -m pytest "app/tests" -p no:warnings --cov="app" --cov-branch --cov-report html
$ docker-compose exec backend python -m pytest "app/tests" -p no:warnings --cov="app" --cov-report html
$ docker-compose exec backend flake8 app
$ docker-compose exec backend black app
$ docker-compose exec backend /bin/sh -c "isort app/**/*.py"
```

Run frontend tests:

```
$ docker-compose exec frontend npm test
$ docker-compose exec frontend npm run prettier:check
$ docker-compose exec frontend npm run prettier:write
$ docker-compose exec frontend npm run lint
```

Access the database via psql:

```
$ docker-compose exec db psql -U postgres
# \c app_dev
# select * from user;
# select * from author;
# \q
```

SSH to containers:

```
$ docker-compose exec backend /bin/sh
$ docker-compose exec backend-db /bin/sh
```
## Development Workflow

Some notes:

- If you add new API endpoints - don't forget to add them to `services/nginx/default.conf`

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
- Export local environment variable DATABASE_URL - **NOTE**: the Heroku image we are going to build using `Dockerfile.deploy` reads from this local environment variable.
```
$ export DATABASE_URL=postgres://some_random_username:some_random_password@ec2-18-235-20-228.compute-1.amazonaws.com:5432/some_random_db_name
```

- Set security key on remote Heroku App: `heroku config:set SECRET_KEY=you_should_choose_your_key --app getfred`
<img width="955" alt="Screen Shot 2020-04-10 at 3 54 25 PM" src="https://user-images.githubusercontent.com/595772/79019130-9caf9780-7b43-11ea-9f82-d480625f5b4c.png">
- Set environment variable: `export REACT_APP_BACKEND_SERVICE_URL=http://localhost:8007` - I set '- REACT_APP_BACKEND_SERVICE_URL=http://localhost:5001' in `docker-compose.yml` file, so when we use 'docker-compose up -d' locally, port 5001 is used for AJAX calls from React. We are change this to 8007 (or any other number) to avoid potential locally conflict with the running services.
- Build and tag the image: `docker build -f Dockerfile.deploy -t registry.heroku.com/getfred/web .`
```
dami:fred harrywang$ docker image ls
REPOSITORY                        TAG                 IMAGE ID            CREATED             SIZE
registry.heroku.com/getfred/web   latest              5cf10836d5b9        9 minutes ago       306MB
```
- Start the newly built image: `docker run -d --name getfred -e PORT=8765 -e DATABASE_URL="$(echo $DATABASE_URL)" -e "SECRET_KEY=test" -p 8007:8765 registry.heroku.com/getfred/web:latest`
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
