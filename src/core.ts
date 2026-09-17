import type {Attempt, Exercise, Save} from './types';
export const initialSave=():Save=>({version:1,settings:{locale:typeof navigator!=='undefined'&&navigator.language.startsWith('es')?'es':'en',language:'go',level:'beginner',sound:false,volume:.25,timed:false},attempts:[],reviews:{}});
export const skillOf=(e:Exercise)=>`${e.language}-${e.level}-${e.unit}`;
// Collapse whitespace outside literals, preserving literal contents and indentation-sensitive full programs.
export function normalizeToken(s:string){return s.trim().match(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[A-Za-z_$][\w$]*|\d+(?:\.\d+)?|(?:\+=|-=|==|!=|<=|>=|=>|->|::|:=|&&|\|\|)|[^\s]/g)?.join('\u001f')??'';}
export function checkAnswer(e:Exercise,answer:string){return e.accepted.some(a=>normalizeToken(a)===normalizeToken(answer));}
export function record(save:Save,a:Attempt):Save{
  const old=save.reviews[a.skill]??{stage:0,due:0,successes:0};
  const independent=a.correct&&a.hints===0&&!a.revealed;
  const already=save.attempts.some(x=>x.skill===a.skill&&x.session===a.session&&x.correct&&!x.hints&&!x.revealed);
  const advance=independent&&!already;
  const stage=advance?Math.min(old.stage+1,4):independent?old.stage:0;
  const days=[1,3,7,14][Math.max(0,stage-1)];
  return {...save,attempts:[...save.attempts,a],reviews:{...save.reviews,[a.skill]:{stage,successes:old.successes+(advance?1:0),due:independent?a.at+days*86400000:a.at+5*60000}}};
}
export function mastery(attempts:Attempt[],prefix:string){
  const successes=attempts.filter(a=>a.skill.startsWith(prefix)&&a.correct&&!a.hints&&!a.revealed&&a.checkpoint);
  const skills=new Set(successes.map(a=>a.skill));
  return [...skills].filter(skill=>{
    const a=successes.filter(x=>x.skill===skill);
    return a.some(x=>a.some(y=>x.variant!==y.variant&&x.session!==y.session&&Math.abs(x.at-y.at)>=86400000));
  }).length;
}
export function validateSave(value:unknown):Save{
  const s=value as Save;
  if(!s||s.version!==1||!s.settings||!['en','es'].includes(s.settings.locale)||!['go','rust','java','python','scala'].includes(s.settings.language)||!['beginner','intermediate','advanced'].includes(s.settings.level)||typeof s.settings.sound!=='boolean'||typeof s.settings.timed!=='boolean'||!Number.isFinite(s.settings.volume)||s.settings.volume<0||s.settings.volume>1||!Array.isArray(s.attempts)||s.attempts.length>100000||!s.reviews||typeof s.reviews!=='object'||Array.isArray(s.reviews))throw new Error('Invalid backup');
  for(const a of s.attempts)if(!a||typeof a.exercise!=='string'||typeof a.skill!=='string'||typeof a.session!=='string'||!Number.isFinite(a.at)||!Number.isInteger(a.variant)||!Number.isInteger(a.hints)||a.hints<0||typeof a.correct!=='boolean'||typeof a.revealed!=='boolean'||typeof a.checkpoint!=='boolean'||!['drill','run','lab','engineering'].includes(a.mode))throw new Error('Invalid attempt');
  for(const [k,r] of Object.entries(s.reviews))if(['__proto__','constructor','prototype'].includes(k)||!r||!Number.isFinite(r.due)||!Number.isInteger(r.stage)||r.stage<0||r.stage>4||!Number.isInteger(r.successes)||r.successes<0)throw new Error('Invalid review');
  return structuredClone(s);
}
let dbPromise:Promise<IDBDatabase>|undefined;
function db(){return dbPromise??=new Promise((resolve,reject)=>{const r=indexedDB.open('code-dojo',1);r.onupgradeneeded=()=>r.result.createObjectStore('state');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export async function loadSave(){const d=await db();return new Promise<Save>((resolve,reject)=>{const r=d.transaction('state').objectStore('state').get('save');r.onsuccess=()=>{try{resolve(r.result?validateSave(r.result):initialSave());}catch(e){reject(e);}};r.onerror=()=>reject(r.error);});}
export async function persist(save:Save){const d=await db();await new Promise<void>((resolve,reject)=>{const tx=d.transaction('state','readwrite');tx.objectStore('state').put(save,'save');tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});}
let audio:AudioContext|undefined;
export function cue(enabled:boolean,volume:number,kind:'success'|'retry'|'step'){
  if(!enabled)return; try{audio??=new AudioContext();void audio.resume();const osc=audio.createOscillator(),gain=audio.createGain();osc.connect(gain);gain.connect(audio.destination);const t=audio.currentTime;osc.frequency.setValueAtTime(kind==='success'?620:kind==='retry'?220:420,t);osc.frequency.exponentialRampToValueAtTime(kind==='success'?940:300,t+.12);gain.gain.setValueAtTime(volume*.12,t);gain.gain.exponentialRampToValueAtTime(.001,t+.18);osc.start();osc.stop(t+.2);}catch{/* Audio is an optional enhancement. */}
}
