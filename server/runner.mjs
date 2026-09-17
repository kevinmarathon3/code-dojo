import {spawn} from 'node:child_process';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {existsSync} from 'node:fs';
if(existsSync('.env.local'))process.loadEnvFile('.env.local');
export const LANGUAGES=['go','rust','java','python','scala'];
const commands={go:process.env.DOJO_GO||'go',rust:process.env.DOJO_RUST||'rustc',javac:process.env.DOJO_JAVAC||'javac',java:process.env.DOJO_JAVA||'java',python:process.env.DOJO_PYTHON||'python3',scala:process.env.DOJO_SCALA||'scala-cli'};
const scalaPrefix=process.env.DOJO_SCALA_JAR?['-Djava.net.preferIPv4Stack=true','-jar',process.env.DOJO_SCALA_JAR]:[];
if(scalaPrefix.length)commands.scala=commands.java;
const tools={go:[commands.go,['version']],rust:[commands.rust,['--version']],java:[commands.javac,['-version']],python:[commands.python,['--version']],scala:[commands.scala,[...scalaPrefix,'version']]};
export function processRun(command,args,{cwd,stdin='',timeout=10000,maxOutput=65536}={}){
  return new Promise(resolve=>{
    const env={...process.env}; delete env.NODE_OPTIONS;
    const child=spawn(command,args,{cwd,env,stdio:['pipe','pipe','pipe'],detached:process.platform!=='win32'});
    let stdout='',stderr='',bytes=0,status='ok',done=false;
    const kill=()=>{try{process.platform==='win32'?child.kill('SIGKILL'):process.kill(-child.pid,'SIGKILL');}catch{child.kill('SIGKILL');}};
    const timer=setTimeout(()=>{status='timeout';kill();},timeout);
    const collect=(chunk,stream)=>{bytes+=chunk.length;if(bytes>maxOutput){status='output_limit';kill();return;}if(stream==='out')stdout+=chunk.toString();else stderr+=chunk.toString();};
    child.stdout.on('data',x=>collect(x,'out'));child.stderr.on('data',x=>collect(x,'err'));
    const finish=code=>{if(done)return;done=true;clearTimeout(timer);resolve({stdout,stderr,status:status==='ok'&&code!==0?'error':status,exitCode:code});};
    child.on('error',e=>{stderr=e.code==='ENOENT'?`Tool not installed: ${command}`:e.message;status='unavailable';finish(null);});
    child.on('close',finish);child.stdin.on('error',()=>{});child.stdin.end(stdin);
  });
}
export async function capabilities(){const result={};for(const lang of LANGUAGES){const [command,args]=tools[lang];const r=await processRun(command,args,{timeout:5000,maxOutput:3000});result[lang]={available:r.status==='ok',version:(r.stdout||r.stderr).trim(),command};}return result;}
export async function runCode({language,source,stdin='',expected,tests}){
  if(!LANGUAGES.includes(language)||typeof source!=='string'||source.length>60000||typeof stdin!=='string'||stdin.length>10000||expected!==undefined&&typeof expected!=='string'||tests!==undefined&&(!Array.isArray(tests)||tests.length>10||tests.some(t=>!t||typeof t.stdin!=='string'||typeof t.expected!=='string'||t.stdin.length>10000||t.expected.length>10000)))throw new Error('Invalid run request');
  const dir=await mkdtemp(join(tmpdir(),'code-dojo-'));
  try{
    const filename={go:'main.go',rust:'main.rs',java:'Main.java',python:'main.py',scala:'Main.scala'}[language];
    await writeFile(join(dir,filename),source);
    let compile,command,args;
    if(language==='go'){compile=await processRun(commands.go,['build','-o','program',filename],{cwd:dir,timeout:30000});command=join(dir,'program');args=[];}
    if(language==='rust'){compile=await processRun(commands.rust,['--edition=2021',filename,'-o','program'],{cwd:dir,timeout:30000});command=join(dir,'program');args=[];}
    if(language==='java'){compile=await processRun(commands.javac,[filename],{cwd:dir,timeout:30000});command=commands.java;args=['-cp',dir,'Main'];}
    if(language==='python'){command=commands.python;args=['-I',filename];}
    if(language==='scala'){command=commands.scala;args=[...scalaPrefix,'run',filename,'--server=false','--jvm','system','--runner=false',...(process.env.DOJO_SCALA_VERSION?['--scala',process.env.DOJO_SCALA_VERSION]:[])];}
    if(compile&&compile.status!=='ok')return {...compile,status:compile.status==='error'?'compile_error':compile.status,diagnostics:compile.stderr,tests:[]};
    const cases=tests??[{stdin,expected}]; const results=[];let execution;
    for(const t of cases){execution=await processRun(command,args,{cwd:dir,stdin:t.stdin,timeout:language==='scala'?60000:5000});results.push({passed:execution.status==='ok'&&(t.expected===undefined||execution.stdout.trim()===t.expected.trim()),expected:t.expected,actual:execution.stdout.trim(),status:execution.status});if(execution.status!=='ok')break;}
    return {...execution,diagnostics:compile?.stderr??'',tests:results};
  }finally{await rm(dir,{recursive:true,force:true});}
}
