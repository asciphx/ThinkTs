import { Context } from "koa";import { vType } from "../config";
export abstract class Controller {
  [x: string]: any;
  add(...arg):void;
  add(ctx:Context) {const {$}=this;
    let {body}=ctx.request;if(Object.getOwnPropertyNames(body).toString()==="")return;let O=Object.keys(vType[$]);
    let l=0,b=Object.keys(body).filter(v=>O.includes(v)?true:l=1),i=0;
    if(l===0)b=b.sort();else{ctx.status=422;b=O=body=null;return `Invalid field!`;}
    for (let p of O){
      if(p===b[i]){
        if(body[p].length>vType[$][p]){
          ctx.status=422;b=O=body=null;return `The length of the field[${p}] is 0 to ${vType[$][p]}`;
        }
        ++i;
      }else if(b[i]===undefined)++i;
    }b=O=null;
    return this.save(body).next().value;
  }
  del(...arg):void;
  del(ctx:Context) {
    return this.remove(ctx.params.id).next().then(r=>r.value);
  }
  fix(...arg):void;
  fix(ctx:Context) {const {$}=this;
    let {body}=ctx.request;if(Object.getOwnPropertyNames(body).toString()==="")return;let O=Object.keys(vType[$]);
    let l=0,b=Object.keys(body).filter(v=>O.includes(v)?true:l=1),i=0;
    if(l===0)b=b.sort();else{ctx.status=422;b=O=body=null;return `Invalid field!`};
    for (let p of O){
      if(p===b[i]){
        if(body[p].length>vType[$][p]){
          ctx.status=422;b=O=body=null;return `The length of the field[${p}] is 0 to ${vType[$][p]}`;
        }
        ++i;
      }else if(b[i]===undefined)++i;
    }b=O=null;
    return this.update(ctx.params.id, body).next().value;
  }
  info(...arg):void;
  info(ctx:Context) {
    return this.findOne(ctx.params.id).next().value;
  }
  page(...arg):void;
  page(ctx:Context) {
    return this.list(ctx.query).next().then(r=>r.value);
  }
}