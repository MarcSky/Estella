#!/bin/sh
if [ "$1" != "" ]; then
    php bin/console lgck:oauth-server:client:create --redirect-uri="http://$1/" --grant-type="authorization_code" --grant-type="password" --grant-type="refresh_token" --grant-type="token" --grant-type="client_credentials"
    echo "all good"
else
    echo "bad argument bro"
fi