# Imagen base con Node
FROM node:20

# Directorio de trabajo dentro del contenedor
WORKDIR /home/app

# Copiamos package.json y package-lock.json primero (para aprovechar cache)
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto de Next.js
EXPOSE 3000

# Comando por defecto (modo desarrollo)
CMD ["npm", "run", "dev"]
