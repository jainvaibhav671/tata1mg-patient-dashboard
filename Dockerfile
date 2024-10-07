FROM node:20-alpine as builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

# FROM node:20-alpine

# WORKDIR /app

# COPY --from=builder /app/build ./build
# COPY --from=builder /app/package.json /app/package-lock.json ./
# COPY ./config ./config

# Update the package index and install ca-certificates
RUN apk update && apk add --no-cache ca-certificates

# Optional: Ensure the certificates are updated
RUN update-ca-certificates

EXPOSE 3005
EXPOSE 3006

ENV NODE_ENV=production
ENV DEV_SERVER_HOSTNAME=0.0.0.0
ENV APPLICATION_PORT=3005
# CMD ["ls"]
CMD ["npm", "run", "start"]
