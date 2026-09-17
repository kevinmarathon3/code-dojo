import http from 'node:http';
import {capabilities,runCode} from './runner.mjs';
const allowed=new Set(['http://127.0.0.1:5173','http://localhost:5173','http://127.0.0.1:4173','http://localhost:4173']);
let busy=false;
const server=http.createServer(async(req,res)=>{
  const send=(code,data)=>{res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
  // Origin is mandatory for execution. Do not allow arbitrary websites to invoke local tools.
  if(!['127.0.0.1:4318','localhost:4318','127.0.0.1:5173','localhost:5173'].includes(req.headers.host??''))return send(403,{error:'Invalid host'});
  if(req.headers.origin&&!allowed.has(req.headers.origin))return send(403,{error:'Origin rejected'});
  if(req.method==='GET'&&req.url==='/api/capabilities')return send(200,await capabilities());
  if(req.method!=='POST'||req.url!=='/api/run')return send(404,{error:'Not found'});
  if(!req.headers.origin||!allowed.has(req.headers.origin)||!req.headers['content-type']?.startsWith('application/json'))return send(403,{error:'Local JSON requests only'});
  if(busy)return send(429,{error:'Runner busy; retry shortly'});
  let body='';
  try{for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>100000){send(413,{error:'Request too large'});return;}}
    const data=JSON.parse(body);busy=true;try{send(200,await runCode(data));}finally{busy=false;}
  }catch(e){send(400,{error:e.message});}
});
server.listen(4318,'127.0.0.1',()=>console.log('Code Dojo local runner: http://127.0.0.1:4318 (trusted personal code only)'));
