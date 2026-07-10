## EchildrenZone
## Description

It's a backend project for children's social media only. Our project implements the most common actions that exist in public social media, like cloud uploading files, video processing, feeds, and more advanced features.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Run Redis Container 

```bash
# open docker and run on CMD
$ docker run -p 6379:6379 -p 8001:8001 -v //d/local-data:/data redis/redis-stack:latest

```

## Run Minio Container 

```bash
# open docker and run on CMD
$ docker run --name minio-server -p 9000:9000 -p 9001:9001 -v minio_data:/data -e MINIO_ACCESS_KEY=minio -e MINIO_SECRET_KEY=minio123 minio/minio server /data --console-address ":9001"

```