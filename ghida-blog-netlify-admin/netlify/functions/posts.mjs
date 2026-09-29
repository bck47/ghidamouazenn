import {getStore} from "@netlify/blobs";
export const config={path:"/api/posts"};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const ar=s=>s.replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);
export default async()=>{
 const all=(await getStore("blog").get("posts",{type:"json"}))||[];
 const out=all.filter(p=>p.published).sort((a,b)=>(b.date||"").localeCompare(a.date||"")).map((p,i)=>({
  id:p.id,cat:esc(p.cat),title:esc(p.title),ex:esc(p.excerpt),
  date:ar((p.date||"").replace(/-/g,"/")),
  min:Math.max(1,Math.ceil((p.body.match(/\S+/gu)||[]).length/180)),
  body:p.body.split(/\r?\n\s*\r?\n/).map(x=>x.trim()).filter(Boolean).map(esc)}));
 return new Response(JSON.stringify(out),{headers:{"content-type":"application/json","cache-control":"public, max-age=0, must-revalidate"}});
};
