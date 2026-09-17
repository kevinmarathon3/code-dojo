import {bi, type Unit, type Exercise, type Language, type Level} from '../types';
export const unit=(id:string,en:string,es:string,ex:string,exEs:string,hint:string,hintEs:string,source:(n:number)=>string,output:(n:number)=>string,broken:string):Unit=>({id,title:bi(en,es),explanation:bi(ex,exEs),hint:bi(hint,hintEs),source,output,broken});
export function exercises(language:Language,level:Level,units:Unit[],variant=0):Exercise[]{
  const n=variant%7+3;
  return units.flatMap((u,i)=>{
    const template=u.source(n), match=template.match(/«([\s\S]*?)»/);
    if(!match) throw new Error(`Missing teaching token: ${u.id}`);
    const answer=match[1],solution=template.replace(/«|»/g,'');
    return (['predict','complete','repair'] as const).map((kind,k)=>({
      id:`${language}-${level}-${u.id}-${kind}`, language,level,unit:u.id,title:u.title,explanation:u.explanation,
      hints:[u.hint,bi(`Focus on ${answer.length<40?'the expression or keyword at the gap':'the highlighted operation'}. Compare its types and inputs.`,`Revisa la expresión o palabra clave. Compara sus tipos y entradas.`)],
      kind,variant,checkpoint:k===2,focusLine:template.slice(0,match.index).split('\n').length-1,prerequisites:i?[`${language}-${level}-${units[i-1].id}`]:[],
      code:kind==='predict'?solution:template.replace(/«[\s\S]*?»/,kind==='complete'?'___':u.broken),
      solution,expected:u.output(n),answer:kind==='predict'?u.output(n):answer,accepted:[kind==='predict'?u.output(n):answer]
    }));
  });
}
