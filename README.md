# Microservicios de Gestión de Productos

Este proyecto consiste en dos microservicios para gestionar productos con SKUs basados en países: un backend en Laravel (PHP) y un API Gateway en Node.js.

## Requisitos Previos

### Para el microservicio Laravel:
- PHP 8.0 o superior
- Composer
- MySQL 5.7+ o MariaDB 10.3+
- Extensión PHP para MySQL (pdo_mysql)
- Servidor web (Apache/Nginx) o PHP built-in server

### Para el microservicio Node.js:
- Node.js 14.x o superior
- npm 6.x o superior
- MySQL 5.7+ o MariaDB 10.3+

## Configuración Inicial

1. Clonar el repositorio:
```bash
git clone https://github.com/Edgar120008/Prueba_Tecnica_Microservices.git
cd Prueba_Tecnica_Microservices
```

## Configuración del Microservicio Laravel

1. Entrar al directorio de Laravel:
```bash
cd laravel-microservicios
```

2. Instalar dependencias:
```bash
composer install
```

3. Configurar entorno:
```bash
cp .env.example .env
```

4. Generar clave de aplicación:
```bash
php artisan key:generate
```

5. Configurar base de datos en `.env`:
```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=countries_db
DB_USERNAME=root
DB_PASSWORD=tu_contraseña
```

6. Ejecutar migraciones y seeders:
```bash
php artisan migrate --seed
```

7. Iniciar servidor:
```bash
php artisan serve --port=8000
```

El servicio estará disponible en: http://localhost:8000

## Configuración del Microservicio Node.js

1. Desde la raíz del proyecto, entrar al directorio de Node:
```bash
cd node-microservicios
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar entorno:
```bash
cp .env.example .env
```

4. Editar el archivo `.env` para configurar la conexión a la API Laravel:
```ini
LARAVEL_API_URL=http://localhost:8000/api
PORT=3000
NODE_ENV=development
```

5. Iniciar servidor:
```bash
npm start
```

El servicio estará disponible en: http://localhost:3000

## Estructura de la Base de Datos

La base de datos se crea automáticamente con las migraciones de Laravel. Si necesitas crearla manualmente:

```sql
CREATE DATABASE countries_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Documentación de la API

### Laravel API Docs:
Accede a la documentación Swagger en:  
http://localhost:8000/api/documentation

Para generar la documentación:
```bash
php artisan l5-swagger:generate
```

### Node.js API Docs:
La documentación Swagger está disponible en:  
http://localhost:3000/api-docs

## Endpoints Disponibles

### Laravel API (http://localhost:8000/api)
```
GET    /products               - Listar todos los productos
POST   /products               - Crear nuevo producto
GET    /products/{id}          - Obtener producto específico
PUT    /products/{id}          - Actualizar producto
DELETE /products/{id}          - Borrado lógico
PATCH  /products/{id}/restore  - Restaurar producto eliminado
```

### Node.js API Gateway (http://localhost:3000/api)
```
GET    /products               - Listar productos procesados
POST   /products               - Crear producto
GET    /products/{id}          - Obtener producto procesado
PUT    /products/{id}          - Actualizar producto
DELETE /products/{id}          - Borrado lógico
PATCH  /products/{id}/restore  - Restaurar producto
```

## Estructura del SKU

Los productos generan automáticamente un SKU con formato:  
`CT-{CODIGO_PAIS}-{ID}`  
Ejemplo: `CT-MX-1` para un producto de México con ID 1

## Solución de Problemas

Si encuentras errores:
1. Verifica que MySQL esté corriendo
2. Revisa las credenciales en los archivos `.env`
3. Asegúrate de que los puertos 8000 (Laravel) y 3000 (Node) estén disponibles
4. Para problemas de migración, ejecuta:
```bash
php artisan migrate:fresh --seed
```
