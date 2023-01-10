# Como crear un endpoint paso a paso.


## Crear el modelo
- Crear un modelo en ```./src/models/nombre_modelo_model.js```
- Nota: Cree si es un modelo unico, cree una carpeta para ese modelo.
- Luego de crear el modelo debe exportarlo en ```./src/models/models.js```

## Sincronizar el modelo.
- Para que nuestro modelo funcione hay que sincronizarlo con la base de datos en ```./src/config/models_sync.js```
- Y los exportamos ya sincronizados para usarlos en nuestros controladores.
  
## Crear el controlador.
- El controlador se encargara de hacer los llamos al api, y diferentes funcionalidades.
