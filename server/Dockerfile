FROM alpine:latest
RUN addgroup --system bunda
RUN adduser --system node --ingroup bunda
RUN apk add --no-cache bash

USER node:bunda

WORKDIR /home/node/backend

RUN npm install && npx prisma migrate dev --name init && npm run dev