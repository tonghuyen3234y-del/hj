import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
await mkdir(root + 'dist', { recursive: true });
for (const name of ['app.js','scene.js','motion.js','town.js','content.js','styles.css','favicon.svg','assets','vendor']) await cp(root + name, root + 'dist/' + name, {recursive:true});
const template = await readFile(root + 'index.html', 'utf8');
const routes = ['', 'home', 'drive', 'about', 'projects', 'resume', 'writing', 'contact', 'en', 'en/home', 'en/drive', 'en/about', 'en/projects', 'en/resume', 'en/writing', 'en/contact'];
for (const route of routes) {
  const prefix = route ? '../'.repeat(route.split('/').length) : './';
  const target = root + 'dist/' + (route ? route + '/' : '');
  await mkdir(target, {recursive:true});
  let html = template.replaceAll('href="./', `href="${prefix}`).replaceAll('src="./', `src="${prefix}`);
  if (route.startsWith('en')) html = html.replace('lang="zh-CN"','lang="en"').replace('李慧洁的好奇小镇。探索 AI、Agent、创造力与独立思考。保持好奇，持续创造。', "Huijie Li’s little world of AI, agents, creativity, and independent thinking. Stay curious. Keep creating.");
  await writeFile(target + 'index.html', html);
}
await writeFile(root + 'dist/404.html', template);
await writeFile(root + 'dist/.nojekyll', '');
console.log('Built 16 routes in dist/ — all assets are local.');
