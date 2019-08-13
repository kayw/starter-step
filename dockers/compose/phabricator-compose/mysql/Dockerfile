FROM alpine:edge

LABEL maintainer="PlusMang <docker-maintain@plusmang.com>"
##
# Mysql 5.7+
##

RUN sed -i "s/dl-cdn.alpinelinux.org/mirrors.aliyun.com/" /etc/apk/repositories
# add our user and group first to make sure their IDs get assigned consistently, regardless of whatever dependencies get added
RUN addgroup -S mysql && adduser -S -g mysql mysql

# mariadb-server-utils  mysql_upgrade
RUN apk --update add mariadb mariadb-client && \
    rm -rf /var/cache/apk/*
	
#RUN mkdir /docker-entrypoint-initdb.d \
#    && mkdir /var/lib/mysql \
#	&& mkdir /run/mysqld

ADD run.sh /scripts/run.sh
RUN mkdir /scripts/pre-exec.d && \
    mkdir /scripts/pre-init.d && \
    chmod -R 755 /scripts
COPY custom.cnf              /etc/mysql/my.cnf
COPY stopwords.txt           /stopwords.txt
#COPY docker-entrypoint.sh    /

# comment out a few problematic configuration values
RUN chmod 644 /etc/mysql/my.cnf \
    && sed -Ei 's/^(bind-address|log)/#&/' /etc/mysql/my.cnf
RUN sed -Ei 's/^(skip-networking)/#&/' /etc/my.cnf.d/mariadb-server.cnf
# https://mariadb.com/kb/en/library/configuring-mariadb-for-remote-client-access/  mysql -h mysql -uroot -p 2002 error

VOLUME /var/lib/mysql

EXPOSE 3306

ENTRYPOINT ["/scripts/run.sh"]
