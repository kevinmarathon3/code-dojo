import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import BeginnerIntro from '../src/BeginnerIntro';
import {beginnerLesson,explainBeginnerLine} from '../src/beginner';
import {exercises} from '../src/content/factory';
import type {Language} from '../src/types';
test('all beginner lessons explain a goal before showing code, in both languages',async()=>{
 for(const language of ['go','rust','java','python','scala'] as Language[]){
  const {units}=await import('../src/content/'+language);
  for(const e of exercises(language,'beginner',units.beginner).filter((_,i)=>i%3===1)){
   for(const locale of ['en','es'] as const){const content=beginnerLesson(e,locale);assert.ok(content.goal.length>40);assert.ok(content.idea.length>40);assert.ok(content.syntax.length>40);const html=renderToStaticMarkup(React.createElement(BeginnerIntro,{lesson:e,locale,onNext:()=>{}}));assert.ok(!html.includes('<pre'));assert.ok(!html.includes('program-tour'));}
  }
 }
});
test('beginner explanations distinguish chosen names and language entrypoints',()=>{
 assert.match(explainBeginnerLine('func main() {','go','es')!,/func.*main.*iniciar/);
 assert.match(explainBeginnerLine('score := 4','go','es')!,/nombre elegido.*palabra reservada/);
 assert.match(explainBeginnerLine('score = 4','python','es')!,/objeto entero/);
 assert.match(explainBeginnerLine('@main def run(): Unit = {','scala','es')!,/run.*nombre.*Unit/);
});

test('variable animation retains stored points when copying output',async()=>{
 const {default:ConceptAnimation}=await import('../src/ConceptAnimation');const {units}=await import('../src/content/go');const e=exercises('go','beginner',units.beginner,1)[1];
 const frame=(n:number)=>renderToStaticMarkup(React.createElement(ConceptAnimation,{lesson:e,locale:'es',frame:n,playing:false,speed:1}));
 assert.match(frame(0),/score recuerda 4 puntos/);assert.match(frame(1),/score recuerda 4 puntos/);assert.match(frame(2),/score recuerda 6 puntos/);assert.match(frame(3),/score recuerda 6 puntos.*Se copia el valor/);assert.match(frame(1),/bonus-transfer/);assert.match(frame(3),/output-transfer/);
});
