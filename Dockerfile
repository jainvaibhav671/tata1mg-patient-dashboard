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

# RUN npm install

EXPOSE 3005
EXPOSE 3006

# CMD ["ls"]
CMD ["npm", "run", "serve"]
