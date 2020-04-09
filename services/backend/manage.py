# manage.py


import sys
import csv
from dateutil import parser


from flask.cli import FlaskGroup

from app import create_app, db
from app.api.models import User, Author, Quote

app = create_app()
cli = FlaskGroup(create_app=create_app)


@cli.command('reset_db')
def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()
    print("database reset done!")


# load sample quote data
@cli.command('load_data')
def load_data():

    # load user table
    db.session.add(User(username='test', email="test@test.com", password="test"))
    db.session.add(User(username='lebronjames', email="ljames@nba.com", password="mypassword"))
    db.session.add(User(username='stephencurry', email="stephencurry@nba.com", password="mypassword"))
    print("user table loaded")

    # load author and quote tables
    # author table: id,name,birthday,bornlocation,bio
    # quote table: id,content,author_id
    with open('app/sample-data/author.csv', 'r', encoding="utf-8") as author_csv:
        author_csv_reader = csv.reader(author_csv, delimiter=',')
        for author in author_csv_reader:
            db.session.add(Author(id=int(author[0]), name=author[1], birthday=parser.parse(author[2]), bornlocation=author[3], bio=author[4]))

    with open('app/sample-data/quote.csv', 'r', encoding="utf-8") as quote_csv:
        quote_csv_reader = csv.reader(quote_csv, delimiter=',')
        for quote in quote_csv_reader:
            db.session.add(Quote(id=int(quote[0]), content=quote[1], author_id=int(quote[2])))

    db.session.commit()
    print("author and quote tables loaded")

if __name__ == '__main__':
    cli()
