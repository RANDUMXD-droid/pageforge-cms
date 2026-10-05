const DB={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))};
const uid=()=>Math.random().toString(36).slice(2,9);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=(s,r=document)=>r.querySelector(s);
const home=r=>r==='admin'?'admin.html':'user.html';
// dark mode
const themeIcon=(dark)=>`
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    ${dark ? '<path d="M12 2.75a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V3.75a1 1 0 0 1 1-1Zm0 16.5a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0v-1.5a1 1 0 0 1 1-1ZM4.93 4.93a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 1 1-1.41 1.41L4.93 6.34a1 1 0 0 1 0-1.41Zm11.65 11.65a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 1 1-1.41 1.41l-1.06-1.06a1 1 0 0 1 0-1.41ZM2 11a1 1 0 0 1 1-1h1.5a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Zm16.5 0a1 1 0 0 1 1-1H21a1 1 0 1 1 0 2h-1.5a1 1 0 0 1-1-1ZM4.93 18.66a1 1 0 0 1 0-1.41l1.06-1.06a1 1 0 1 1 1.41 1.41l-1.06 1.06a1 1 0 0 1-1.41 0Zm11.65-11.65a1 1 0 0 1 0-1.41l1.06-1.06a1 1 0 1 1 1.41 1.41l-1.06 1.06a1 1 0 0 1-1.41 0ZM12 6.5A5.5 5.5 0 1 1 12 17.5A5.5 5.5 0 0 1 12 6.5Z" fill="currentColor"/>' : '<path d="M20.4 15.2A8.5 8.5 0 0 1 8.8 3.6a8.5 8.5 0 1 0 11.6 11.6Z" fill="currentColor"/>' }
  </svg>`;
const setDark=v=>{document.documentElement.setAttribute('data-dark',v?'1':'0');const vars=v?{ '--bg':'#000','--bg2':'#101010','--ink':'#f3f3f3','--mut':'#b6b6b6','--line':'#2a2a2a','--card':'#111','--acc':'#22c6a0','--acc2':'#18a98a','--warn':'#ffbd45','--bad':'#ff6b6b' }:{ '--bg':'#f3f5f7','--bg2':'#e8ecf0','--ink':'#14213d','--mut':'#5c6b80','--line':'#d9e0e7','--card':'#fff','--acc':'#0f8f7e','--acc2':'#0b6e61','--warn':'#c98a0a','--bad':'#c93d3d' };Object.entries(vars).forEach(([k,val])=>document.documentElement.style.setProperty(k,val));document.documentElement.style.backgroundColor=v?'#000':'#f3f5f7';document.body.style.backgroundColor=v?'#000':'#f3f5f7';document.body.style.color=v?'#f3f3f3':'#14213d';document.querySelectorAll('.theme-tog').forEach(t=>{t.dataset.mode=v?'sun':'moon';t.innerHTML=themeIcon(v);});document.querySelectorAll('.topbar a, #out, #out2').forEach(a=>{a.style.color=v?'#f3f3f3':'#14213d';});document.querySelectorAll('.side a').forEach(a=>{a.style.color=v?'#f3f3f3':'#cfd9e8';});document.querySelectorAll('.panel a, .btn').forEach(a=>{a.style.color=v?'#f3f3f3':'#14213d';a.style.backgroundColor=v?'#111':'#fff';});DB.set('dark',v)};
const getDark=()=>DB.get('dark',false);
if(getDark())setDark(true);
// seed default data
if(!DB.get('users',[]).length)DB.set('users',[{id:uid(),name:'Admin',email:'admin@cms.com',pass:'admin123',role:'admin'}]);
if(!DB.get('comments'))DB.set('comments',{});
if(!DB.get('versions'))DB.set('versions',{});
const me=()=>DB.get('users',[]).find(u=>u.id===localStorage.getItem('session'));
function guard(role){const u=me();if(!u){location.href='index.html';return}if(role&&u.role!==role){location.href=home(u.role);return}return u}
function logout(){localStorage.removeItem('session');location.href='index.html'}
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.append(d);setTimeout(()=>d.remove(),2200)}
const slugify=s=>s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const getPages=()=>DB.get('pages',[]),savePages=p=>{DB.set('pages',p);},savePage=(p)=>{const ps=getPages(),i=ps.findIndex(x=>x.id===p.id);if(i<0)ps.push(p);else ps[i]=p;savePages(ps)};
const fmt=t=>new Date(t).toLocaleString();
const fmtDate=t=>{const d=new Date(t);return d.getFullYear()+'-'+(d.getMonth()+1+'').padStart(2,'0')+'-'+(d.getDate()+'').padStart(2,'0')+'T'+(d.getHours()+'').padStart(2,'0')+':'+(d.getMinutes()+'').padStart(2,'0')};
// version tracking
function saveVersion(pageId,data){const vs=DB.get('versions',{});if(!vs[pageId])vs[pageId]=[];vs[pageId].push({id:uid(),title:data.title,updated:Date.now(),blocks:data.blocks.length});DB.set('versions',vs)}
function getVersions(pageId){return DB.get('versions',{})[pageId]||[]}
// comments
function addComment(pageId,text){const cs=DB.get('comments',{});if(!cs[pageId])cs[pageId]=[];cs[pageId].push({id:uid(),author:(me()||{}).name||'Anonymous',text,time:Date.now()});DB.set('comments',cs)}
function getComments(pageId){return DB.get('comments',{})[pageId]||[]}
// block rendering
const BLOCKS=['heading','paragraph','image','button','quote','divider','gallery','video','code','callout'];
function renderPage(p){
 const b=p.blocks.map(x=>{const t=esc(x.text);switch(x.type){
  case'heading':return`<h2>${renderRichText(x.text)}</h2>`;
  case'paragraph':return`<p>${renderRichText(x.text)}</p>`;
  case'quote':return`<blockquote>${renderRichText(x.text)}</blockquote>`;
  case'image':return x.url?`<img src="${esc(x.url)}" alt="${esc(x.text)}">`:'';
  case'button':return`<a class="cta" href="${/^https?:/.test(x.url)?esc(x.url):'#'}" target="_blank" rel="noopener">${t||'Click'}</a>`;
  case'divider':return'<hr>';
  case'gallery':const imgs=(x.gallery||'').split('\n').filter(Boolean);return imgs.length?`<div class="gallery">${imgs.map(i=>`<img src="${esc(i)}" alt="">`).join('')}</div>`:'';
  case'video':return x.url?`<iframe width="100%" height="360" src="${esc(x.url)}" frameborder="0" allow="autoplay;encrypted-media" allowfullscreen></iframe>`:'';
  case'code':return`<pre><code>${esc(x.text)}</code></pre>`;
  case'callout':return`<div class="callout"><strong>${esc(x.label||'Note')}:</strong> ${renderRichText(x.text)}</div>`;
  }return''}).join('');
 return`<article class="tpl tpl-${p.template}"><h1>${esc(p.title)}</h1>${b}</article>`}
function renderRichText(s){return(s||'').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/_(.*?)_/g,'<em>$1</em>').replace(/\[(.*?)\]\((https?:\/\/.*?)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>')}
// SEO checks
function seoCheck(p){
 const w=p.blocks.filter(b=>['paragraph','heading','quote','callout'].includes(b.type)).map(b=>b.text).join(' ').split(/\s+/).filter(Boolean).length;
 const s=p.seo,kw=(s.keywords||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
 const c=[[s.title.length>=30&&s.title.length<=60,'SEO title is 30–60 characters'],[s.desc.length>=70&&s.desc.length<=160,'Meta description is 70–160 characters'],
 [kw.length>=2,'At least 2 keywords'],[kw.length>0&&kw.some(k=>p.title.toLowerCase().includes(k)),'A keyword appears in the page title'],
 [p.blocks.some(b=>b.type==='heading'),'Page has a heading block'],[w>=50,'Content has 50+ words ('+w+')'],[!!p.slug,'URL slug is set']];
 return{list:c,score:Math.round(c.filter(x=>x[0]).length/c.length*100)}}
// templates
const TEMPLATES={classic:{title:'Classic',html:'<h1>{{title}}</h1><p>Your content here.</p>'},modern:{title:'Modern',html:'<h1>{{title}}</h1><p>Start writing…</p>'},bold:{title:'Bold',html:'<h1>{{title}}</h1><p>Make an impact.</p>'}};
const STARTERS={blog:{title:'Blog Post',blocks:[{id:uid(),type:'heading',text:'Introduction',url:'',gallery:'',label:'',video:''},{id:uid(),type:'paragraph',text:'Write your opening paragraph here.',url:'',gallery:'',label:'',video:''},{id:uid(),type:'heading',text:'Main Section',url:'',gallery:'',label:'',video:''},{id:uid(),type:'paragraph',text:'Add your main content.',url:'',gallery:'',label:'',video:''}]},product:{title:'Product Page',blocks:[{id:uid(),type:'heading',text:'What We Offer',url:'',gallery:'',label:'',video:''},{id:uid(),type:'image',text:'Product image',url:'',gallery:'',label:'',video:''},{id:uid(),type:'paragraph',text:'Describe your product and its benefits.',url:'',gallery:'',label:'',video:''},{id:uid(),type:'button',text:'Learn More',url:'https://example.com',gallery:'',label:'',video:''}]},gallery:{title:'Photo Gallery',blocks:[{id:uid(),type:'heading',text:'Our Work',url:'',gallery:'',label:'',video:''},{id:uid(),type:'gallery',text:'',url:'',gallery:'https://via.placeholder.com/300\nhttps://via.placeholder.com/300\nhttps://via.placeholder.com/300',label:'',video:''}]}};
// editor mount
function mountEditor(el,page,actions,onAction){
 const pg=structuredClone(page);
 el.innerHTML=`<div class="editor"><aside class="palette"><h4>Drag a block</h4>${BLOCKS.map(b=>`<div class="pal" draggable="true" data-t="${b}">${b}</div>`).join('')}</aside>
 <section class="canvas-wrap"><div class="g2"><label>Page title<input id="e-t" maxlength="90"></label><label>Template<select id="e-tpl"><option value="classic">Classic</option><option value="modern">Modern</option><option value="bold">Bold</option></select></label></div>
 <div id="cv" class="canvas"></div><div id="pv"></div></section>
 <aside class="eside"><h4>Publishing</h4><label>URL slug<input id="e-sl"></label><label>Publish date<input id="e-pd" type="datetime-local"></label>
 <h4 style="margin-top:14px">SEO</h4><label>Title<input id="e-st"></label><label>Description<textarea id="e-sd" rows="3"></textarea></label><label>Keywords<input id="e-sk"></label>
 <div class="score" id="sc"></div><ul class="seo" id="sl" style="padding:0"></ul><div class="row" style="margin-top:10px"><button id="e-pv" class="sm">Preview</button>${actions.map(a=>`<button class="sm ${a.pri?'pri':''}" data-a="${a.id}">${a.label}</button>`).join('')}</div></aside></div>`;
 const cv=$('#cv',el);let slugTouched=!!pg.slug;
 $('#e-t',el).value=pg.title;$('#e-tpl',el).value=pg.template;$('#e-sl',el).value=pg.slug;$('#e-st',el).value=pg.seo.title;$('#e-sd',el).value=pg.seo.desc;$('#e-sk',el).value=pg.seo.keywords;
 if(pg.publishDate)$('#e-pd',el).value=fmtDate(pg.publishDate);
 const sync=()=>{pg.title=$('#e-t',el).value;pg.template=$('#e-tpl',el).value;pg.slug=slugify($('#e-sl',el).value);pg.publishDate=$('#e-pd',el).value?new Date($('#e-pd',el).value).getTime():null;pg.seo={title:$('#e-st',el).value,desc:$('#e-sd',el).value,keywords:$('#e-sk',el).value};
  const r=seoCheck(pg);$('#sc',el).textContent='SEO score '+r.score+'%';$('#sl',el).innerHTML=r.list.map(x=>`<li class="${x[0]?'ok':'no'}">${x[1]}</li>`).join('')};
 el.addEventListener('input',e=>{if(e.target.id==='e-t'&&!slugTouched){$('#e-sl',el).value=slugify(e.target.value)}if(e.target.id==='e-sl')slugTouched=true;sync()});
 function draw(){cv.innerHTML=pg.blocks.map((b,i)=>`<div class="blk" data-i="${i}"><span class="hd" draggable="true">⋮⋮</span><div class="f"><b>${b.type}</b>${renderBlockEdit(b,i)}</div><button class="sm dng" data-del="${i}">✕</button></div>`).join('');sync()}
 function renderBlockEdit(b,i){const rt=v=>`<div class="rt-bar"><button data-b="b" data-i="${i}" type="button">B</button><button data-b="i" data-i="${i}" type="button">I</button><button data-b="l" data-i="${i}" type="button">🔗</button></div>`;
  switch(b.type){
   case'divider':return'<span style="color:var(--mut)">Horizontal line</span>';
   case'image':return`<input data-k="url" placeholder="Image URL" value="${esc(b.url)}"><input data-k="text" placeholder="Alt text" value="${esc(b.text)}">`;
   case'button':return`<input data-k="text" placeholder="Button label" value="${esc(b.text)}"><input data-k="url" placeholder="Link" value="${esc(b.url)}">`;
   case'gallery':return`<textarea data-k="gallery" rows="3" placeholder="Image URLs, one per line">${esc(b.gallery)}</textarea>`;
   case'video':return`<input data-k="url" placeholder="YouTube/Vimeo embed URL" value="${esc(b.url)}">`;
   case'code':return`<textarea data-k="text" rows="4" placeholder="Code here" style="font-family:monospace">${esc(b.text)}</textarea>`;
   case'callout':return`<input data-k="label" placeholder="Note type (e.g. Warning)" value="${esc(b.label)}"><textarea data-k="text" rows="2" placeholder="Message">${esc(b.text)}</textarea>`;
   default:return rt()+`<textarea data-k="text" rows="${b.type==='paragraph'?3:2}" placeholder="Write here…">${esc(b.text)}</textarea>`;
  }}
 cv.addEventListener('input',e=>{const i=e.target.closest('.blk')?.dataset.i;if(i!=null&&e.target.dataset.k){pg.blocks[i][e.target.dataset.k]=e.target.value;sync()}});
 cv.addEventListener('click',e=>{
  if(e.target.dataset.del!=null){pg.blocks.splice(+e.target.dataset.del,1);draw()}
  const bf=e.target.dataset.b,bi=e.target.dataset.i;if(bf&&bi!=null){const txt=$('[data-i="'+bi+'"] textarea',cv);if(txt){const s=txt.selectionStart,e=txt.selectionEnd,t=txt.value,sel=t.slice(s,e);const reps={b:'**'+sel+'**',i:'_'+sel+'_',l:'[text](https://example.com)'};txt.value=t.slice(0,s)+reps[bf]+t.slice(e);txt.focus();sync()}}});
 el.addEventListener('dragstart',e=>{const p=e.target.closest('.pal'),h=e.target.closest('.hd');
  if(p)e.dataTransfer.setData('text/plain','new:'+p.dataset.t);else if(h){const b=h.closest('.blk');e.dataTransfer.setData('text/plain','mv:'+b.dataset.i);e.dataTransfer.setDragImage(b,0,0)}});
 cv.addEventListener('dragover',e=>{e.preventDefault();cv.classList.add('over');cv.querySelectorAll('.drop').forEach(x=>x.classList.remove('drop'));e.target.closest('.blk')?.classList.add('drop')});
 cv.addEventListener('dragleave',e=>{if(e.target===cv)cv.classList.remove('over')});
 cv.addEventListener('drop',e=>{e.preventDefault();cv.classList.remove('over');const tg=e.target.closest('.blk'),to=tg?+tg.dataset.i:pg.blocks.length,d=e.dataTransfer.getData('text/plain');
  if(d.startsWith('new:'))pg.blocks.splice(to,0,{id:uid(),type:d.slice(4),text:'',url:'',gallery:'',label:'',video:''});
  else if(d.startsWith('mv:')){const from=+d.slice(3),[m]=pg.blocks.splice(from,1);pg.blocks.splice(from<to?to-1:to,0,m)}draw()});
 $('#e-pv',el).onclick=()=>{sync();$('#pv',el).innerHTML=`<div class="prev">${renderPage(pg)}</div>`};
 el.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{sync();if(!pg.title.trim())return toast('Add a page title first');if(!pg.slug)pg.slug=slugify(pg.title);saveVersion(pg.id,pg);onAction(b.dataset.a,pg)});
 draw()}
const newPage=u=>({id:uid(),title:'',slug:'',template:'classic',blocks:[],seo:{title:'',desc:'',keywords:''},status:'draft',authorId:u.id,author:u.name,views:0,updated:Date.now(),publishDate:null,note:'',comments:[]});
