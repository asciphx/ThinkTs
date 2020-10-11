import { Context } from "koa";import date from "./utils/date"
export const W = {
  async Log(ctx: Context, next) {
    const start = Date.now();
    await next();
    console.log(`${ctx.method}${ctx.url} used ${Date.now() - start}ms -> ${date.date2str()}`);
  },
  /*Verify校验，V_B校验body,V_Q校验query
   *O是校验字段，L是长度length，R为是否必填(1是必填，0或者不填为可选)[用|1表示必填]
   *name#5表示字段为name长度为0~5非必填，如果有则检验长度，#4~10表示长度为4到10
   *类型检测是否影响速度尚有争议，动态类型，关于传入number和字符串没明显界限
   */
  V_B(...a:Array<string>):Function {const O=[""],L=[],R=[0];
    a.sort().forEach((v, i) => {
      O[i] = v.replace(/[0-9~#|]+/g, ""),
      L[i] = v.match(/((#)=?)(\d+\~\d+|\d+)/)?.[3].match(/\d+/g),
      R[i] = Number(v.match(/((\|)=?)(\d+)/)?.[3])||0,
      L[i]?.length===1&&(L[i][1]=L[i][0],L[i][0]=0)
    });a=null;
    return async (ctx: Context, next) => {
      let c=ctx.request.body,b=Object.keys(c).sort(),i=0;
      for (let p of O) {
        if (p === b[i]) {
          if(L[i]){
            if(L[i][0]>c[p].length||c[p].length>L[i][1]){
              ctx.status=422;ctx.body=`The length of the field[${p}] is ${L[i][0]} to ${L[i][1]}`;b = null;return
            }
          }
          ++i;
        } else if(R[i]!==0){
          ctx.status = 412;ctx.body = `The field[${p}] isn't null`;b = null;return
        } else if (R[i] === 0 && b[i] === undefined) {
          i++;
        }
      }
      b=c=null;
      await next();
    }
  },
  V_Q(...a:Array<string>):Function {const O=[""],L=[],R=[0];
    a.sort().forEach((v, i) => {
      O[i] = v.replace(/[0-9~#|]+/g, ""),
      L[i] = v.match(/((#)=?)(\d+\~\d+|\d+)/)?.[3].match(/\d+/g),
      R[i] = Number(v.match(/((\|)=?)(\d+)/)?.[3])||0,
      L[i]?.length===1&&(L[i][1]=L[i][0],L[i][0]=0)
    });a=null;
    return async (ctx: Context, next) => {
      let c=ctx.query,b=Object.keys(c).sort(),i=0;
      for (let p of O) {
        if (p === b[i]) {
          if(L[i]){
            if(L[i][0]>c[p].length||c[p].length>L[i][1]){
              ctx.status=422;ctx.body=`The length of the field[${p}] is ${L[i][0]} to ${L[i][1]}`;b = null;return
            }
          }
          ++i;
        } else if(R[i]!==0){
          ctx.status = 412;ctx.body = `The field[${p}] isn't null`;b = null;return
        } else if (R[i] === 0 && b[i] === undefined) {
          i++;
        }
      }
      b=c=null;
      await next();
    }
  },
}