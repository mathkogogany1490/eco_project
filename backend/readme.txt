python -m pip install -r requirements.txt

docker compose up -d

python manage.py runserver
python manage.py runserver_plus --cert-file localhost+2.pem --key-file localhost+2-key.pem



python manage.py makemigrations
python manage.py migrate
python manage.py showmigrations

python manage.py dbshell
python manage.py seed

python manage.py collectstatic

python manage.py createsuperuser

python manage.py startapp eco_app
