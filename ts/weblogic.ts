import { Context,Middleware } from "koa";import date from "./utils/date";
import { Conf } from "./config";import * as multer from '@koa/multer';//2097152=2mb
const upload = multer({dest:Conf.upload,limits:{fieldNameSize:100,fieldSize:524288,fileSize:2097152}
    // ,storage:multer.diskStorage({destination: function (req, file, cb) {cb(null, Config.pic);},
    // filename: function (req, file, cb) {cb(null, file.fieldname + '-' + Date.now());}})
});
export const W = {
  async Log(ctx: Context, next) {
    const start = Date.now();
    await next();
    console.log(`${ctx.method}${ctx.url} used ${Date.now() - start}ms -> ${date.date2str()}`);
  },
  single(str:string) {
    return upload.single(str)
  },
  fields(arr:Array<{name:string,maxCount:number}>) {
    return upload.fields(arr)
  },
  /*Verify链式校验，V_B校验body,V_Q校验query，非全检测，只要遇到错的就弹出，省开销
   *O是字段，L是length，R为是否必填(1是必填，0或者不写为可选)[用|1表示必填,|2表示过滤]
   *name#5表示字段为name长度为0~5非必填，如果有则检验长度，#4~10表示长度为4到10
   */
  V_B(...a:Array<string>):Middleware {const O=[""],R=[0],L0=[0],L1=[0];let L=[]
    a.sort().forEach((v, i) => {
      O[i] = v.replace(/[0-9~#|]+/g, ""),
      L[i] = v.match(/((#)=?)(\d+\~\d+|\d+)/)?.[3].match(/\d+/g),
      R[i] = Number(v.match(/((\|)=?)(\d+)/)?.[3])||0,
      L[i]&&(L[i].length===1?(L0[i]=0,L1[i]=Number(L[i][0])):(L0[i]=Number(L[i][0]),L1[i]=Number(L[i][1])))
    });a=L=null;
    return async (ctx: Context, next) => {
      let c=ctx.request.body,b=Object.keys(c).sort(),i=0;
      for (let p of O) {
        if(R[i]===2){delete c[p];++i;continue}
        if(p===b[i]){
          if(L1[i])
            if(L0[i]>c[p].length||c[p].length>L1[i]){
              ctx.status=422;ctx.body=`The length of the field[${p}] is ${L0[i]} to ${L1[i]}`;b=c=null;return
            }
          ++i;
        }else if(R[i]===1){
          ctx.status = 412;ctx.body = `The field[${p}] isn't null`;b=c=null;return
        }else if(R[i]===0&&b[i]===undefined)++i;
      }
      b=c=null;
      await next();
    }
  },
  V_Q(...a:Array<string>):Middleware {const O=[""],R=[0],L0=[0],L1=[0];let L=[]
    a.sort().forEach((v, i) => {
      O[i] = v.replace(/[0-9~#|]+/g, ""),
      L[i] = v.match(/((#)=?)(\d+\~\d+|\d+)/)?.[3].match(/\d+/g),
      R[i] = Number(v.match(/((\|)=?)(\d+)/)?.[3])||0,
      L[i]&&(L[i].length===1?(L0[i]=0,L1[i]=Number(L[i][0])):(L0[i]=Number(L[i][0]),L1[i]=Number(L[i][1])))
    });a=L=null;
    return async (ctx: Context, next) => {
      let c=ctx.query,b=Object.keys(c).sort(),i=0;
      for (let p of O) {
        if(R[i]===2){delete c[p];++i;continue}
        if(p===b[i]){
          if(L1[i])
            if(L0[i]>c[p].length||c[p].length>L1[i]){
              ctx.status=422;ctx.body=`The length of the field[${p}] is ${L0[i]} to ${L1[i]}`;b=c=null;return
            }
          ++i;
        }else if(R[i]===1){
          ctx.status = 412;ctx.body = `The field[${p}] isn't null`;b=c=null;return
        }else if(R[i]===0&&b[i]===undefined)++i;
      }
      b=c=null;
      await next();
    }
  },
}