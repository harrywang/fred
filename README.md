# About
FRED (Flask + REact + Docker): a boilerplate for full stack development

## Run

To run:

```
$ docker-compose up -d --build
$ docker-compose exec backend python manage.py reset_db
$ docker-compose exec backend python manage.py load_data
$ docker-compose stop
```
then go to http://localhost:3007

If something does not work, you can try to use:

```
$ docker-compose down -v
$ docker-compose up -d --build
```

## Tests

backend tests:

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

frontend tests:

```
$ docker-compose exec frontend npm test
$ docker-compose exec frontend npm run prettier:check
$ docker-compose exec frontend npm run prettier:write
$ docker-compose exec frontend npm run lint
```

access the database via psql

```
$ docker-compose exec db psql -U postgres
# \c app_dev
# select * from user;
# select * from author;
# \q
```


Other commands:

```
$ docker-compose down
$ docker-compose down -v
$ docker system prune -a --volumes # delete everything
```

ssh to container

```
$ docker-compose exec backend /bin/sh
$ docker-compose exec backend-db /bin/sh
```

URLs:

 - http://127.0.0.1:5001/ping, ping.py
 - http://127.0.0.1:5001/users, list all users
 - http://localhost:5001/admin/user/, flask admin
 - http://127.0.0.1:5001/docs, swagger api docs


 ## References

 - [Authentication with Flask, React, and Docker](https://testdriven.io/courses/auth-flask-react/getting-started/): I borrowed lots of code from this course (highly recommended). You can checkout the authors' code at [here](https://gitlab.com/testdriven/flask-react-auth). Please buy the course to support the author.
 - [Using CircleCI workflows to replicate Docker Hub automated builds](https://circleci.com/blog/continuous-integration-and-deployment-for-android-apps-with-fastlane/)
