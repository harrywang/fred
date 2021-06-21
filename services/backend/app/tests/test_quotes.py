# app/tests/test_quotes.py


import json

import pytest

from app.api.models import Author, Quote


def test_all_quotes(test_app, test_database, add_quote):
    test_database.session.query(Quote).delete()
    test_database.session.query(Author).delete()
    add_quote("Marilyn Monroe", "Imperfection is beauty.")
    add_quote(
        "Albert Einstein",
        "The world as we have created it is a process of our thinking.",
    )
    client = test_app.test_client()
    resp = client.get("/quotes")
    data = json.loads(resp.data)
    assert resp.status_code == 200
    # 2 quotes inserted above

    assert len(data) == 2
    assert "Imperfection is beauty." in data[0]["content"]
    assert "Marilyn Monroe" in data[0]["author_name"]
    assert "Albert Einstein" not in data[0]["author_name"]


def test_random_quotes(test_app, test_database, add_quote):
    test_database.session.query(Quote).delete()
    test_database.session.query(Author).delete()
    add_quote("Marilyn Monroe", "Imperfection is beauty.")
    add_quote(
        "Albert Einstein",
        "The world as we have created it is a process of our thinking.",
    )
    add_quote("Steve Martin", "A day without sunshine is like, you know, night.")
    add_quote(
        "Jane Austen",
        "The person, be it gentleman or lady, who has not pleasure in a good novel, must be intolerably stupid.",
    )
    add_quote(
        "J.K. Rowling",
        "It is our choices, Harry, that show what we truly are, far more than our abilities.",
    )
    client = test_app.test_client()
    resp = client.get("/quotes/random")
    data = json.loads(resp.data)
    assert resp.status_code == 200

    # 5 quotes inserted above
    # make sure only 3 returned
    assert len(data) == 3
