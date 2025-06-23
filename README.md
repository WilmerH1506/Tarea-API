# Tarea - API Diseño Digital 1500

**Nombre:** Wilmer Hernandez  
**Cuenta:** 20222001369  
---

## 📦 Instalación

Para instalar las dependencias necesarias del proyecto, simplemente ejecuta el siguiente comando en la raíz del proyecto:

```console
npm install
```
Esto habrá instalado todas las dependencias necesarias para la compilación correcta del servidor.

## ⚙️ Ejecución
Para iniciar el servidor, se debe ejecutar el siguiente comando en la raíz del proyecto:

```console
npm run dev
```

## 🪧 Rutas Disponibles

| Método | Endpoint           | Descripción                               |
|--------|--------------------|------------------------------------------|
| GET    | /productos           | Retorna un listado con todos los productos.       |
| GET    | /productos/:id      | Retorna la información del producto con el ID especificado. |
| GET    | /productos/disponibles     | Retorna todos aquellos productos con estado Disponible |
| POST   | /productos         | Permite agregar un nuevo producto.                |
| PUT    | /productos/:id     | Permite modificar los datos de un producto existente. |
| DELETE | /productos/:id     | Elimina un producto en base a su ID            |


