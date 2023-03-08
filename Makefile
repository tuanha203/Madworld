ifndef u
u:=sotatek
endif

deploy:
	rsync -avhzL --delete \
				--no-perms --no-owner --no-group \
				--exclude .idea \
				--exclude .git \
				--exclude .next \
				--exclude node_modules \
				--exclude .husky \
				--exclude .env \
				--exclude .env.local \
				--exclude .env.docker \
				--exclude .env.rinkerby \
				--exclude .env.ropsten \
				--exclude .env.staging \
				. $(u)@$(h):$(dir)
	ssh $(u)@$(h) "cd $(dir); cp .env.local.server .env && docker-compose up -d --build"
	# ssh $(u)@$(h) "cd $(dir); yarn install --ignore-engines"
	# ssh $(u)@$(h) "cd $(dir); yarn build"
	# ssh $(u)@$(h) "pm2 restart madworld-marketplace-fe"

deploy-dev: 
	make deploy h=172.16.1.225 dir=/home/sotatek/madworld-market/frontend

deploy-phase2:
	make deploy h=172.16.1.213 dir=/home/sotatek/madworld-market/frontend

deploy-docker-config:
	make deploy h=172.16.1.213 dir=/home/sotatek/Madworld/madworld_nftmarketplace_fe

#deploy-production:
#	rsync -avhzL --delete \
#				--no-perms --no-owner --no-group \
#				--exclude .git \
#				--exclude .env \
#				--exclude dist \
#				--exclude node_modules \
#				--filter=":- .gitignore" \
#				. ubuntu@ec2-3-1-7-62.ap-southeast-1.compute.amazonaws.com:/home/ubuntu/loyalty-platform/backend/workers
