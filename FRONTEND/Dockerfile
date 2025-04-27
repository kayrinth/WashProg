FROM node:18-alpine

#membuat directory untuk docker
WORKDIR /app

#mengcopy dependensi
COPY package*.json ./

#menginstall dependensi
RUN npm install

#mengcopy semua file
COPY . .

# EXPOSE 3001

#menjalankan aplikasi
CMD ["npm", "run", "dev"]
