import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
const products=fs.readdirSync('src/data').filter(f=>/^catalogo.*\.json$/.test(f)).flatMap(f=>JSON.parse(fs.readFileSync(path.join('src/data',f),'utf8')));
const images=[];
for(const dir of fs.readdirSync('public/catalogo-editado')) for(const file of fs.readdirSync(path.join('public/catalogo-editado',dir))) if(/\.(png|jpe?g|webp)$/i.test(file)) images.push(`/catalogo-editado/${dir}/${file}`);
if(products.length!==images.length || new Set(products.map(p=>p.id)).size!==products.length || new Set(products.map(p=>p.img)).size!==images.length) throw new Error('Cantidad o IDs/rutas duplicadas');
const failures=[];
for(const p of products) {
 if(!images.includes(p.img) || !p.nombre || !p.marca || !p.modelo || !/^\d{4}-\d{4}$/.test(p.anio)) failures.push(p.id);
 const meta=await sharp(path.join('public',p.img.slice(1))).metadata();
 if(!meta.width || !meta.height) failures.push(p.id);
}
if(failures.length) throw new Error(JSON.stringify(failures));
console.log(`${products.length} productos: IDs únicos, rutas válidas, imágenes legibles y datos completos.`);
