# Imagen base
FROM php:8.2-fpm

# Dependencias del sistema
RUN apt-get update && apt-get install -y \
    libpq-dev \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    nginx \
    supervisor \
    && docker-php-ext-install pdo pdo_pgsql zip gd mbstring xml

# Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/local/bin/composer

# Crear carpeta de trabajo
WORKDIR /var/www/html

# Copiar código
COPY . .

# Asegurar existencia de archivo .env
RUN cp .env.example .env

# Instalar dependencias de Laravel
RUN composer install --optimize-autoloader --no-dev

# Generar APP_KEY y enlaces de almacenamiento
RUN php artisan key:generate && php artisan storage:link

# Migrar y sembrar DB
RUN php artisan migrate --force && php artisan db:seed --force

# Configurar permisos
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Configurar Nginx
COPY ./nginx.conf /etc/nginx/nginx.conf

# Supervisord para manejar múltiples procesos
COPY ./supervisord.conf /etc/supervisord.conf

# Exponer el puerto
EXPOSE 80

# Iniciar supervisord para correr Nginx + PHP-FPM
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
