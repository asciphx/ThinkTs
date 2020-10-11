import { Context } from "koa";import date from "./utils/date"
export const W = {
  async Log(ctx: Context, next) {
    const start = Date.now();
    await next();
    console.log(`${ctx.method}${ctx.url} used ${Date.now() - start}ms -> ${date.date2str()}`);
  },
  /*Verify校验，t为0则校验body,t为1或其他数则校验query
   *O是校验字段，L是长度length，R为是否必填也就是require
   */
  V(t:number=0,...a:Array<string>):Function {const O=[""],L=[0],R=[0]
    a.forEach((v, i) => {
      O[i] = v.replace(/#.+$/, ""),
      L[i] = Number(v.replace(/[^#]+#?([^|]?)\|?(\d+)?/, "$1")),
      R[i] = Number(v.replace(/^[^|]+\|?(\d+)?/, "$1"))
    });
    return async (ctx: Context, next) => {
      let b=Object.keys(t?ctx.query:ctx.request.body),i=0;console.log(b,O)
      for (let p of O) {
        if (p === b[i]) {
          if(L[i]>0){
            if (t) {
              if(ctx.query[p].length<L[i]){ctx.status=412;ctx.body=`query-field:${p}'s too small in length`;b = null;return}
            } else {
              if(ctx.request.body[p].length<L[i]){ctx.status=412;ctx.body=`body-field:${p}'s too small in length`;b = null;return}
            }
            // R[i]===0&&,待续
          }
          ++i
        } else {
          ctx.status = 422;ctx.body = `${t?"query":"body"} isn't verified`;b = null;return
        }
      }
      a = b = null;
      await next();
    }
  }
}
const DATE_TYPE_RE = /^\d{4}\-\d{2}\-\d{2}$/;
const DATETIME_TYPE_RE = /^\d{4}\-\d{2}\-\d{2} \d{2}:\d{2}:\d{2}$/;
const ID_RE = /^\d+$/;
const EMAIL_RE = /^[a-z0-9\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+(?:\.[a-z0-9\!\#\$\%\&\'\*\+\/\=\?\^\_\`\{\|\}\~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?$/i;
const PASSWORD_RE = /^[\w\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\|\;\:\'\"\,\<\.\>\/\?]+$/;
const URL_RE = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i;