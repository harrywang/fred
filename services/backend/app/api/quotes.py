# app/api/quotes.py
# APIs for quotes

from flask import request
from flask_restx import Resource, fields, Namespace
from app import db
from app.api.models import Author, Quote

import random

from app.api.utils import (
    add_quote,
)

quotes_namespace = Namespace("quotes")

# this model does not have to match the database
# doing this add description to Swagger Doc
quote = quotes_namespace.model(
    "Quote",
    {
        "id": fields.Integer(readOnly=True),
        "content": fields.String(required=True),
        "author_name": fields.String(required=True),
    },
)


class Quotes(Resource):

    @quotes_namespace.marshal_with(quote)
    def get(self):
        """Returns all quotes with author info"""
        quotes = Quote.query.all()
        quotes_list = []
        for q in quotes:
            # to_dict() is a helper function in Quote class in models.py
            quotes_list.append(q.to_dict())
        return quotes_list, 200


    @quotes_namespace.expect(quote, validate=True)
    @quotes_namespace.response(201, "quote was added!")
    @quotes_namespace.response(400, "Sorry, this quote already exists.")
    def post(self):
        """add a new quote"""
        post_data = request.get_json()
        content = post_data.get("content")
        author_name = post_data.get("author_name")
        response_object = {}

        quote = Quote.query.filter_by(content=content).first()
        if quote:
            response_object["message"] = "Sorry, this quote already exists."
            return response_object, 400

        add_quote(author_name, content)
        response_object["message"] = f"quote was added!"
        return response_object, 201

# we dont use marshal with - no information
class RandomQuotes(Resource):

    #@quotes_namespace.marshal_with(quote)
    def get(self):
        """Returns three random quotes with author info"""
        quotes = Quote.query.all()
        quotes_list = []
        for q in quotes:
            quotes_list.append(q.to_dict())

        # random choose three quotes
        randam_quotes = random.sample(quotes_list, k=3)
        return randam_quotes, 200


quotes_namespace.add_resource(Quotes, "")
quotes_namespace.add_resource(RandomQuotes, "/random")
