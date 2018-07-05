7dbs
====

Prerequisites
-------------
- Docker.
- Docker compose.

Setup
-----
```bash
git clone git@github.com:aurelijusrozenas/7dbs-docker.git
cd 7dbs-docker/
```

Hbase
=====

## Start standalone server
```bash
docker-compose up hbase-standalone
```

### Connect to interactive shell
```bash
docker exec -it 7dbsdocker_hbase-standalone_1 /opt/hbase-1.2.1/bin/hbase shell
```