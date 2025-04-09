#! /bin/bash

python manage.py makemigrations
python manage.py migrate
gunicorn --bind 0.0.0.0:8000 --timeout 90 --log-level info server.wsgi