#!/bin/sh
php bin/console doctrine:migration:diff
php bin/console doctrine:migration:migrate
echo "DB is updated"
