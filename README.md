# README.md

##Steps to run this project:
1. create ``express-typescript.env``
2. create ``postgres.env``
3. 1st terminal: ``docker compose up --build``
4. 2nd terminal: ``npm run migration:run``

##To stop:

2nd terminal
``docker compose down``

##To generate migration
``npm run migration:generate -- -n <migration-name>``
