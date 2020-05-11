Creación de un microservicio para calcular costos de pólizas de empleados utilizando la libreria serverless con NodeJS.

## Requisitos:

- Node: >12.16.3
- Yarn

## Instalar dependencias

Agregar en el archivo serverless.yml en la linea 14 el api key de Sbif, el mismo se debe crear desde el siguiente formulario:

https://api.sbif.cl/uso-de-api-key.html

Debe ejecutar en la terminal, estando situado en la raiz del proyecto el siguiente comando:

```
yarn
```

Para probar el servicios desde la consola ejecutamos el siguiente comando:

```
serverless invoke local --function=getTotalPolicy
```


