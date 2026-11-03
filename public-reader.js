(() => {
const base='/energyhot/';
const edition=document.querySelector('meta[name="energyhot-release"]')?.content;
if(edition){
 const refresh=()=>{
  if(document.visibilityState==='hidden')return;
  fetch(base+'release.json?check='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():null).then(next=>{
   if(next?.release_id&&next.release_id!==edition){
    const url=new URL(location.href);url.searchParams.set('_r',next.release_id);location.replace(url);
   }
  }).catch(()=>{});
 };
 setInterval(refresh,60000);document.addEventListener('visibilitychange',refresh);
}
document.querySelectorAll('input#site-search').forEach(field=>field.addEventListener('keydown',event=>{
 if(event.key==='Enter'){
  event.preventDefault();location.assign(base+'search/?q='+encodeURIComponent(field.value.trim()));
 }
}));
document.querySelectorAll('.eh-density button').forEach((b,i)=>b.addEventListener('click',()=>{
 document.querySelector('.eh-shell')?.classList.toggle('eh-compact',i===0);
 document.querySelectorAll('.eh-density button').forEach((x,j)=>x.setAttribute('aria-pressed',String(i===j)));
}));
document.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',()=>history.length>1?history.back():location.assign(base+'all/')));
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{
 try{await navigator.clipboard.writeText(location.href);b.textContent='已复制链接';}catch{b.textContent='请复制地址栏链接';}
}));
document.querySelectorAll('[role=radio]').forEach(b=>b.addEventListener('click',()=>{
 const label=b.getAttribute('title')||b.textContent;
 document.documentElement.classList.toggle('dark',label.includes('深色')||(label.includes('系统')&&matchMedia('(prefers-color-scheme: dark)').matches));
 document.querySelectorAll('[role=radio]').forEach(x=>x.setAttribute('aria-checked',String(x===b)));
}));
const box=document.getElementById('public-search-results');
if(!box)return;
const q=(new URLSearchParams(location.search).get('q')||'').trim().slice(0,200);
const field=document.querySelector('input[name=q]');if(field)field.value=q;
if(!q){box.textContent='输入企业、项目或关键词，搜索本次同步的已编辑资讯。';return;}
fetch(base+'search-index.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(items=>{
 const terms=q.toLocaleLowerCase().split(/\s+/).filter(Boolean);
 const found=items.filter(x=>terms.every(t=>[x.title,x.summary,x.sourceName,...x.tags].join(' ').toLocaleLowerCase().includes(t)));
 box.textContent='找到 '+found.length+' 条已编辑资讯。';
 for(const item of found){
  const article=document.createElement('article');article.style.cssText='padding:20px 0;border-bottom:1px solid var(--line,#ddd)';
  const time=document.createElement('p');time.textContent=item.sourceName+' · '+(item.publishedAt?new Date(item.publishedAt).toLocaleDateString('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}):'日期待核');
  const h=document.createElement('h2');const a=document.createElement('a');a.href=base+'items/'+encodeURIComponent(item.id)+'/';a.textContent=item.title;h.append(a);
  const p=document.createElement('p');p.textContent=item.summary||'';article.append(time,h,p);box.append(article);
 }
}).catch(()=>{box.textContent='搜索内容暂时未加载成功，请刷新或返回资讯流浏览。';});
})();
