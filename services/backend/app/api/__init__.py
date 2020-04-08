# app/api/__init__.py


from flask_restx import Api

from app.api.auth import auth_namespace
from app.api.ping import ping_namespace
from app.api.users import users_namespace
from app.api.quotes import quotes_namespace

api = Api(version="1.0", title="Backend APIs", doc="/docs/")

api.add_namespace(ping_namespace, path="/ping")
api.add_namespace(auth_namespace, path="/auth")
api.add_namespace(users_namespace, path="/users")
api.add_namespace(quotes_namespace, path="/quotes")
