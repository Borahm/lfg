dropdb lfg_app;
createdb lfg_app;
python manage.py makemigrations;
python manage.py migrate;
python manage.py loaddata jwt_auth/seeds.json;
python manage.py loaddata projects/seeds.json;
python manage.py loaddata posts/seeds.json;
python manage.py runserver;
