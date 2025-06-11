up: 
	@docker compose up -d
	@docker compose logs node | grep -m2 "➜"

down: 
	docker compose down

build:
	clear
	npm run build
