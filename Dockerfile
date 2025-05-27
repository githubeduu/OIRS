# Etapa de construcción
FROM node:18-alpine AS build

WORKDIR /app

# Copiar package.json y package-lock.json para evitar reinstalar dependencias si no es necesario
COPY package*.json ./

# Usar opciones para mejorar la confiabilidad de la instalación
RUN npm install --legacy-peer-deps --prefer-offline --no-audit --loglevel=warn --unsafe-perm --cache /tmp/empty-cache

# Copiar el resto de la aplicación
COPY . .

# Ejecutar el build de Angular
RUN npm run build --prod

# Etapa de producción
FROM nginx:alpine

# Copiar los archivos de build al contenedor de nginx
COPY --from=build /app/dist/arkham-hospial/browser /usr/share/nginx/html

# Exponer el puerto 80 para el contenedor
EXPOSE 80

# Ejecutar nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
