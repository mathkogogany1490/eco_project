python -m pip install -r requirements.txt


docker compose down
docker compose up -d --build


docker exec -it eco_backend python manage.py makemigrations
docker exec -it eco_backend python manage.py migrate
docker exec -it eco_backend python manage.py seed
docker exec -it eco_backend python manage.py fetch_mail

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
