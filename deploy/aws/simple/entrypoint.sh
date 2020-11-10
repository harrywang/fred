gunicorn -b 0.0.0.0:5000 manage:app --daemon &
nginx -g "daemon off;"