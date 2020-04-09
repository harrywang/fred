# app/tests/conftest.py


import pytest

from app import create_app, db
from app.api.models import User, Author, Quote


@pytest.fixture(scope="module")
def test_app():
    app = create_app()
    app.config.from_object("app.config.TestingConfig")
    with app.app_context():
        yield app  # testing happens here


@pytest.fixture(scope="module")
def test_database():
    db.create_all()
    yield db  # testing happens here
    db.session.remove()
    db.drop_all()


@pytest.fixture(scope="module")
def add_user():
    def _add_user(username, email, password):
        user = User(username=username, email=email, password=password)
        db.session.add(user)
        db.session.commit()
        return user

    return _add_user


@pytest.fixture(scope="module")
def add_quote():
    def _add_quote(author_name, content):

        author = Author()
        quote = Quote()

        author.name = author_name
        quote.content = content

        # check whether the author exists
        exist_author = db.session.query(Author).filter_by(name = author.name).first()
        if exist_author is not None:  # the current author exists
            quote.author = exist_author
        else:
            quote.author = author

        db.session.add(quote)
        db.session.commit()
        return quote

    return _add_quote
