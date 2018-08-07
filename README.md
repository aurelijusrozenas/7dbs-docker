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

Mongo
=====

*WARNING (Windows & OS X) - see docker-compose.yml comment* 

```bash
docker-compose up mongo
```

`mongo/code` directory is mounted to `/code` in container. Use it to write and run scripts.

## Mongo express
```bash
docker-compose up mongo-express
```
http://localhost:8081/

## Cli
```bash
docker exec -it 7dbsdocker_mongo_1 /bin/bash
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

### Import wiktionary
```bash
docker exec -it 7dbsdocker_hbase-standalone_1 /bin/bash
curl https://dumps.wikimedia.org/enwiktionary/latest/enwiktionary-latest-pages-articles.xml.bz2 | bzcat | /opt/hbase-1.2.1/bin/hbase shell /code/import_from_wikipedia.rb
```

## Run Hbase cluster in aws

```bash
sudo apt install awscli

aws configure
#us-east-1

aws ec2 create-key-pair --key-name HBaseShell --query 'KeyMaterial' --output text > ~/.ssh/hbase-shell-key.pem

chmod 400 ~/.ssh/hbase-shell-key.pem

aws emr create-cluster \
--name "Seven DBs example cluster" \
--release-label emr-5.3.1 \
--ec2-attributes KeyName=HBaseShell \
--use-default-roles \
--instance-type m1.large \
--instance-count 3 \
--applications Name=HBase

# set variable
export CLUSTER_ID=

while true; do aws emr describe-cluster --cluster-id ${CLUSTER_ID} --query Cluster.Status.State; sleep 10; done

aws emr describe-cluster --cluster-id ${CLUSTER_ID} --query Cluster.Ec2InstanceAttributes.EmrManagedMasterSecurityGroup
# set variable
export SECURITY_GROUP_ID=

export MY_CIDR=$(dig +short myip.opendns.com @resolver1.opendns.com.)/32

aws ec2 authorize-security-group-ingress \
--group-id ${SECURITY_GROUP_ID} \
--protocol tcp \
--port 22 \
--cidr $MY_CIDR

aws emr ssh --cluster-id ${CLUSTER_ID} --key-pair-file ~/.ssh/hbase-shell-key.pem

# list
aws emr list-clusters

# terminate
aws emr terminate-clusters --cluster-ids ${CLUSTER_ID}
```
