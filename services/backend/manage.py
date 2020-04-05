# manage.py


import sys

from flask.cli import FlaskGroup

from app import create_app, db
from app.api.users.models import User

app = create_app()
cli = FlaskGroup(create_app=create_app)


@cli.command('recreate_db')
def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()


@cli.command('seed_db')
def seed_db():
    db.session.add(User(username='harrywang', email="harrywang@gmail.com", password="mypassword"))
    db.session.add(User(username='lebronjames', email="ljames@nba.com", password="mypassword"))
    db.session.commit()


if __name__ == '__main__':
    cli()
