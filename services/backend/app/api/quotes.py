# app/api/quotes.py
# APIs for quotes

from flask import request
from flask_restx import Resource, fields, Namespace
from app import db
from app.api.models import Author, Quote

import random

quotes_namespace = Namespace("quotes")

# this model does not have to match the database
# I defined a to_dict function in Quote class in models.py
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
            quotes_list.append(q.to_dict())
        return quotes_list, 200


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
