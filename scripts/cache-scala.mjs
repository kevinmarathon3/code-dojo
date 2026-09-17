// Cache official Maven artifacts locally for hosts whose JVM cannot reach Maven over the network.
import {mkdir,writeFile,readFile} from 'node:fs/promises';import {existsSync} from 'node:fs';import {resolve,dirname} from 'node:path';import {pathToFileURL} from 'node:url';import {createHash} from 'node:crypto';
const root=resolve('.toolchains/maven');const base='https://repo.maven.apache.org/maven2/';const seen=new Map();
const tag=(xml,key)=>xml.match(new RegExp(`<${key}>([^<]+)</${key}>`))?.[1];
async function file(path){const local=resolve(root,path);if(existsSync(local))return readFile(local);const response=await fetch(base+path);if(!response.ok)throw Error(`${response.status}: ${path}`);const data=Buffer.from(await response.arrayBuffer());const check=await fetch(base+path+'.sha1');if(check.ok){const sha=(await check.text()).trim();if(createHash('sha1').update(data).digest('hex')!==sha)throw Error('Checksum mismatch');}await mkdir(dirname(local),{recursive:true});await writeFile(local,data);return data;}
async function artifact(group,name,version,onlyPom=false){const key=`${group}:${name}:${version}`;if(seen.has(key))return seen.get(key);const relative=`${group.replaceAll('.','/')}/${name}/${version}/${name}-${version}`;const xml=(await file(relative+'.pom')).toString();const parent=xml.match(/<parent>([\s\S]*?)<\/parent>/)?.[1];const inherited=parent?await artifact(tag(parent,'groupId'),tag(parent,'artifactId'),tag(parent,'version'),true):{};const props={...inherited,'project.version':version,'project.groupId':group,'project.artifactId':name};for(const match of (xml.match(/<properties>([\s\S]*?)<\/properties>/)?.[1]??'').matchAll(/<([\w.-]+)>([^<]+)<\/\1>/g))props[match[1]]=match[2];seen.set(key,props);
 if(onlyPom)return props;
 console.log('Caching',key);await file(relative+'.jar');
 const clean=xml.replace(/<dependencyManagement>[\s\S]*?<\/dependencyManagement>/g,'').replace(/<profiles>[\s\S]*?<\/profiles>/g,'');
 const deps=clean.match(/<dependencies>([\s\S]*?)<\/dependencies>/)?.[1]??'';
 const expand=s=>s?.replace(/\$\{([^}]+)\}/g,(_,k)=>props[k]??'');
 for(const m of deps.matchAll(/<dependency>([\s\S]*?)<\/dependency>/g)){const dep=m[1];if(['test','provided','system'].includes(tag(dep,'scope'))||tag(dep,'optional')==='true')continue;const g=expand(tag(dep,'groupId')),a=expand(tag(dep,'artifactId')),v=expand(tag(dep,'version'));if(!g||!a||!v)throw Error(`Unresolved dependency in ${key}: ${dep}`);await artifact(g,a,v);}
 return props;
}
await artifact('org.scala-lang','scala3-compiler_3','3.9.0');
let env=await readFile('.env.local','utf8');env=env.split('\n').filter(x=>!x.startsWith('COURSIER_REPOSITORIES=')&&!x.startsWith('DOJO_SCALA_VERSION=')).join('\n');await writeFile('.env.local',env+`\nCOURSIER_REPOSITORIES=${JSON.stringify(pathToFileURL(root).href)}\nDOJO_SCALA_VERSION="3.9.0"\n`);console.log('Scala compiler artifacts cached locally.');
