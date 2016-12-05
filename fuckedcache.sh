#!/bin/sh

rm -rf var/cache var/logs var/sessions var/DoctrineMigrations app/DoctrineMigrations
mkdir var/cache var/logs var/sessions var/DoctrineMigrations app/DoctrineMigrations
chmod -R 777 var app/DoctrineMigrations

echo "Finally a new cache and log"
