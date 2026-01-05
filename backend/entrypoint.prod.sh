#!/bin/sh
set -e

echo "PROD: Aplicando migrations..."
python manage.py migrate

echo "PROD: Coletando staticfiles..."
python manage.py collectstatic --noinput

echo "PROD: Subindo gunicorn..."
gunicorn core.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers 2 \
  --threads 4 \
  --timeout 120
