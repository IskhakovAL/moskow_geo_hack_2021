FROM python:3.8.6-buster

WORKDIR /usr/src/msk_app

COPY . /usr/src/msk_app/

RUN pip install -r ./requirements.txt

CMD ["uwsgi", "app.ini"]