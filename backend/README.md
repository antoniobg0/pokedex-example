# Pokedex backend
Backend of pokedex

##### Requirements:
* node 20
* Docker
* Docker compose

####  Steps
1) copy and paste .env.example as .env at root (not changes required)
2) docker-compose up -d --build
3) npm run migrate
4) npm run generate
5) npm run seed (save the access uuid shown in terminal as it is required in frontend setup)