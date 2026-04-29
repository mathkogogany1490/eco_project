#!/bin/sh

echo "Running makemigrations..."
python manage.py makemigrations eco_app || true

echo "Running migrations..."
python manage.py migrate

echo "Running seed..."
python manage.py seed || true

echo "Collect static..."
python manage.py collectstatic --noinput

echo "Starting server..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000