#!/bin/sh
set -e

echo "DEV: Aplicando migrations..."
python manage.py migrate

echo "DEV: Subindo Django runserver..."
python manage.py runserver 0.0.0.0:8000
