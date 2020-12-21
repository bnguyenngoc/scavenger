FROM mongo:4.4.2-bionic

RUN apt-get update && apt-get -y install netcat-openbsd tzdata \
    && ln -fs /usr/share/zoneinfo/Canada/Eastern /etc/localtime \
    && echo "Canada/Eastern" > /etc/timezone \
    && apt-get clean