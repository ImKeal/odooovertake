# Odoo Overtake

Este repositorio incluye un pequeño ejemplo de aplicación de marcaciones de empleados implementada en React.

La aplicación permite registrar marcaciones incluso cuando no hay conexión a internet. Las marcaciones pendientes se guardan en `localStorage` y se envían automáticamente cuando la aplicación detecta que la red vuelve a estar disponible. Además, se incluye un *service worker* para que la aplicación pueda funcionar de forma offline.

## Ejecutar

1. Servir los archivos de la carpeta `public` desde un servidor web estático. Por ejemplo:
   ```bash
   npx serve public
   ```
2. Abrir `http://localhost:3000` (u otro puerto según la herramienta utilizada).
3. Registrar marcaciones desde el botón **Registrar Marcación**.
4. Si se realiza una marcación sin conexión, esta se enviará automáticamente al restaurar la conectividad.

El punto de red al que se envían las marcaciones es `/api/clock`, que deberá implementarse en un servidor para recibir los datos.
