#!/bin/sh
docker exec -it phabricator-php /srv/phabricator/bin/config "$@"
