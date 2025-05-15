# Utilizar una imagen oficial de PHP con FPM
FROM php:8.2-fpm

# Instalar extensiones necesarias para Laravel y PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    nginx \
    && docker-php-ext-install pdo pdo_pgsql zip gd mbstring xml

# Instalar Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/local/bin/composer

# Establecer el directorio de trabajo
WORKDIR /var/www/html

# Copiar los archivos de la aplicación
COPY . .

# Instalar dependencias de Composer
RUN composer install --optimize-autoloader --no-dev

# Copiar archivo de configuración de Nginx
COPY ./nginx.conf /etc/nginx/nginx.conf

# Configurar permisos
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage

# Generar la clave de la aplicación
RUN php artisan key:generate
RUN php artisan storage:link

# Exponer el puerto 80 para Nginx
EXPOSE 80

# Iniciar Nginx y PHP-FPM
CMD ["bash", "-c", "php-fpm -D && nginx -g 'daemon off;'"]
