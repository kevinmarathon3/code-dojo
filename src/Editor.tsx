import {useEffect,useRef} from 'react';
import {EditorView,keymap,lineNumbers,highlightActiveLine,drawSelection} from '@codemirror/view';
import {EditorState} from '@codemirror/state';
import {defaultKeymap,history,historyKeymap,indentWithTab} from '@codemirror/commands';
import {syntaxHighlighting,HighlightStyle,StreamLanguage} from '@codemirror/language';
import {java} from '@codemirror/lang-java';import {python} from '@codemirror/lang-python';import {rust} from '@codemirror/lang-rust';
import {go} from '@codemirror/legacy-modes/mode/go';import {scala} from '@codemirror/legacy-modes/mode/clike';
import {tags} from '@lezer/highlight';
import type {Language} from './types';
export default function Editor({value,onChange,language,label,insert}:{value:string;onChange:(v:string)=>void;language:Language;label:string;insert?:{text:string;key:number}}){
 const host=useRef<HTMLDivElement>(null),view=useRef<EditorView>(null),callback=useRef(onChange);callback.current=onChange;
 useEffect(()=>{const syntax={go:()=>StreamLanguage.define(go),rust,java,python,scala:()=>StreamLanguage.define(scala)}[language];const v=new EditorView({parent:host.current!,state:EditorState.create({doc:value,extensions:[lineNumbers(),history(),drawSelection(),highlightActiveLine(),syntax(),syntaxHighlighting(HighlightStyle.define([{tag:tags.keyword,color:'#c5a7ec'},{tag:[tags.string,tags.special(tags.string)],color:'#bed68c'},{tag:tags.number,color:'#eac18a'},{tag:tags.comment,color:'#849b8d'},{tag:[tags.function(tags.variableName),tags.function(tags.propertyName)],color:'#83cdd3'},{tag:tags.typeName,color:'#dbce8d'},{tag:tags.operator,color:'#acbdb3'}])),keymap.of([...defaultKeymap,...historyKeymap,indentWithTab]),EditorView.contentAttributes.of({'aria-label':label,autocorrect:'off',autocapitalize:'off',spellcheck:'false'}),EditorView.updateListener.of(u=>{if(u.docChanged)callback.current(u.state.doc.toString());}),EditorView.theme({'&':{backgroundColor:'transparent',color:'#d8e2df',fontSize:'14px'},'.cm-content':{fontFamily:'"SFMono-Regular", Consolas, monospace',padding:'20px 0',caretColor:'#d8f36b'},'.cm-line':{padding:'0 20px'},'.cm-gutters':{backgroundColor:'transparent',color:'#50615f',border:'none',padding:'20px 0'},'.cm-activeLine':{background:'#d8f36b08'},'.cm-activeLineGutter':{background:'transparent'},'&.cm-focused':{outline:'none'},'.cm-selectionBackground, &.cm-focused .cm-selectionBackground':{background:'#526846'},'.cm-scroller':{overflow:'auto',minHeight:'260px'}})]})});view.current=v;return()=>{v.destroy();view.current=null;};},[language,label]);
 useEffect(()=>{const v=view.current;if(v&&v.state.doc.toString()!==value)v.dispatch({changes:{from:0,to:v.state.doc.length,insert:value}});},[value]);
 useEffect(()=>{if(insert&&view.current){view.current.dispatch(view.current.state.replaceSelection(insert.text));view.current.focus();}},[insert]);
 return <div className="editor" ref={host}/>;
}
