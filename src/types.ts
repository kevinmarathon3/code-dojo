export type Locale = 'en' | 'es';
export type Language = 'go' | 'rust' | 'java' | 'python' | 'scala';
export type Level = 'beginner' | 'intermediate' | 'advanced';
export type Text = {en:string; es:string};
export const bi = (en:string, es:string):Text => ({en,es});
export interface Unit { id:string; title:Text; explanation:Text; hint:Text; source:(n:number)=>string; output:(n:number)=>string; broken:string; }
export interface Exercise { id:string; language:Language; level:Level; unit:string; title:Text; explanation:Text; hints:Text[]; kind:'predict'|'complete'|'repair'; variant:number; checkpoint:boolean; focusLine:number; prerequisites:string[]; code:string; solution:string; expected:string; answer:string; accepted:string[]; }
export interface Attempt {exercise:string; skill:string; variant:number; correct:boolean; hints:number; revealed:boolean; at:number; session:string; checkpoint:boolean; mode:'drill'|'run'|'lab'|'engineering';}
export interface Review {stage:number; due:number; successes:number;}
export interface Save {version:1; settings:{locale:Locale;language:Language;level:Level;sound:boolean;volume:number;timed:boolean}; attempts:Attempt[]; reviews:Record<string,Review>;}
