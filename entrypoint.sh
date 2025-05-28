envsubst '$PORT' < /etc/nginx/templates/default.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'