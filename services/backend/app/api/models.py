# app/api/models.py

import os
import datetime
import jwt

from flask import current_app
from sqlalchemy.sql import func
from app import db, bcrypt


class User(db.Model):

    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean(), default=True, nullable=False)
    created_date = db.Column(db.DateTime, default=func.now(), nullable=False)

    def __init__(self, username="", email="", password=""):
        self.username = username
        self.email = email
        self.password = bcrypt.generate_password_hash(
            password, current_app.config.get("BCRYPT_LOG_ROUNDS")
        ).decode()

    def encode_token(self, user_id, token_type):
        if token_type == "access":
            seconds = current_app.config.get("ACCESS_TOKEN_EXPIRATION")
        else:
            seconds = current_app.config.get("REFRESH_TOKEN_EXPIRATION")

        payload = {
            "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=seconds),
            "iat": datetime.datetime.utcnow(),
            "sub": user_id,
        }
        return jwt.encode(
            payload, current_app.config.get("SECRET_KEY"), algorithm="HS256"
        )

    @staticmethod
    def decode_token(token):
        payload = jwt.decode(token, current_app.config.get("SECRET_KEY"), algorithms="HS256")
        return payload["sub"]



class Quote(db.Model):
    __tablename__ = "quote"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column('content', db.Text())
    author_id = db.Column(db.Integer, db.ForeignKey('author.id'))  # Many quotes to one author

    def to_dict(self):
        data = {
            'id': self.id,
            'content': self.content,
            'author_name': self.author.name,
        }
        return data

class Author(db.Model):
    __tablename__ = "author"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column('name', db.String(50), unique=True)
    birthday = db.Column('birthday', db.DateTime)
    bornlocation = db.Column('bornlocation', db.String(150))
    bio = db.Column('bio', db.Text())
    quotes = db.relationship('Quote', backref='author')  # One author to many Quotes
