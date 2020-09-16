# About
[![harrywang](https://circleci.com/gh/harrywang/fred.svg?style=shield)](https://app.circleci.com/pipelines/github/harrywang/fred)

![Build Status](https://codebuild.us-east-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiM3pqOWNyVEYwTURBcCsrWnkwU0QxZHVHQmhRZ3pOUnZqZnRtZWxmWDhFM0tBNHJMWG9SK1hrdGtQL2I1K0Z4cHFmbFJoL1VTcmM5NHpxV3E4R1pNMHBzPSIsIml2UGFyYW1ldGVyU3BlYyI6InZWRUZXZHliUmhFamVPcTQiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)

FRED (Flask + REact + Docker): An End-to-End Boilerplate for Full Stack Development

Demo: [harrywang.me/fred](http://harrywang.me/fred)

<img width="1013" alt="Screen Shot 2020-04-10 at 8 46 58 PM" src="https://user-images.githubusercontent.com/595772/79031413-7b16d600-7b6c-11ea-9799-9fce00453290.png">

Tools and packages used in this project:

- [Flask](https://flask.palletsprojects.com/): a micro web framework written in Python
- [React](https://reactjs.org/): a JavaScript library for building user interfaces
- [Docker](https://www.docker.com/): a set of platform as a service products that uses OS-level virtualization to deliver software in packages called containers
- [Postgres](https://www.postgresql.org/): a free and open-source relational database management system
- [SQLAlchemy](https://www.sqlalchemy.org/): an open-source SQL toolkit and object-relational mapper for Python
- [Flask-RESTX](https://flask-restx.readthedocs.io/): a Flask extension for building REST APIs
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
- [CircleCI](https://circleci.com/): a continuous integration and delivery platform
- AWS (TODO)

Data: I use the data scraped from http://quotes.toscrape.com/. Check out my tutorial [A Minimalist End-to-End Scrapy Tutorial](https://towardsdatascience.com/a-minimalist-end-to-end-scrapy-tutorial-part-i-11e350bcdec0?source=friends_link&sk=c9f8e32f28a88c61987ec60f93b93e6d) if you are interested in learning web scraping.

Special Thanks: many parts of this repo are based on the [open-source code](https://github.com/testdrivenio/flask-react-aws) and related [courses](https://testdriven.io/payments/bundle/microservices-with-docker-flask-and-react/) offered by Michael Herman from testdriven.io - highly recommended! Please show your support by buying the courses - I am not affiliated with testdriven.io - just really enjoyed the courses :).

## Team

- [Harry Wang](http://harrywang.me/)
- [Jinggang Zhuo](https://github.com/zhuojg)

## Prerequisites

I recommend the following materials, which can greatly help you understand the code in this repo.
- Flask and SQLAlchemy: [The Flask Mega-Tutorial](https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world) by Miguel Grinberg
- React: [Intro to React](https://reactjs.org/tutorial/tutorial.html) and [Step-by-Step Guide](https://reactjs.org/docs/hello-world.html)
- Docker and Docker Compose: [ Getting started with Docker](https://docs.docker.com/get-started/) and [Get started with Docker Compose](https://docs.docker.com/compose/gettingstarted/)

## Setup

You need to install the followings:

- Python 3
- Node.js
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

## CircleCI

- add .circleci/config.yml
- add Docker Hub environment variables on CircleCI.com:
<img width="771" alt="Screen Shot 2020-04-11 at 10 08 35 AM" src="https://user-images.githubusercontent.com/595772/79046079-97525b80-7bdc-11ea-8c6d-b974539be00d.png">
- Note that you have to use machine executor for docker-compose to work (set `machine: true`)
- You have to change add `CI=true` to `package.json` such as `"test": "CI=true react-scripts test --env=jsdom"` to turn off the watch mode. Otherwise, CI testing step will never complete.

## Deployment

`REACT_APP_BACKEND_SERVICE_URL` could be confusing and let me explain why it is necessary.

- First, all AJAX calls are using this variable (check `App.js`), such as:
```
axios.get(`${process.env.REACT_APP_BACKEND_SERVICE_URL}/users`)
```

- When we do local development, I hardcode this environment variable in `docker-compose.yml`: `REACT_APP_BACKEND_SERVICE_URL=http://localhost:5001` file, we have the backend running at port 5000 and mapping 5001 to 5000 in the same file.
- When we build the production image for deployment, we have `ENV REACT_APP_BACKEND_SERVICE_URL $REACT_APP_BACKEND_SERVICE_URL` in the `Dockerfile.deploy` file - this ensures that we don't hardcode this and let the image pick up the value from the service provider (such as Heroku) when it starts - **NOTE: whatever you set the value locally does not matter to the production image!!!** As you can see in the deployment instruction, we actually don't set this environment variable in Heroku, which means the AJAX calls are sent to the default port 80.
- Having this variable then gives you the flexibility to use any port during testing, e.g., we set it to port 8007 when testing the production image locally.

- Check out the Heroku deployment [instruction](/deploy/heroku/deployment-heroku.md)
- Check out the AWS deployment [instruction](/deploy/aws/deployment-aws.md)
