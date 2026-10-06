import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const base=readFileSync('dist/index.html','utf8').match(/src="([^"]*)assets\//)?.[1];
if(!base || !base.startsWith('/')) throw new Error('No se detectó la ruta base');
function walk(dir) { return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]); }
const pages=walk('dist').filter(p=>p.endsWith('.html'));
const errors=[];
let checked=0;
for(const file of pages) {
 const html=readFileSync(file,'utf8');
 for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const url=match[1].replaceAll('&amp;','&');
  if(!url.startsWith('/') || url.startsWith('//')) continue;
  if(!url.startsWith(base)) { errors.push(`${file}: URL fuera de la base: ${url}`); continue; }
  const relative=decodeURIComponent(url.slice(base.length).split(/[?#]/)[0]);
  const target=join('dist',relative);
  if(!existsSync(target) && !existsSync(join(target,'index.html'))) errors.push(`${file}: destino inexistente: ${url}`);
  checked++;
 }
}
if(!existsSync('dist/404.html') || !existsSync('dist/.nojekyll')) errors.push('Falta 404.html o .nojekyll');
if(errors.length) throw new Error(errors.slice(0,15).join('\n'));
console.log(`${pages.length} páginas y ${checked} referencias locales verificadas para GitHub Pages.`);
