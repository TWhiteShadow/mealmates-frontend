up: 
	docker compose up -d
	docker compose exec node npm i

down: 
	docker compose down

build:
	clear
	npm run build
