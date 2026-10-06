import assert from 'node:assert/strict';
import fs from 'node:fs';
import { CATEGORIES, classifyProductCategory } from './product-categories.mjs';
assert.equal(CATEGORIES.length,12);
for(const [name,category] of [
 ['ALERON SPOILER CON STOP','CARROCERÍA'],
 ['EXPLORADORAS DE BUMPER','EXPLORADORAS'],
 ['APOYABRAZOS DE PUERTA','INTERIOR'],
 ['SISTEMA SALIDA DE EXOSTO','ESCAPE'],
 ['INTERRUPTOR ELEVAVIDRIOS','ELÉCTRICO'],
 ['KIT MANIJAS INTERIORES','INTERIOR'],
 ['STOPS LED AHUMADOS','STOPS'],
 ['PERSIANA CROMADA','PERSIANAS / PARRILLAS'],
]) assert.equal(classifyProductCategory(name),category);
const counts={};
for(const file of fs.readdirSync('src/data').filter(f=>/^catalogo.*\.json$/.test(f))) for(const p of JSON.parse(fs.readFileSync('src/data/'+file,'utf8'))) {
 assert(CATEGORIES.includes(p.categoria));
 assert.equal(p.categoria,classifyProductCategory(p.nombre));
 counts[p.categoria]=(counts[p.categoria]??0)+1;
}
assert.equal(Object.values(counts).reduce((a,b)=>a+b,0),502);
console.log(JSON.stringify(counts,null,2));
