# 1. Usar una imagen oficial de Node.js como base (versión liviana tipo Alpine)
FROM node:20-alpine

# 2. Crear y definir el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar los archivos de dependencias del proyecto
COPY package*.json ./

# 4. Instalar solo las dependencias necesarias para producción
RUN npm install --only=production

# 5. Copiar el resto del código del backend al contenedor
COPY . .

# 6. Indicar el puerto en el que escucha nuestro servidor Express
EXPOSE 3000

# 7. Comando para arrancar el servidor cuando el contenedor se inicie
CMD ["node", "server.js"]
