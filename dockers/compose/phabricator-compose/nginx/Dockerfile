FROM alpine:edge

LABEL maintainer="PlusMang <docker-maintain@plusmang.com>"

RUN apk --update add nginx \
    && rm -rf /var/cache/apk/*

RUN chown -R nginx:www-data /var/lib/nginx

COPY nginx.conf  /etc/nginx/nginx.conf

#Volume for website files
VOLUME ["/etc/nginx/", "/var/wwwroot/default"]

#Set port
EXPOSE 80
EXPOSE 443

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]
