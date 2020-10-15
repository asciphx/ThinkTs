import { Context,Middleware } from "koa";import date from "./utils/date";import { createHash } from 'crypto';
import { Conf } from "./config";import * as multer from '@koa/multer';import * as fs from "fs";//2097152=2mb
const U = multer({dest:Conf.upload,limits:{fieldNameSize:100,fieldSize:524288,fileSize:2097152}
    // ,storage:multer.diskStorage({destination: function (req, file, cb) {cb(null, Config.pic);},
    // filename: function (req, file, cb) {cb(null, file.fieldname + '-' + Date.now());}})
});//U.single(uploadFile:string)上传文件的field  U.fields(arr:Array<{name:string,maxCount:number}>)
const W = {
  async Log(ctx: Context, next){
    const start = Date.now();
    await next();
    console.log(`${ctx.method}${ctx.url} used ${Date.now() - start}ms -> ${date.date2str()}`);
  },
  //先使用U.single中间件，然后使用W.pic把实体类中对应的字段补充上文件路径
  pic(field:string):Middleware {
    return async (ctx: any, next) => {
      let path=Conf.upload+'/'+ctx.request.file.filename;
      let newpath=Conf.upload+"/"+createHash("sha1").update(fs.readFileSync(path)).digest("hex")+ctx.request.file.size+"."+ctx.request.file.mimetype.split('/')[1];
      if(!fs.existsSync(newpath)){fs.rename(path,newpath,e=>{return e});}else fs.unlinkSync(path)
      ctx.request.body[field]=newpath.slice(String(Conf.upload).length + 1);
      await next();
    }
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
export { U, W }