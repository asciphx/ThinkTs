import { Context } from "koa";import { vType } from "../config";
const pageField=["page","size"];
export abstract class Controller {
  [x: string]: any;
  private _add(ctx: Context) {
    let {body}=ctx.request;if(Object.getOwnPropertyNames(body).toString()==="")return;let O=Object.keys(vType[this.$]);
    let l=0,b=Object.keys(body).filter(v=>O.includes(v)?true:l=1),i=0;
    if(l===0)b=b.sort();else{ctx.status=422;b=O=body=null;return `Invalid field!`;}
    for (let p of O){
      if(p===b[i]){
        if(body[p].length>vType[this.$][p]){
          ctx.status=422;b=O=body=null;return `The length of the field[${p}] is 0 to ${vType[this.$][p]}`;
        }
        ++i;
      }else if(b[i]===undefined)++i;
    }b=O=null;
    return this._save(body);
  }
  private _del(ctx: Context) {
    return this._remove(ctx.params.id);
  }
  private _fix(ctx: Context) {
    let {body}=ctx.request;if(Object.getOwnPropertyNames(body).toString()==="")return;let O=Object.keys(vType[this.$]);
    let l=0,b=Object.keys(body).filter(v=>O.includes(v)?true:l=1),i=0;
    if(l===0)b=b.sort();else{ctx.status=422;b=O=body=null;return `Invalid field!`};
    for (let p of O){
      if(p===b[i]){
        if(body[p].length>vType[this.$][p]){
          ctx.status=422;b=O=body=null;return `The length of the field[${p}] is 0 to ${vType[this.$][p]}`;
        }
        ++i;
      }else if(b[i]===undefined)++i;
    }b=O=null;
    return this._update(ctx.params.id, body);
  }
  private _info(ctx: Context) {
    let v = this._findOne(ctx.params.id);
    if (!v) { ctx.status = 404; return "Not Found"; }
    return v;
  }
  private _page(ctx: Context) {
    let {query}=ctx,b=Object.keys(query).sort(),i=0;
    for (let p of pageField){
      if(p===b[i]){
        if(query[p].length>vType[this.$][p]){
          ctx.status=422;b=query=null;return `The length of the field[${p}] is 0 to ${vType[this.$][p]}`;
        }
        ++i;
      }else if(b[i]===undefined)++i;
    }b=null;
    return this._list(ctx.query);
  }
}