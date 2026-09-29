import {getStore} from "@netlify/blobs";
import {createHmac,timingSafeEqual,randomUUID} from "node:crypto";
export const config={path:"/api/admin"};
const J=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{"content-type":"application/json"}});
const secret=()=>process.env.SESSION_SECRET||process.env.ADMIN_PASSWORD||"";
const sign=e=>createHmac("sha256",secret()).update(String(e)).digest("hex");
const eq=(a,b)=>{const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y)};
const valid=t=>{const [e,s]=(t||"").split(".");return !!(e&&s&&+e>Date.now()&&eq(s,sign(e)))};
export default async req=>{
 if(req.method!=="POST")return J({error:"method"},405);
 if(!process.env.ADMIN_PASSWORD)return J({error:"ADMIN_PASSWORD غير مضبوط في Netlify"},500);
 let b;try{b=await req.json()}catch{return J({error:"bad request"},400)}
 if(b.action==="login"){
  if(eq(String(b.password||""),process.env.ADMIN_PASSWORD)){const e=Date.now()+7*864e5;return J({token:e+"."+sign(e)})}
  await new Promise(r=>setTimeout(r,800));return J({error:"كلمة السر غير صحيحة"},401);
 }
 if(!valid((req.headers.get("authorization")||"").replace("Bearer ","")))return J({error:"auth"},401);
 const store=getStore("blog");let posts=(await store.get("posts",{type:"json"}))||[];
 if(b.action==="save"){
  const p=b.post||{},title=String(p.title||"").trim().slice(0,255),body=String(p.body||"").trim();
  if(!title||!body)return J({error:"العنوان والنص مطلوبان"},400);
  const rec={id:p.id||randomUUID(),title,cat:String(p.cat||"").trim().slice(0,60)||"عام",excerpt:String(p.excerpt||"").trim().slice(0,400),body,
   published:!!p.published,date:/^\d{4}-\d{2}-\d{2}$/.test(p.date||"")?p.date:new Date().toISOString().slice(0,10)};
  const i=posts.findIndex(x=>x.id===rec.id);i>=0?posts[i]=rec:posts.push(rec);
  await store.setJSON("posts",posts);
 }else if(b.action==="delete"){
  posts=posts.filter(x=>x.id!==b.id);await store.setJSON("posts",posts);
 }else if(b.action!=="list")return J({error:"unknown"},400);
 return J(posts.sort((a,c)=>(c.date||"").localeCompare(a.date||"")));
};
