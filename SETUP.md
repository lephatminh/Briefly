# **Briefly - Setup Guide**

This is a guide to setup Briefly Development environment.

## Installation

0. Clone the repository
```bash
$ git clone https://github.com/Shibainu13/Briefly.git
```

1. Run Docker, then enter the following commands into terminal. This step is only required for the first time setting up. For the next entries, we only need to run the server from Docker GUI:
```bash
$ docker network create elastic
$ docker pull docker.elastic.co/elasticsearch/elasticsearch:8.16.1
$ docker run -d --name elasticsearch \
  --net elastic \
  -p 9200:9200 -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  docker.elastic.co/elasticsearch/elasticsearch:8.16.1
```
Alternatively, **Elasticsearch** offers a variety of installing methods, you can go for any of these as long as the endpoints for Elasticsearch is at **http://localhost:9200**.

2. Install the necessary dependencies
```bash
$ python3 -m venv venv
$ pip install -r requirements.txt
```

3. Setup backend
```bash
$ cd backend
$ python manage.py makemigrations
$ python manage.py migrate
$ python manage.py search_index --rebuild
$ python manage.py runserver
```

4. Setup frontend:
  Open another terminal and input the following:
```bash
$ cd frontend
$ npm install
$ npm run dev
```

