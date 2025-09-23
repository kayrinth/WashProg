# FROM node:18-alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm install --include=dev

# COPY . .

# EXPOSE 5000

# CMD ["npx", "nodemon", "src/index.js"]


FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

# pastikan nodemon ada secara global (tidak tergantung devDependencies)
RUN npm install -g nodemon

COPY . .

EXPOSE 5000

CMD ["nodemon", "src/index.js"]
