export type Verification='VERIFIED'|'PARTIALLY_VERIFIED'|'INFERRED'|'UNKNOWN'|'REQUIRES_VERIFICATION';
export type LeadInput={industry?:string;buyerType?:string;productRelevant?:boolean;country?:string;commodityDemand?:boolean;importActivity?:boolean;scale?:number;opens?:number;replies?:number;clicks?:number;relationship?:boolean;meeting?:boolean;verifiedCompany?:boolean;verifiedContact?:boolean;verifiedDecisionMaker?:boolean};
export type ScoreWeights={fit:number;commercial:number;engagement:number;relationship:number;dataQuality:number};
export const defaultWeights:ScoreWeights={fit:25,commercial:30,engagement:20,relationship:10,dataQuality:15};
export function scoreLead(x:LeadInput,w=defaultWeights){
 const fit=((x.country==='Saudi Arabia'?0.35:0)+(x.productRelevant?0.4:0)+(x.buyerType?0.25:0))*w.fit;
 const commercial=((x.commodityDemand?0.35:0)+(x.importActivity?0.35:0)+Math.min(1,(x.scale||0)/100)*0.3)*w.commercial;
 const engagement=(Math.min(1,(x.opens||0)/3)*0.2+Math.min(1,(x.clicks||0)/2)*0.3+(x.replies?0.5:0))*w.engagement;
 const relationship=((x.relationship?0.4:0)+(x.meeting?0.6:0))*w.relationship;
 const quality=((x.verifiedCompany?0.3:0)+(x.verifiedContact?0.35:0)+(x.verifiedDecisionMaker?0.35:0))*w.dataQuality;
 const dimensions={fit:Math.round(fit),commercial:Math.round(commercial),engagement:Math.round(engagement),relationship:Math.round(relationship),dataQuality:Math.round(quality)};
 const total=Math.max(0,Math.min(100,Object.values(dimensions).reduce((a,b)=>a+b,0)));
 return {total,label:total>=85?'Priority':total>=70?'Hot':total>=50?'Warm':total>=30?'Low':'Cold',dimensions};
}
export type SegmentRule={field:string;operator:'eq'|'neq'|'contains'|'gt'|'gte'|'lt'|'in';value:unknown};
export function matchesSegment(record:Record<string,unknown>,rules:SegmentRule[],mode:'AND'|'OR'='AND'){
 const checks=rules.map(r=>{const v=record[r.field];switch(r.operator){case'eq':return v===r.value;case'neq':return v!==r.value;case'contains':return String(v||'').toLowerCase().includes(String(r.value).toLowerCase());case'gt':return Number(v)>Number(r.value);case'gte':return Number(v)>=Number(r.value);case'lt':return Number(v)<Number(r.value);case'in':return Array.isArray(r.value)&&r.value.includes(v);}});return mode==='AND'?checks.every(Boolean):checks.some(Boolean);
}
export type ContactPolicy={suppressed:boolean;unsubscribed:boolean;bounced:boolean;cooldownUntil?:Date|null;sentLast24h:number;dailyLimit:number;hasApprovedChannel:boolean;hasVerifiedAddress:boolean};
export function campaignEligibility(p:ContactPolicy){const reasons:string[]=[];if(p.suppressed)reasons.push('SUPPRESSED');if(p.unsubscribed)reasons.push('UNSUBSCRIBED');if(p.bounced)reasons.push('BOUNCED');if(p.cooldownUntil&&p.cooldownUntil>new Date())reasons.push('COOLDOWN');if(p.sentLast24h>=p.dailyLimit)reasons.push('FREQUENCY_LIMIT');if(!p.hasApprovedChannel)reasons.push('CHANNEL_NOT_APPROVED');if(!p.hasVerifiedAddress)reasons.push('ADDRESS_UNVERIFIED');return {eligible:reasons.length===0,reasons};}
export function classifyResponse(text:string){const t=text.toLowerCase();const rules:[string,string[]][]=[['DO_NOT_CONTACT',['do not contact','unsubscribe','remove me']],['REQUEST_FOR_QUOTATION',['quotation','quote','rfq','pricing']],['REQUEST_FOR_MEETING',['meeting','call next week','schedule a call']],['INTERESTED',['interested','send details','more information']],['NOT_INTERESTED',['not interested','no thank you']],['WRONG_CONTACT',['wrong person','not responsible']],['OUT_OF_OFFICE',['out of office','annual leave']],['LATER',['later','next quarter','not now']]];for(const [label,terms] of rules)if(terms.some(x=>t.includes(x)))return {label,confidence:label==='DO_NOT_CONTACT'?1:.86,requiresHumanReview:!['DO_NOT_CONTACT','OUT_OF_OFFICE'].includes(label)};return {label:'UNCLEAR',confidence:.35,requiresHumanReview:true};}
export type AutomationEvent={type:string,payload:Record<string,unknown>};
export type Workflow={id:string,active:boolean,trigger:string,conditions?:SegmentRule[],actions:{type:string;config?:Record<string,unknown>}[]};
export function evaluateWorkflows(event:AutomationEvent,workflows:Workflow[]){return workflows.filter(w=>w.active&&w.trigger===event.type&&matchesSegment(event.payload,w.conditions||[])).map(w=>({workflowId:w.id,actions:w.actions,status:'QUEUED' as const,idempotencyKey:`${w.id}:${String(event.payload.id||'global')}:${event.type}`}));}
