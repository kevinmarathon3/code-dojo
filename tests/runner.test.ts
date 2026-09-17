import {test} from 'node:test';import assert from 'node:assert/strict';
// @ts-expect-error Node runner is deliberately usable without transpilation.
import {processRun,runCode} from '../server/runner.mjs';
test('process runner captures stdout, stderr, and exit status',async()=>{const r=await processRun(process.execPath,['-e','console.log("out");console.error("err")']);assert.equal(r.status,'ok');assert.equal(r.stdout,'out\n');assert.equal(r.stderr,'err\n');});
test('timeouts and output limits stop runaway programs',async()=>{const a=await processRun(process.execPath,['-e','while(true){}'],{timeout:80});assert.equal(a.status,'timeout');const b=await processRun(process.execPath,['-e','console.log("x".repeat(50000))'],{maxOutput:1000});assert.equal(b.status,'output_limit');});
test('missing compiler reports unavailable',async()=>{const r=await processRun('code-dojo-no-such-tool',[]);assert.equal(r.status,'unavailable');});
test('runner rejects unsupported language and oversized input',async()=>{await assert.rejects(runCode({language:'shell',source:'echo unsafe'}));await assert.rejects(runCode({language:'python',source:'x'.repeat(60001)}));await assert.rejects(runCode({language:'python',source:'pass',tests:[{}]}));});
