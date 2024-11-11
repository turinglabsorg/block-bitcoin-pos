#!/bin/bash

cd docker
if [[ "$@" =~ "-rebuild" ]]
then
    echo "Rebuilding Docker Image"
    docker build --no-cache -t db:mongo .
    docker run --restart=unless-stopped -d --name=mongodb -dit -p 27017:27017 db:mongo
else
    docker ps | grep 'mongodb' &> /dev/null
    if [ $? == 0 ]; then
        echo "Database docker exists yet, running istance."
        docker start mongodb
    else
        echo "Running MongoDB Docker container."
        systemctl enable docker
        echo 'DOCKER_OPTS="--iptables=false"' >> /etc/default/docker
        systemctl restart docker
        docker build -t db:mongo .
        docker run --restart=unless-stopped -d --name=mongodb -dit -p 27017:27017 db:mongo
    fi
fi
