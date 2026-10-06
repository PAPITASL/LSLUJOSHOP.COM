import { classifyProductCategory } from "./product-categories.mjs";
import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, renameSync } from 'node:fs';
import { join, parse } from 'node:path';
import { createHash } from 'node:crypto';
const root = process.cwd();
const imagesDir = join(root, 'public/catalogo-editado');
const dataDir = join(root, 'src/data');
const staged = [];
const sourceNames = JSON.parse(readFileSync(join(root, 'scripts/catalog-image-names.json'), 'utf8'));

const ids = new Set();
let total = 0;
for (const folder of readdirSync(imagesDir, { withFileTypes: true }).filter(e => e.isDirectory()).sort((a,b) => a.name.localeCompare(b.name))) {
  const products = [];
  for (const filename of readdirSync(join(imagesDir, folder.name)).filter(f => /\.(png|jpe?g|webp)$/i.test(f)).sort()) {
    const originalName = sourceNames[filename] ?? filename;
    const match = parse(originalName).name.match(/^(CHEVROLET_CK_SILVERADO_CHEYENNE|FORD_150_BRONCO|FORD_F150_LOBO)_(\d{4})[-_](\d{4})_(.+)$/);
    if (!match) throw new Error(`Nombre sin información suficiente: ${filename}`);
    const [, vehicle, start, end, rawName] = match;
    const sourceId = rawName.match(/_ID_(\d+)$/)?.[1];
    const nombre = rawName.replace(/_ID_\d+$/, '').replace(/_+/g, ' ').trim();
    const marca = vehicle.startsWith('CHEVROLET') ? 'CHEVROLET' : 'FORD';
    const modelo = marca === 'CHEVROLET' ? 'C/K Silverado / Cheyenne' : vehicle === 'FORD_150_BRONCO' ? 'F-150 / Bronco' : 'F-150 / Lobo';
    const anio = `${start}-${end}`;
    const categoria = classifyProductCategory(nombre);
    const key = `${folder.name}/${filename}`;
    const id = 100000 + (parseInt(createHash('sha256').update(`IMAGENES_CATALOGO_${folder.name.replace(/^IMAGENES_CATALOGO_/, '').replaceAll('-', '_').toUpperCase()}/${originalName}`).digest('hex').slice(0, 8),16) % 2000000000);
    if (ids.has(id)) throw new Error(`ID duplicado: ${key}`);
    ids.add(id);
    products.push({ id, marca, modelo, anio, referencia: sourceId ? `${vehicle}-${anio}-ID-${sourceId}` : `${vehicle}-${anio}-${id}`, categoria, nombre, img: `/catalogo-editado/${key}`, desc: `${nombre} para ${marca} ${modelo}, años ${anio}. Consulta precio y compatibilidad.`, estado: 'Por pedido' });
    total++;
  }
  const filename = `catalogo_${folder.name.replace(/^IMAGENES_CATALOGO_/, '').replaceAll('-', '_').toLowerCase()}.json`;
  staged.push({filename, products});
}
if (!total) throw new Error('No se encontraron imágenes');
const backupDir = join(root, 'backups', `fichas-antes-importacion-${Date.now()}`);
mkdirSync(backupDir, {recursive:true});
for (const file of readdirSync(dataDir).filter(f => /^catalogo.*\.json$/.test(f))) renameSync(join(dataDir,file), join(backupDir,file));
for (const { filename, products } of staged) writeFileSync(join(dataDir,filename), JSON.stringify(products,null,2)+'\n');
console.log(JSON.stringify({total, catalogs:staged.map(s=>({file:s.filename, products:s.products.length})),backupDir},null,2));
