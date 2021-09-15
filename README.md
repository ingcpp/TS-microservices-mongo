# Microservices en Netlify

Para implementar microservicios usando Netlify haremos uso de [Netlify functions](https://www.netlify.com/products/functions/).

# Laboratorio

### Funciones como microservicios

- Crea una cuenta en [https://github.com/](GitHub) si aún no la tienes
- Crea un repositorio en tu cuenta de GitHub
- Crea una cuenta en [https://www.netlify.com/](Netlify)
- Conecta tu repositorio de GitHub con Netlify, dentro de netlify haz click al boton de `New site from Git`
- Sigue las instrucciones en Netlify para conectar tu repositorio y tu branch principal, normalmente el nombre del branch será `main`. Asegurate que Netlify tiene acceso a tu repositorio configurando la [https://github.com/apps/netlify/installations/new](aplicación de Netlify en GitHub)
- En este laboratorio no desplegaremos ninguna aplicación de front end, por lo que puedes dejar las opciones de Build vacias y desplegar tu sitio
- Instala `yarn` si aún no lo tienes instalado
- Inicializa las dependencias usando el comando `yarn init`
- Crea un archivo `.gitignore` con el siguiente contenido para excluir las dependencias del repositorio

```
node_modules
```

- Instala las dependencias para usar las funciones de Netlify `yarn add @netlify/functions`
- Instala las dependencias para usar TypeScript `yarn add -D typescript`
- Inicializa la configuracion del compilador de TypeScript, `yarn tsc --init`
- En el archivo `tsconfig.json` que se generó en el comando anterior revisa que las siguientes opciones estén habilitadas

```json
...
"esModuleInterop": true,
"isolatedModules": true,
...
```

- Crea una carpeta llamada `functions` en la raiz de tu repositorio
- Crea el archivo `netlify.toml` en la raiz de tu repositorio para informarle a Netlify acerca de tus funciones, crea el archivo con el siguiente contenido:

```toml
[functions]
  directory = "functions"
```

- Añade al archivo de configuración de netlify `netlify.toml` el enrutamiento para tu API, esto permitira que tus funciones puedan ser accedidas usando la url `/api/dogos`

```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

- Dentro de la carpeta crea un archivo llamado `dogos.ts`, usaremos este archivo para devolver imagenes de perros aleatoriamente conectandonos con otro API externo
- Crea la función que procesará los requests HTTP tus usuarios dentro del archivo `dogos.ts`

```typescript
import { Handler } from "@netlify/functions";

const handler: Handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello Dogo World" }),
  };
};

export { handler };
```

- Instala la libreria netlify-cli `yarn add -D netlify-cli`, esto nos permitirá probar las funciones localmente antes de desplegarlas
- Autoriza la consola de Netlify usando el comando `yarn netlify login`
- Vincula tu repositorio local con Netlify usando el comando `yarn netlify link`, revisa el nombre de tu aplicación en Netlify
- Corre el comando `yarn netlify dev` para probar tu función localmente
- En tu navegador se abrirá una ventana con la URL local para pruebas, adiciona a esta URL `/api/dogos` para verificar que tu funcion responde correctamente
- Usando la libreria `node-fetch` haremos un request a una libreria externa que retornará imagenes aleatorias de perros
- Instala la libreria usando el comando `yarn add node-fetch`
- Ajusta el código para llamar al API externo y retornar las primeras 10 urls de las imagenes

```typescript
import { Handler } from "@netlify/functions";
import fetch from "node-fetch";

const handler: Handler = async (event, context) => {
  const response = await fetch("https://random.dog/doggos");
  const data = await response.json();

  if (Array.isArray(data)) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        dogs: {
          images: data.slice(0, 10).map((url) => `https://random.dog/${url}`),
        },
      }),
    };
  } else {
    return {
      statusCode: 404,
    };
  }
};

export { handler };
```

- Prueba de nuevo tu API para que tenga el formato correcto, cada vez que guardes el archivo el API local se actualizará
- Haz commit de tus cambios y haz push para que comience el proceso de despliegue en Netlify
- Verifica en la consola que el proceso de despliegue se completa y usa la URL que te da Netlify para verificar tu API publicamente
