
  # Página web LujoShop

  This is a code bundle for Página web LujoShop. The original project is available at https://www.figma.com/design/GCWJU5zqJ3YHF5t505Tc34/P%C3%A1gina-web-LujoShop.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
## Publicar en GitHub Pages

La compilación usa `/LSLUJOSHOP.COM/` como ruta base. En desarrollo local se usa `/`.

1. En GitHub, abre Settings → Pages y selecciona GitHub Actions como Source.
2. Sube los cambios a la rama `main`. El flujo `.github/workflows/deploy.yml` compila y publica `dist`.
3. Al terminar el flujo, la web estará en https://papitasl.github.io/LSLUJOSHOP.COM/.

Para publicar después bajo un dominio propio, cambia `VITE_BASE_PATH` a `/` y `VITE_SITE_URL` a la URL del dominio en el flujo de publicación. Configura también el dominio en el proveedor de hosting.

`npm run build` genera páginas individuales para los productos y una página `404.html` que permite abrir rutas de la aplicación.
