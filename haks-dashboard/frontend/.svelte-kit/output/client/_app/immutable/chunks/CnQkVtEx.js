import{f as xa,a as ya,t as Ea,c as Sa,g as Aa,j as U,k as Bt,l as Na,n as ka,o as Ta,q as De,p as Se,r as lt,d as ve,s as be,_ as $a}from"./CL6uaj4E.js";import{D as Z,aQ as Et,aR as Kt,aS as Da,h as Ca,b as qt,v as C,y as nt,k as r,aj as Ra,H as Oa,V as kt,T as Te,a6 as me,o as we,a2 as Ia,af as Ma,aT as La,R as Tt,G as Ae,C as st,aU as le,A as Be,aV as Yt,aW as Pa,au as Wa,aX as Ua,aY as Fa,aC as Ha,m as $t,aZ as za,aq as Va,a_ as jt,F as Jt,a$ as _t,b0 as Ga,a8 as Ba,I as Ka,S as it,ad as St,a4 as qa,a1 as Qt,b1 as Xt,q as Zt,b2 as Ya,b3 as ja,E as Ja,B as Qa,b4 as Xa,ae as Za,w as er,b5 as ea,b6 as tr,b7 as ta,aJ as aa,b8 as Dt,b9 as Ct,ba as ar,bb as rr,bc as sr,bd as nr,be as ir,bf as or,bg as Ke,bh as lr,bi as cr,bj as ur,bk as dr,bl as fr,bm as vr,bn as br,bo as _r,bp as Rt,bq as pr,u as ot,l as gr,Q as hr,aL as wr,br as Ot,aM as It,bs as mr,bt as Ne,at as xr,bu as yr,p as ra,g,c as qe,f as Ye,a as A,s as y,r as _,d as sa,bv as Er,aP as He,bw as Sr,aN as oe,an as Le,t as ae,e as R,ao as h,U as Pe,bx as Mt}from"./BWFiLchX.js";var Ar="font-weight: bold",Nr="font-weight: normal";function Lt(e){Z?console.warn(`%c[svelte] state_snapshot_uncloneable
%c${e?`The following properties cannot be cloned with \`$state.snapshot\` — the return value contains the originals:

${e}`:"Value cannot be cloned with `$state.snapshot` — the original value was returned"}
https://svelte.dev/e/state_snapshot_uncloneable`,Ar,Nr):console.warn("https://svelte.dev/e/state_snapshot_uncloneable")}const kr=[];function Tr(e,t=!1,a=!1){if(Z&&!t){const s=[],n=Ge(e,new Map,"",s,null,a);if(s.length===1&&s[0]==="")Lt();else if(s.length>0){const i=s.length>10?s.slice(0,7):s.slice(0,10),o=s.length-i.length;let c=i.map(l=>`- <value>${l}`).join(`
`);o>0&&(c+=`
- ...and ${o} more`),Lt(c)}return n}return Ge(e,new Map,"",kr,null,a)}function Ge(e,t,a,s,n=null,i=!1){if(typeof e=="object"&&e!==null){var o=t.get(e);if(o!==void 0)return o;if(e instanceof Map)return new Map(e);if(e instanceof Set)return new Set(e);if(Et(e)){var c=Array(e.length);t.set(e,c),n!==null&&t.set(n,c);for(var l=0;l<e.length;l+=1){var u=e[l];l in e&&(c[l]=Ge(u,t,Z?`${a}[${l}]`:a,s,null,i))}return c}if(Kt(e)===Da){c={},t.set(e,c),n!==null&&t.set(n,c);for(var b of Object.keys(e))c[b]=Ge(e[b],t,Z?`${a}.${b}`:a,s,null,i);return c}if(e instanceof Date)return structuredClone(e);if(typeof e.toJSON=="function"&&!i)return Ge(e.toJSON(),t,Z?`${a}.toJSON()`:a,s,e)}if(e instanceof EventTarget)return e;try{return structuredClone(e)}catch{return Z&&s.push(a),e}}function na(e,t){return t}function $r(e,t,a){for(var s=[],n=t.length,i,o=t.length,c=0;c<n;c++){let w=t[c];Jt(w,()=>{if(i){if(i.pending.delete(w),i.done.add(w),i.pending.size===0){var p=e.outrogroups;mt(e,St(i.done)),p.delete(i),p.size===0&&(e.outrogroups=null)}}else o-=1},!1)}if(o===0){var l=s.length===0&&a!==null;if(l){var u=a,b=u.parentNode;Ba(b),b.append(u),e.items.clear()}mt(e,t,!l)}else i={pending:new Set(t),done:new Set},(e.outrogroups??(e.outrogroups=new Set)).add(i)}function mt(e,t,a=!0){var s;if(e.pending.size>0){s=new Set;for(const o of e.pending.values())for(const c of o)s.add(e.items.get(c).e)}for(var n=0;n<t.length;n++){var i=t[n];if(s!=null&&s.has(i)){i.f|=le;const o=document.createDocumentFragment();Ka(i,o)}else it(t[n],a)}}var Pt;function ze(e,t,a,s,n,i=null){var o=e,c=new Map,l=(t&Xt)!==0;if(l){var u=e;o=C?Te(Qt(u)):u.appendChild(st())}C&&nt();var b=null,w=Wa(()=>{var $=a();return Et($)?$:$==null?[]:St($)});Z&&Ca(w,"{#each ...}");var p,k=new Map,E=!0;function P($){(Y.effect.f&Va)===0&&(Y.pending.delete($),Y.fallback=b,Dr(Y,p,o,t,s),b!==null&&(p.length===0?(b.f&le)===0?jt(b):(b.f^=le,Ve(b,null,o)):Jt(b,()=>{b=null})))}function d($){Y.pending.delete($)}var m=qt(()=>{p=r(w);var $=p.length;let F=!1;if(C){var I=Ra(o)===Oa;I!==($===0)&&(o=kt(),Te(o),me(!1),F=!0)}for(var J=new Set,x=Ae,S=Pa(),D=0;D<$;D+=1){C&&we.nodeType===Ia&&we.data===Ma&&(o=we,F=!0,me(!1));var z=p[D],T=s(z,D);if(Z){var ce=s(z,D);T!==ce&&La(String(D),String(T),String(ce))}var q=E?null:c.get(T);q?(q.v&&Tt(q.v,z),q.i&&Tt(q.i,D),S&&x.unskip_effect(q.e)):(q=Cr(c,E?o:Pt??(Pt=st()),z,T,D,n,t,a),E||(q.e.f|=le),c.set(T,q)),J.add(T)}if($===0&&i&&!b&&(E?b=Be(()=>i(o)):(b=Be(()=>i(Pt??(Pt=st()))),b.f|=le)),$>J.size&&(Z?Rr(p,s):Yt("","","")),C&&$>0&&Te(kt()),!E)if(k.set(x,J),S){for(const[ge,_e]of c)J.has(ge)||x.skip_effect(_e.e);x.oncommit(P),x.ondiscard(d)}else P(x);F&&me(!0),r(w)}),Y={effect:m,items:c,pending:k,outrogroups:null,fallback:b};E=!1,C&&(o=we)}function We(e){for(;e!==null&&(e.f&Ga)===0;)e=e.next;return e}function Dr(e,t,a,s,n){var z,T,ce,q,ge,_e,xe,ye,Ee;var i=(s&Ya)!==0,o=t.length,c=e.items,l=We(e.effect.first),u,b=null,w,p=[],k=[],E,P,d,m;if(i)for(m=0;m<o;m+=1)E=t[m],P=n(E,m),d=c.get(P).e,(d.f&le)===0&&((T=(z=d.nodes)==null?void 0:z.a)==null||T.measure(),(w??(w=new Set)).add(d));for(m=0;m<o;m+=1){if(E=t[m],P=n(E,m),d=c.get(P).e,e.outrogroups!==null)for(const re of e.outrogroups)re.pending.delete(d),re.done.delete(d);if((d.f&_t)!==0&&(jt(d),i&&((q=(ce=d.nodes)==null?void 0:ce.a)==null||q.unfix(),(w??(w=new Set)).delete(d))),(d.f&le)!==0)if(d.f^=le,d===l)Ve(d,null,a);else{var Y=b?b.next:l;d===e.effect.last&&(e.effect.last=d.prev),d.prev&&(d.prev.next=d.next),d.next&&(d.next.prev=d.prev),pe(e,b,d),pe(e,d,Y),Ve(d,Y,a),b=d,p=[],k=[],l=We(b.next);continue}if(d!==l){if(u!==void 0&&u.has(d)){if(p.length<k.length){var $=k[0],F;b=$.prev;var I=p[0],J=p[p.length-1];for(F=0;F<p.length;F+=1)Ve(p[F],$,a);for(F=0;F<k.length;F+=1)u.delete(k[F]);pe(e,I.prev,J.next),pe(e,b,I),pe(e,J,$),l=$,b=J,m-=1,p=[],k=[]}else u.delete(d),Ve(d,l,a),pe(e,d.prev,d.next),pe(e,d,b===null?e.effect.first:b.next),pe(e,b,d),b=d;continue}for(p=[],k=[];l!==null&&l!==d;)(u??(u=new Set)).add(l),k.push(l),l=We(l.next);if(l===null)continue}(d.f&le)===0&&p.push(d),b=d,l=We(d.next)}if(e.outrogroups!==null){for(const re of e.outrogroups)re.pending.size===0&&(mt(e,St(re.done)),(ge=e.outrogroups)==null||ge.delete(re));e.outrogroups.size===0&&(e.outrogroups=null)}if(l!==null||u!==void 0){var x=[];if(u!==void 0)for(d of u)(d.f&_t)===0&&x.push(d);for(;l!==null;)(l.f&_t)===0&&l!==e.fallback&&x.push(l),l=We(l.next);var S=x.length;if(S>0){var D=(s&Xt)!==0&&o===0?a:null;if(i){for(m=0;m<S;m+=1)(xe=(_e=x[m].nodes)==null?void 0:_e.a)==null||xe.measure();for(m=0;m<S;m+=1)(Ee=(ye=x[m].nodes)==null?void 0:ye.a)==null||Ee.fix()}$r(e,x,D)}}i&&Zt(()=>{var re,Ce;if(w!==void 0)for(d of w)(Ce=(re=d.nodes)==null?void 0:re.a)==null||Ce.apply()})}function Cr(e,t,a,s,n,i,o,c){var l=(o&Ua)!==0?(o&Fa)===0?Ha(a,!1,!1):$t(a):null,u=(o&za)!==0?$t(n):null;return Z&&l&&(l.trace=()=>{c()[(u==null?void 0:u.v)??n]}),{v:l,i:u,e:Be(()=>(i(t,l??a,u??n,c),()=>{e.delete(s)}))}}function Ve(e,t,a){if(e.nodes)for(var s=e.nodes.start,n=e.nodes.end,i=t&&(t.f&le)===0?t.nodes.start:a;s!==null;){var o=qa(s);if(i.before(s),s===n)return;s=o}}function pe(e,t,a){t===null?e.effect.first=a:t.next=a,a===null?e.effect.last=t:a.prev=t}function Rr(e,t){const a=new Map,s=e.length;for(let n=0;n<s;n++){const i=t(e[n],n);if(a.has(i)){const o=String(a.get(i)),c=String(n);let l=String(i);l.startsWith("[object ")&&(l=null),Yt(o,c,l)}a.set(i,n)}}function je(e,t,a,s,n){var c;C&&nt();var i=(c=t.$$slots)==null?void 0:c[a],o=!1;i===!0&&(i=t.children,o=!0),i===void 0||i(e,o?()=>s:s)}function Or(e,t,a,s,n,i){let o=C;C&&nt();var c=null;C&&we.nodeType===ja&&(c=we,nt());var l=C?we:e,u=new Qa(l,!1);qt(()=>{const b=t()||null;var w=tr;if(b===null){u.ensure(null,null);return}return u.ensure(b,p=>{if(b){if(c=C?c:Xa(b,w),Za(c,c),s){var k=null;C&&xa(b)&&c.append(k=document.createComment(""));var E=C?Qt(c):c.appendChild(st());C&&(E===null?me(!1):Te(E)),s(c,E),k==null||k.remove()}er.nodes.end=c,p.before(c)}C&&Te(p)}),()=>{}},Ja),ea(()=>{}),o&&(me(!0),Te(l))}function Ir(e,t){var a=void 0,s;ta(()=>{a!==(a=t())&&(s&&(it(s),s=null),a&&(s=Be(()=>{aa(()=>a(e))})))})}function he(e,t,a,s,n,i){var o=e[Dt];if(C||o!==a||o===void 0){var c=ya(a,s,i);(!C||c!==e.getAttribute("class"))&&(c==null?e.removeAttribute("class"):t?e.className=c:e.setAttribute("class",c)),e[Dt]=a}else if(i&&n!==i)for(var l in i){var u=!!i[l];(n==null||u!==!!n[l])&&e.classList.toggle(l,u)}return i}function pt(e,t={},a,s){for(var n in a){var i=a[n];t[n]!==i&&(a[n]==null?e.style.removeProperty(n):e.style.setProperty(n,i,s))}}function Mr(e,t,a,s){var n=e[Ct];if(C||n!==t){var i=Ea(t,s);(!C||i!==e.getAttribute("style"))&&(i==null?e.removeAttribute("style"):e.style.cssText=i),e[Ct]=t}else s&&(Array.isArray(s)?(pt(e,a==null?void 0:a[0],s[0]),pt(e,a==null?void 0:a[1],s[1],"important")):pt(e,a,s));return s}function xt(e,t,a=!1){if(e.multiple){if(t==null)return;if(!Et(t))return ar();for(var s of e.options)s.selected=t.includes(Wt(s));return}for(s of e.options){var n=Wt(s);if(rr(n,t)){s.selected=!0;return}}(!a||t!==void 0)&&(e.selectedIndex=-1)}function Lr(e){var t=new MutationObserver(()=>{"__value"in e&&xt(e,e.__value)});t.observe(e,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["value"]}),ea(()=>{t.disconnect()})}function Wt(e){return"__value"in e?e.__value:e.value}const Ue=Symbol("class"),Fe=Symbol("style"),ia=Symbol("is custom element"),oa=Symbol("is html"),Pr=Ke?"link":"LINK",Ut=Ke?"input":"INPUT",Wr=Ke?"option":"OPTION",Ur=Ke?"select":"SELECT",Fr=Ke?"progress":"PROGRESS";function ke(e){if(C){var t=!1,a=()=>{if(!t){if(t=!0,e.hasAttribute("value")){var s=e.value;$e(e,"value",null),e.value=s}if(e.hasAttribute("checked")){var n=e.checked;$e(e,"checked",null),e.checked=n}}};e[ir]=a,Zt(a),or()}}function gt(e,t){var a=At(e);a.value===(a.value=t??void 0)||e.value===t&&(t!==0||e.nodeName!==Fr)||(e.value=t??"")}function Hr(e,t){t?e.hasAttribute("selected")||e.setAttribute("selected",""):e.removeAttribute("selected")}function $e(e,t,a,s){var n=At(e);if(C&&(n[t]=e.getAttribute(t),t==="src"||t==="srcset"||t==="href"&&e.nodeName===Pr)){s||Vr(e,t,a??"");return}n[t]!==(n[t]=a)&&(t==="loading"&&(e[fr]=a),a==null?e.removeAttribute(t):typeof a!="string"&&la(e).includes(t)?e[t]=a:e.setAttribute(t,a))}function zr(e,t,a,s,n=!1,i=!1){if(C&&n&&e.nodeName===Ut){var o=e,c=o.type==="checkbox"?"defaultChecked":"defaultValue";c in a||ke(o)}var l=At(e),u=l[ia],b=!l[oa];let w=C&&u;w&&me(!1);var p=t||{},k=e.nodeName===Wr;for(var E in t)E in a||(a[E]=null);a.class?a.class=Sa(a.class):a[Ue]&&(a.class=null),a[Fe]&&(a.style??(a.style=null));var P=la(e);if(e.nodeName===Ut&&"type"in a&&("value"in a||"__value"in a)){var d=a.type;(d!==p.type||d===void 0&&e.hasAttribute("type"))&&(p.type=d,$e(e,"type",d,i))}for(const x in a){let S=a[x];if(k&&x==="value"&&S==null){e.value=e.__value="",p[x]=S;continue}if(x==="class"){var m=e.namespaceURI==="http://www.w3.org/1999/xhtml";he(e,m,S,s,t==null?void 0:t[Ue],a[Ue]),p[x]=S,p[Ue]=a[Ue];continue}if(x==="style"){Mr(e,S,t==null?void 0:t[Fe],a[Fe]),p[x]=S,p[Fe]=a[Fe];continue}var Y=p[x];if(!(S===Y&&!(S===void 0&&e.hasAttribute(x)))){p[x]=S;var $=x[0]+x[1];if($!=="$$")if($==="on"){const D={},z="$$"+x;let T=x.slice(2);var F=Ta(T);if(Aa(T)&&(T=T.slice(0,-7),D.capture=!0),!F&&Y){if(S!=null)continue;e.removeEventListener(T,p[z],D),p[z]=null}if(F)U(T,e,S),Bt([T]);else if(S!=null){let ce=function(q){p[x].call(this,q)};p[z]=Na(T,e,ce,D)}}else if(x==="style")$e(e,x,S);else if(x==="autofocus")lr(e,!!S);else if(!u&&(x==="__value"||x==="value"&&S!=null))e.value=e.__value=S;else if(x==="selected"&&k)Hr(e,S);else{var I=x;b||(I=ka(I));var J=I==="defaultValue"||I==="defaultChecked";if(S==null&&!u&&!J)if(l[x]=null,I==="value"||I==="checked"){let D=e;const z=t===void 0;if(I==="value"){let T=D.defaultValue;D.removeAttribute(I),D.defaultValue=T,D.value=D.__value=z?T:null}else{let T=D.defaultChecked;D.removeAttribute(I),D.defaultChecked=T,D.checked=z?T:!1}}else e.removeAttribute(x);else J||P.includes(I)&&(u||typeof S!="string")?(e[I]=S,I in l&&(l[I]=cr)):typeof S!="function"&&$e(e,I,S,i)}}}return w&&me(!0),p}function Ft(e,t,a=[],s=[],n=[],i,o=!1,c=!1){sr(n,a,s,l=>{var u=void 0,b={},w=e.nodeName===Ur,p=!1;if(ta(()=>{var E=t(...l.map(r)),P=zr(e,u,E,i,o,c);p&&w&&"value"in E&&xt(e,E.value);for(let m of Object.getOwnPropertySymbols(b))E[m]||it(b[m]);for(let m of Object.getOwnPropertySymbols(E)){var d=E[m];m.description===nr&&(!u||d!==u[m])&&(b[m]&&it(b[m]),b[m]=Be(()=>Ir(e,()=>d))),P[m]=d}u=P}),w){var k=e;aa(()=>{xt(k,u.value,!0),Lr(k)})}p=!0})}function At(e){var t;return e[t=ur]??(e[t]={[ia]:e.nodeName.includes("-"),[oa]:e.namespaceURI===dr})}var Ht=new Map;function la(e){var t=e.getAttribute("is")||e.nodeName,a=Ht.get(t);if(a)return a;Ht.set(t,a=[]);for(var s,n=e,i=Element.prototype;i!==n;){s=vr(n);for(var o in s)s[o].set&&o!=="innerHTML"&&o!=="textContent"&&o!=="innerText"&&a.push(o);n=Kt(n)}return a}function Vr(e,t,a){Z&&(t==="srcset"&&Gr(e,a)||yt(e.getAttribute(t)??"",a)||br(t,e.outerHTML.replace(e.innerHTML,e.innerHTML&&"..."),String(a)))}function yt(e,t){return e===t?!0:new URL(e,document.baseURI).href===new URL(t,document.baseURI).href}function zt(e){return e.split(",").map(t=>t.trim().split(" ").filter(Boolean))}function Gr(e,t){var a=zt(e.srcset),s=zt(t);return s.length===a.length&&s.every(([n,i],o)=>i===a[o][1]&&(yt(a[o][0],n)||yt(n,a[o][0])))}function rt(e,t,a=t){var s=new WeakSet;_r(e,"input",async n=>{Z&&e.type==="checkbox"&&Rt();var i=n?e.defaultValue:e.value;if(i=ht(e)?wt(i):i,a(i),Ae!==null&&s.add(Ae),await pr(),i!==(i=t())){var o=e.selectionStart,c=e.selectionEnd,l=e.value.length;if(e.value=i??"",c!==null){var u=e.value.length;o===c&&c===l&&u>l?(e.selectionStart=u,e.selectionEnd=u):(e.selectionStart=o,e.selectionEnd=Math.min(c,u))}}}),(C&&e.defaultValue!==e.value||ot(t)==null&&e.value)&&(a(ht(e)?wt(e.value):e.value),Ae!==null&&s.add(Ae)),gr(()=>{Z&&e.type==="checkbox"&&Rt();var n=t();if(e===document.activeElement){var i=Ae;if(s.has(i))return}ht(e)&&n===wt(e.value)||e.type==="date"&&!n&&!e.value||n!==e.value&&(e.value=n??"")})}function ht(e){var t=e.type;return t==="number"||t==="range"}function wt(e){return e===""?null:+e}function Br(e=!1){const t=hr,a=t.l.u;if(!a)return;let s=()=>Ne(t.s);if(e){let n=0,i={};const o=xr(()=>{let c=!1;const l=t.s;for(const u in l)l[u]!==i[u]&&(i[u]=l[u],c=!0);return c&&n++,n});s=()=>r(o)}a.b.length&&wr(()=>{Vt(t,s),Ot(a.b)}),It(()=>{const n=ot(()=>a.m.map(mr));return()=>{for(const i of n)typeof i=="function"&&i()}}),a.a.length&&It(()=>{Vt(t,s),Ot(a.a)})}function Vt(e,t){if(e.l.s)for(const a of e.l.s)r(a);t()}async function ie(e,t={},a){return window.__TAURI_INTERNALS__.invoke(e,t,a)}var Gt;(function(e){e.WINDOW_RESIZED="tauri://resize",e.WINDOW_MOVED="tauri://move",e.WINDOW_CLOSE_REQUESTED="tauri://close-requested",e.WINDOW_DESTROYED="tauri://destroyed",e.WINDOW_FOCUS="tauri://focus",e.WINDOW_BLUR="tauri://blur",e.WINDOW_SCALE_FACTOR_CHANGED="tauri://scale-change",e.WINDOW_THEME_CHANGED="tauri://theme-changed",e.WINDOW_CREATED="tauri://window-created",e.WINDOW_SUSPENDED="tauri://suspended",e.WINDOW_RESUMED="tauri://resumed",e.WEBVIEW_CREATED="tauri://webview-created",e.DRAG_ENTER="tauri://drag-enter",e.DRAG_OVER="tauri://drag-over",e.DRAG_DROP="tauri://drag-drop",e.DRAG_LEAVE="tauri://drag-leave"})(Gt||(Gt={}));yr();/**
 * @license lucide-svelte v0.556.0 - ISC
 *
 * ISC License
 * 
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 * 
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * 
 * ---
 * 
 * The MIT License (MIT) (for portions derived from Feather)
 * 
 * Copyright (c) 2013-2023 Cole Bemis
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */const Kr={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};var qr=Er("<svg><!><!></svg>");function ct(e,t){const a=De(t,["children","$$slots","$$events","$$legacy"]),s=De(a,["name","color","size","strokeWidth","absoluteStrokeWidth","iconNode"]);ra(t,!1);let n=Se(t,"name",8,void 0),i=Se(t,"color",8,"currentColor"),o=Se(t,"size",8,24),c=Se(t,"strokeWidth",8,2),l=Se(t,"absoluteStrokeWidth",8,!1),u=Se(t,"iconNode",24,()=>[]);const b=(...E)=>E.filter((P,d,m)=>!!P&&m.indexOf(P)===d).join(" ");Br();var w=qr();Ft(w,(E,P)=>({...Kr,...s,width:o(),height:o(),stroke:i(),"stroke-width":E,class:P}),[()=>(Ne(l()),Ne(c()),Ne(o()),ot(()=>l()?Number(c())*24/Number(o()):c())),()=>(Ne(n()),Ne(a),ot(()=>b("lucide-icon","lucide",n()?`lucide-${n()}`:"",a.class)))]);var p=g(w);ze(p,1,u,na,(E,P)=>{var d=He(()=>Sr(r(P),2));let m=()=>r(d)[0],Y=()=>r(d)[1];var $=qe(),F=Ye($);Or(F,m,!0,(I,J)=>{Ft(I,()=>({...Y()}))}),A(E,$)});var k=y(p);je(k,t,"default",{}),_(w),A(e,w),sa()}function Yr(e,t){const a=De(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.556.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const s=[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5"}],["path",{d:"M3 12A9 3 0 0 0 21 12"}]];ct(e,lt({name:"database"},()=>a,{get iconNode(){return s},children:(n,i)=>{var o=qe(),c=Ye(o);je(c,t,"default",{}),A(n,o)},$$slots:{default:!0}}))}function jr(e,t){const a=De(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.556.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const s=[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"}]];ct(e,lt({name:"play"},()=>a,{get iconNode(){return s},children:(n,i)=>{var o=qe(),c=Ye(o);je(c,t,"default",{}),A(n,o)},$$slots:{default:!0}}))}function Jr(e,t){const a=De(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.556.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const s=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"}],["path",{d:"M21 3v5h-5"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"}],["path",{d:"M8 16H3v5"}]];ct(e,lt({name:"refresh-cw"},()=>a,{get iconNode(){return s},children:(n,i)=>{var o=qe(),c=Ye(o);je(c,t,"default",{}),A(n,o)},$$slots:{default:!0}}))}function Qr(e,t){const a=De(t,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.556.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const s=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}]];ct(e,lt({name:"square"},()=>a,{get iconNode(){return s},children:(n,i)=>{var o=qe(),c=Ye(o);je(c,t,"default",{}),A(n,o)},$$slots:{default:!0}}))}var Xr=R('<span class="text-sm bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full animate-pulse border border-blue-500/30"> </span>'),Zr=R('<button><span></span> <span class="font-medium text-sm"> </span></button>'),es=R('<div class="h-full flex items-center justify-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>'),ts=R('<div class="bg-[#1a1c23] p-12 rounded-xl border border-white/5 text-center"><p class="text-slate-400 mb-2">No features discovered</p> <p class="text-xs text-slate-600">Place feature binaries (.exe) in the <code class="bg-white/5 px-2 py-0.5 rounded">features/</code> directory</p></div>'),as=R('<p class="text-xs text-green-400 mt-1"> </p>'),rs=R('<p class="text-xs text-slate-600 mt-1">Stopped</p>'),ss=R('<button class="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg border border-red-500/30 transition-all flex items-center gap-2"><!> Stop</button>'),ns=R('<button class="bg-green-600/20 hover:bg-green-600/30 text-green-400 px-4 py-2 rounded-lg border border-green-500/30 transition-all flex items-center gap-2"><!> Launch</button>'),is=R('<div class="bg-[#1a1c23] p-6 rounded-xl border border-white/5 shadow-xl flex justify-between items-center"><div><h3 class="font-semibold text-lg"> </h3> <p class="text-xs text-slate-500 font-mono mt-1"> </p> <!></div> <div><!></div></div>'),os=R('<div class="grid grid-cols-1 gap-4 max-w-2xl"></div>'),ls=R('<section class="space-y-6 animate-in fade-in"><div class="flex justify-between items-center"><h2 class="text-xl font-semibold">Feature Management</h2> <button class="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 transition-all flex items-center gap-2"><!> Refresh</button></div> <!></section>'),cs=R('<section class="max-w-2xl space-y-6 animate-in fade-in"><h2 class="text-xl font-semibold mb-4">Gemini API Configuration</h2> <div class="space-y-4 bg-[#1a1c23] p-6 rounded-xl border border-white/5 shadow-xl"><div class="space-y-2"><label for="api-key" class="text-sm font-medium text-slate-400">API Key</label> <input id="api-key" type="password" placeholder="Enter Gemini API Key..." class="w-full bg-[#0f1115] border border-white/10 rounded-lg p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"/></div></div> <button class="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg active:scale-95">Save Changes</button></section>'),us=R('<span class="text-[10px] text-blue-400 font-mono mt-1 flex items-center gap-1"><!> </span>'),ds=R('<span class="text-[10px] text-slate-500 mt-1 italic">No active cache</span>'),fs=R('<div class="flex items-center justify-between p-3 bg-[#0f1115] rounded-xl border border-white/5"><div class="flex items-center gap-2 overflow-hidden"><span> </span> <span class="text-xs truncate font-medium text-slate-300"> </span></div> <button class="text-slate-600 hover:text-red-400 transition-colors p-1">x</button></div>'),vs=R('<p class="text-[10px] text-slate-600 italic text-center py-4">No sources added yet.</p>'),bs=R('<div class="bg-[#1a1c23] p-6 rounded-xl border border-white/5 shadow-xl relative group"><button class="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors">Delete</button> <div class="grid grid-cols-2 gap-6"><div class="space-y-4"><div class="space-y-2"><label class="text-sm font-medium text-slate-400">Name</label> <input class="w-full bg-[#0f1115] border border-white/10 rounded-lg p-2.5 focus:border-blue-500 outline-none transition-all"/></div></div> <div class="space-y-4"><div class="space-y-2"><label class="text-sm font-medium text-slate-400">System Prompt</label> <textarea rows="3" class="w-full bg-[#0f1115] border border-white/10 rounded-lg p-2.5 focus:border-blue-500 outline-none transition-all resize-none"></textarea></div></div> <div class="col-span-full space-y-4 pt-4 border-t border-white/5"><div class="flex justify-between items-center"><div class="flex flex-col"><label class="text-sm font-medium text-slate-400">Sources</label> <!></div> <div class="flex gap-2"><button class="text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-3 py-1.5 rounded border border-blue-500/30 transition-all disabled:opacity-50">Update Cache</button> <button class="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded border border-white/10 transition-all disabled:opacity-50">+ Add File</button> <div class="flex gap-2 items-center bg-[#0f1115] border border-white/10 rounded-lg px-2 py-1"><input placeholder="https://..." class="bg-transparent text-xs outline-none w-32"/> <button class="text-[10px] text-blue-400 hover:text-blue-300 disabled:opacity-50">Add URL</button></div></div></div> <div class="grid grid-cols-1 md:grid-cols-2 gap-3"></div> <!></div></div></div>'),_s=R('<button class="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg">Update Knowledge Base</button>'),ps=R('<section class="space-y-6 animate-in fade-in"><div class="flex justify-between items-center"><h2 class="text-xl font-semibold">Manage Knowledge Base</h2> <button class="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 transition-all">+ Add Knowledge</button></div> <div class="grid grid-cols-1 gap-6"></div> <!></section>'),gs=R('<div class="space-y-2"><label class="text-sm font-medium text-slate-400">System Prompt</label> <textarea rows="4" class="w-full bg-[#0f1115] border border-white/10 rounded-lg p-3 focus:border-blue-500 outline-none transition-all resize-none"></textarea></div>'),hs=R('<div class="space-y-2"><label class="text-sm font-medium text-slate-400">Screenshot Directory</label> <input type="text" class="w-full bg-[#0f1115] border border-white/10 rounded-lg p-3 focus:border-blue-500 outline-none transition-all"/> <p class="text-xs text-slate-500 mt-1">Folder to monitor for screenshots.</p></div>'),ws=R('<div class="space-y-2"><label class="text-sm font-medium text-slate-400">Voice Directory</label> <input type="text" class="w-full bg-[#0f1115] border border-white/10 rounded-lg p-3 focus:border-blue-500 outline-none transition-all"/> <p class="text-xs text-slate-500 mt-1">Folder to monitor for voice recordings.</p></div>'),ms=R('<p class="text-xs text-slate-600 text-center py-4">No settings available for this feature.</p>'),xs=R('<section class="max-w-2xl space-y-6 animate-in fade-in"><h2 class="text-xl font-semibold"> </h2> <div class="space-y-4 bg-[#1a1c23] p-6 rounded-xl border border-white/5 shadow-xl"><!></div> <button class="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg active:scale-95">Save Settings</button></section>'),ys=R('<div class="min-h-screen bg-[#0f1115] text-white flex flex-col font-sans"><header class="p-6 border-b border-white/10 flex justify-between items-center bg-[#1a1c23]"><h1 class="text-2xl font-bold tracking-tight">HAKS Dashboard</h1> <!></header> <div class="flex-1 flex overflow-hidden"><nav class="w-64 border-r border-white/10 p-4 space-y-2 bg-[#14161d] overflow-y-auto"><button><span class="font-medium">Features</span></button> <button><span class="font-medium">General Settings</span></button> <button><span class="font-medium">Knowledge Base</span></button> <!></nav> <main class="flex-1 overflow-auto p-8 svelte-1uha8ag"><!></main></div></div>');function As(e,t){ra(t,!0);let a=oe("features"),s=oe(Le({gemini_api_key:""})),n=oe(Le([])),i=oe(Le([])),o=oe(Le({})),c=oe(!0),l=oe(!1),u=oe(""),b=oe(""),w=oe(Le({}));async function p(){try{const v=await ie("get_feature_state");h(o,v.running,!0)}catch(v){console.error("Failed to load state:",v)}}function k(v){return v in r(o)}async function E(v){try{await ie("launch_feature",{featureId:v}),await p(),h(u,`${v} launched!`),setTimeout(()=>h(u,""),3e3)}catch(f){h(u,`Error launching ${v}: ${f}`)}}async function P(v){try{await ie("kill_feature",{featureId:v}),await p(),h(u,`${v} stopped!`),setTimeout(()=>h(u,""),3e3)}catch(f){h(u,`Error stopping ${v}: ${f}`)}}async function d(v){if(!r(w)[v])try{const f=await ie("read_feature_config",{featureId:v});h(w,{...r(w),[v]:f||{}},!0)}catch(f){console.error("Failed to load feature settings:",f)}}async function m(v){try{await ie("write_feature_config",{featureId:v,value:r(w)[v]}),h(u,"Feature settings saved!"),setTimeout(()=>h(u,""),3e3)}catch(f){h(u,`Error: ${f}`)}}async function Y(){try{await ie("save_config",{config:r(s)}),h(u,"Settings saved!"),setTimeout(()=>h(u,""),3e3)}catch(v){h(u,`Error: ${v}`)}}async function $(){try{await ie("save_knowledge",{knowledgeItems:Tr(r(n))}),h(u,"Knowledge Base updated!"),setTimeout(()=>h(u,""),3e3)}catch(v){h(u,`Error: ${v}`)}}function F(){h(n,[...r(n),{id:crypto.randomUUID(),name:"New Knowledge Base",system_prompt:"You are a helpful assistant.",sources:[],cache_name:null}],!0)}async function I(v){const{open:f}=await $a(async()=>{const{open:W}=await import("./Cny9a1v5.js");return{open:W}},[],import.meta.url),N=await f({multiple:!0,filters:[{name:"Documents",extensions:["pdf","md","txt","mp3","wav","m4a"]}]});if(N&&Array.isArray(N)){h(l,!0);try{for(const W of N){const j=await ie("process_and_add_source",{pathOrUrl:W});r(n)[v].sources=[...r(n)[v].sources,j]}h(u,"Files added!"),setTimeout(()=>h(u,""),3e3)}catch(W){h(u,`Error: ${W}`)}finally{h(l,!1)}}}async function J(v){if(r(b).trim()){h(l,!0);try{const f=await ie("process_and_add_source",{pathOrUrl:r(b)});r(n)[v].sources=[...r(n)[v].sources,f],h(b,""),h(u,"URL added!"),setTimeout(()=>h(u,""),3e3)}catch(f){h(u,`Error: ${f}`)}finally{h(l,!1)}}}function x(v,f){r(n)[v].sources.splice(f,1)}async function S(v){h(l,!0);try{const f=await ie("update_knowledge_cache",{knowledgeId:v});h(u,`Cache updated: ${f}`),h(n,await ie("list_knowledge"),!0),setTimeout(()=>h(u,""),5e3)}catch(f){h(u,`Caching failed: ${f}`)}finally{h(l,!1)}}function D(v){h(n,r(n).filter((f,N)=>N!==v),!0)}var z=ys(),T=g(z),ce=y(g(T),2);{var q=v=>{var f=Xr(),N=g(f,!0);_(f),ae(()=>be(N,r(u))),A(v,f)};ve(ce,v=>{r(u)&&v(q)})}_(T);var ge=y(T,2),_e=g(ge),xe=g(_e),ye=y(xe,2),Ee=y(ye,2),re=y(Ee,2);ze(re,17,()=>r(i),v=>v.id,(v,f)=>{var N=Zr(),W=g(N),j=y(W,2),se=g(j,!0);_(j),_(N),ae(ue=>{he(N,1,`w-full text-left p-3 rounded-lg transition-all flex items-center gap-2 ${r(a)===`feature-${r(f).id}`?"bg-blue-600 shadow-lg":"hover:bg-white/5 text-slate-400"}`),he(W,1,`w-2 h-2 rounded-full ${ue??""}`),be(se,r(f).displayName)},[()=>k(r(f).id)?"bg-green-400":"bg-slate-600"]),U("click",N,()=>{h(a,`feature-${r(f).id}`),d(r(f).id)}),A(v,N)}),_(_e);var Ce=y(_e,2),ca=g(Ce);{var ua=v=>{var f=es();A(v,f)},da=v=>{var f=ls(),N=g(f),W=y(g(N),2),j=g(W);Jr(j,{size:14}),Pe(),_(W),_(N);var se=y(N,2);{var ue=L=>{var ee=ts();A(L,ee)},ne=L=>{var ee=os();ze(ee,21,()=>r(i),de=>de.id,(de,Q)=>{var O=is(),M=g(O),V=g(M),H=g(V,!0);_(V);var X=y(V,2),Je=g(X);_(X);var Qe=y(X,2);{var Xe=K=>{var G=as(),fe=g(G);_(G),ae(()=>be(fe,`Running — PID: ${r(o)[r(Q).id].pid??""}, Port: ${r(o)[r(Q).id].port??""}`)),A(K,G)},Re=He(()=>k(r(Q).id)),Oe=K=>{var G=rs();A(K,G)};ve(Qe,K=>{r(Re)?K(Xe):K(Oe,-1)})}_(M);var Ze=y(M,2),ut=g(Ze);{var dt=K=>{var G=ss(),fe=g(G);Qr(fe,{size:14}),Pe(),_(G),U("click",G,()=>P(r(Q).id)),A(K,G)},et=He(()=>k(r(Q).id)),Ie=K=>{var G=ns(),fe=g(G);jr(fe,{size:14}),Pe(),_(G),U("click",G,()=>E(r(Q).id)),A(K,G)};ve(ut,K=>{r(et)?K(dt):K(Ie,-1)})}_(Ze),_(O),ae(()=>{be(H,r(Q).displayName),be(Je,`ID: ${r(Q).id??""}`)}),A(de,O)}),_(ee),A(L,ee)};ve(se,L=>{r(i).length===0?L(ue):L(ne,-1)})}_(f),U("click",W,p),A(v,f)},fa=v=>{var f=cs(),N=y(g(f),2),W=g(N),j=y(g(W),2);ke(j),_(W),_(N);var se=y(N,2);_(f),rt(j,()=>r(s).gemini_api_key,ue=>r(s).gemini_api_key=ue),U("click",se,Y),A(v,f)},va=v=>{var f=ps(),N=g(f),W=y(g(N),2);_(N);var j=y(N,2);ze(j,23,()=>r(n),ne=>ne.id,(ne,L,ee)=>{var de=bs(),Q=g(de),O=y(Q,2),M=g(O),V=g(M),H=y(g(V),2);ke(H),_(V),_(M);var X=y(M,2),Je=g(X),Qe=y(g(Je),2);Mt(Qe),_(Je),_(X);var Xe=y(X,2),Re=g(Xe),Oe=g(Re),Ze=y(g(Oe),2);{var ut=B=>{var te=us(),tt=g(te);Yr(tt,{size:10});var Me=y(tt);_(te),ae(()=>be(Me,` ${r(L).cache_name??""} (Cached)`)),A(B,te)},dt=B=>{var te=ds();A(B,te)};ve(Ze,B=>{r(L).cache_name?B(ut):B(dt,-1)})}_(Oe);var et=y(Oe,2),Ie=g(et),K=y(Ie,2),G=y(K,2),fe=g(G);ke(fe);var Nt=y(fe,2);_(G),_(et),_(Re);var ft=y(Re,2);ze(ft,21,()=>r(L).sources,na,(B,te,tt)=>{var Me=fs(),vt=g(Me),at=g(vt),ha=g(at,!0);_(at);var bt=y(at,2),wa=g(bt,!0);_(bt),_(vt);var ma=y(vt,2);_(Me),ae(()=>{he(at,1,`text-[10px] px-1.5 py-0.5 rounded-full ${r(te).source_type==="url"?"bg-blue-600/20 text-blue-400":"bg-green-600/20 text-green-400"} border border-current/20 uppercase`),be(ha,r(te).source_type),$e(bt,"title",r(te).path_or_url),be(wa,r(te).name)}),U("click",ma,()=>x(r(ee),tt)),A(B,Me)}),_(ft);var pa=y(ft,2);{var ga=B=>{var te=vs();A(B,te)};ve(pa,B=>{r(L).sources.length===0&&B(ga)})}_(Xe),_(O),_(de),ae(()=>{Ie.disabled=r(l)||r(L).sources.length===0,K.disabled=r(l),Nt.disabled=r(l)||!r(b)}),U("click",Q,()=>D(r(ee))),rt(H,()=>r(L).name,B=>r(L).name=B),rt(Qe,()=>r(L).system_prompt,B=>r(L).system_prompt=B),U("click",Ie,()=>S(r(L).id)),U("click",K,()=>I(r(ee))),rt(fe,()=>r(b),B=>h(b,B)),U("click",Nt,()=>J(r(ee))),A(ne,de)}),_(j);var se=y(j,2);{var ue=ne=>{var L=_s();U("click",L,$),A(ne,L)};ve(se,ne=>{r(n).length>0&&ne(ue)})}_(f),U("click",W,F),A(v,f)},ba=v=>{const f=He(()=>r(a).replace("feature-",""));var N=xs(),W=g(N),j=g(W);_(W);var se=y(W,2),ue=g(se);{var ne=O=>{var M=gs(),V=y(g(M),2);Mt(V),_(M),ae(()=>{var H;return gt(V,((H=r(w)[r(f)])==null?void 0:H.systemPrompt)??"")}),U("input",V,H=>{const X=H.currentTarget.value;h(w,{...r(w),[r(f)]:{...r(w)[r(f)],systemPrompt:X}},!0)}),A(O,M)},L=O=>{var M=hs(),V=y(g(M),2);ke(V),Pe(2),_(M),ae(()=>{var H;return gt(V,((H=r(w)[r(f)])==null?void 0:H.screenshotDir)??"")}),U("input",V,H=>{const X=H.currentTarget.value;h(w,{...r(w),[r(f)]:{...r(w)[r(f)],screenshotDir:X}},!0)}),A(O,M)},ee=O=>{var M=ws(),V=y(g(M),2);ke(V),Pe(2),_(M),ae(()=>{var H;return gt(V,((H=r(w)[r(f)])==null?void 0:H.voiceDir)??"")}),U("input",V,H=>{const X=H.currentTarget.value;h(w,{...r(w),[r(f)]:{...r(w)[r(f)],voiceDir:X}},!0)}),A(O,M)},de=O=>{var M=ms();A(O,M)};ve(ue,O=>{r(f)==="chat"?O(ne):r(f)==="vision"?O(L,1):r(f)==="voice"?O(ee,2):O(de,-1)})}_(se);var Q=y(se,2);_(N),ae(O=>be(j,`${O??""} Settings`),[()=>{var O;return((O=r(i).find(M=>M.id===r(f)))==null?void 0:O.displayName)??r(f)}]),U("click",Q,()=>m(r(f))),A(v,N)},_a=He(()=>r(a).startsWith("feature-"));ve(ca,v=>{r(c)?v(ua):r(a)==="features"?v(da,1):r(a)==="general"?v(fa,2):r(a)==="knowledge"?v(va,3):r(_a)&&v(ba,4)})}_(Ce),_(ge),_(z),ae(()=>{he(xe,1,`w-full text-left p-3 rounded-lg transition-all ${r(a)==="features"?"bg-blue-600 shadow-lg":"hover:bg-white/5 text-slate-400"}`),he(ye,1,`w-full text-left p-3 rounded-lg transition-all ${r(a)==="general"?"bg-blue-600 shadow-lg":"hover:bg-white/5 text-slate-400"}`),he(Ee,1,`w-full text-left p-3 rounded-lg transition-all ${r(a)==="knowledge"?"bg-blue-600 shadow-lg":"hover:bg-white/5 text-slate-400"}`)}),U("click",xe,()=>h(a,"features")),U("click",ye,()=>h(a,"general")),U("click",Ee,()=>h(a,"knowledge")),A(e,z),sa()}Bt(["click","input"]);export{As as _,ie as i};
