# app/api/utils.py

# utility helper functions

from app import db
from app.api.models import User


def get_all_users():
    return User.query.all()


def get_user_by_id(user_id):
    print(user_id)
    t = User.query.filter_by(id=user_id).first()
    return t


def get_user_by_email(email):
    return User.query.filter_by(email=email).first()


def add_user(username, email, password):
    user = User(username=username, email=email, password=password)
    db.session.add(user)
    db.session.commit()
    return user


def update_user(user, username, email):
    user.username = username
    user.email = email
    db.session.commit()
    return user


def delete_user(user):
    db.session.delete(user)
    db.session.commit()
    return user
