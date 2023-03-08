# #FROM node:12 as builder
# FROM node:14.18.1-alpine3.14 as builder

# RUN mkdir /app
# WORKDIR /app
# COPY . .
# RUN npm install 
# RUN npm run build
# FROM nginx:1.15.12-alpine
# RUN apk add --no-cache --update bash curl && \
#     rm -rf /var/cache/apk/*
# COPY  --from=builder /app/build /usr/share/nginx/html
# ADD vhost.conf /etc/nginx/conf.d/default.conf
# EXPOSE 3001

FROM node:14 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# RUN cp .env.docker .env
RUN npm run build

FROM node:14-slim
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000

CMD ["npm", "run", "start:prod"]