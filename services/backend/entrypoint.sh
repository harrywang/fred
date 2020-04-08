#!/bin/sh

echo "Waiting for postgres..."

# scan the port to see whether postgres database is ready or not
while ! nc -z db 5432; do
  sleep 0.1
done

echo "PostgreSQL started"

# load data
python manage.py reset_db
python manage.py load_data

# start backend server
python manage.py run -h 0.0.0.0
