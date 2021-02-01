import { Context,Middleware } from "koa";import date from "./utils/date";import { createHash } from 'crypto';
import { Conf } from "./config";import * as multer from '@koa/multer';import * as fs from "fs";
const U = multer({dest:Conf.upload,limits:{fieldNameSize:100,fieldSize:524288,fileSize:2097152}//2097152=2mb
});//U.single(uploadFile:string)上传文件的field  U.fields(arr:Array<{name:string,maxCount:number}>)
const W = {
  async Log(ctx: Context, next){
    const start = Date.now();await next();
    console.log(`\x1B[34;1;4m${ctx.method}\x1B[0;96m${ctx.url} \x1B[95mused ${Date.now() - start}ms ->\x1B[92m${date.date2str()}`);
  },
  //先使用U.single中间件，然后使用W.pic把实体类中对应的字段补充上文件路径
  pic(field:string):Middleware {
    return async (ctx: any, next) => {
      if (ctx.request.file) {let {request}=ctx,path=Conf.upload+'/'+request.file.filename;
        let newpath=Conf.upload+"/"+createHash("md5").update(fs.readFileSync(path)).digest("hex")
          +(request.file.size/19|0)+"."+request.file.mimetype.split('/')[1];
        if(!fs.existsSync(newpath)){fs.rename(path,newpath,e=>{return e});}else fs.unlinkSync(path)
        request.body[field]=newpath.slice(String(Conf.upload).length + 1);request=null;
      }else ctx.request.body[field]!==undefined&&delete ctx.request.body[field]
      await next();
    }
  },
  /*Verify链式校验，V_B/V_Q分别校验body/query，非全检测，只要遇到错的就弹出，省开销
   *O是Valid字段，L代表length，R为是否必填(|0或不写是可选字段)[|1表示必填]未填是Invalid字段
   *name#5表示字段为name长度为0~5非必填，如果有则检验长度，现在可顺带着过滤无效字段*/
  V_B:(...a:Array<string>):Middleware=>{const O=[""],R=[0],L0=[0],L1=[0];let L=[]
    a.sort().forEach((v, i) => {
      O[i] = v.replace(/[0-9~#|]+/g, ""),
      L[i] = v.match(/((#)=?)(\d+\~\d+|\d+)/)?.[3].match(/\d+/g),
      R[i] = Number(v.match(/((\|)=?)(\d+)/)?.[3])||0,
      L[i]&&(L[i].length===1?(L0[i]=0,L1[i]=Number(L[i][0])):(L0[i]=Number(L[i][0]),L1[i]=Number(L[i][1])))
    });a=L=null;
    return async (ctx: Context, next) => {
      let c=ctx.request.body,l=0,b=Object.keys(c).filter(v => O.includes(v)?true:l=1),i=0;
      if(l===0)b=b.sort();else{ctx.status=422;ctx.body=`Invalid field!`;b=c=null;return};
      for (let p of O) {
        if(p===b[i]){
          if(L1[l])
            if(L0[l]>c[p].length||c[p].length>L1[l]){
              ctx.status=422;ctx.body=`The length of the field[${p}] is ${L0[l]} to ${L1[l]}`;b=c=null;return
            }
          ++i;
        }else if(R[l]===1){
          ctx.status = 412;ctx.body = `The field[${p}] isn't null`;b=c=null;return
        }else if(R[i]===0&&b[i]===undefined)++i;++l
      }b=c=null;
      await next();
    }
  },
  V_Q:(...a:Array<string>):Middleware=>{const O=[""],R=[0],L0=[0],L1=[0];let L=[]
    a.sort().forEach((v, i) => {
      O[i] = v.replace(/[0-9~#|]+/g, ""),
      L[i] = v.match(/((#)=?)(\d+\~\d+|\d+)/)?.[3].match(/\d+/g),
      R[i] = Number(v.match(/((\|)=?)(\d+)/)?.[3])||0,
      L[i]&&(L[i].length===1?(L0[i]=0,L1[i]=Number(L[i][0])):(L0[i]=Number(L[i][0]),L1[i]=Number(L[i][1])))
    });a=L=null;
    return async (ctx: Context, next) => {
      let c=ctx.query,l=0,b=Object.keys(c).filter(v => O.includes(v)?true:l=1),i=0;
      if(l===0)b=b.sort();else{ctx.status=422;ctx.body=`Invalid field!`;b=c=null;return};
      for (let p of O) {
        if(p===b[i]){
          if(L1[l])
            if(L0[l]>c[p].length||c[p].length>L1[l]){
              ctx.status=422;ctx.body=`The length of the field[${p}] is ${L0[l]} to ${L1[l]}`;b=c=null;return
            }
          ++i;
        }else if(R[l]===1){
          ctx.status = 412;ctx.body = `The field[${p}] isn't null`;b=c=null;return
        }else if(R[i]===0&&b[i]===undefined)++i;++l
      }b=c=null;
      await next();
    }
  }
}
export { U, W }