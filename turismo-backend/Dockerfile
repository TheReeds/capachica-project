# Utilizar una imagen oficial de PHP con Apache
FROM php:8.2-apache

# Instalar extensiones necesarias para Laravel y PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install pdo pdo_pgsql zip gd mbstring xml

# Instalar Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/local/bin/composer

# Establecer el directorio de trabajo
WORKDIR /var/www/html

# Copiar los archivos de la aplicación
COPY . .

# Instalar las dependencias
RUN composer install --optimize-autoloader --no-dev

# Configuración de permisos para almacenamiento y caché
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Exponer el puerto 80 para Apache
EXPOSE 80

# Generar la clave de la aplicación
RUN php artisan key:generate

# Comando de inicio
CMD ["apache2-foreground"]
