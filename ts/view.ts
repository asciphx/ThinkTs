import { html, getFilesAsync, getfiles } from "./utils/tool";import Tag from "./utils/tag";import { Context } from "koa"
import { Class, Get, Q } from "./think/decorator"; import { Maps } from "./config";

@Class()
class View {
  @Get() @Get("index.html") @Get("login.html")
  html(ctx: Context) { return html(ctx, { test: "For ", author: "anyone" }).next().value; }
  @Get("_")
  _() { return Maps; }
  @Get("static/tag")
  $(@Q q){ return Tag.h(q.v, q.a, q.n, Number(q.t) as 0, q.c) };
  @Get("static/tsx")//localhost:8080/static/tsx?./ts
  tsx(ctx: Context) {const STR=ctx.querystring;
    if(STR.includes(":")||STR.includes("..")||STR.length<3)return "Not Allowed"
    return getfiles(STR);
  }
  @Get("static/ts")//localhost:8080/static/ts?./ts
  ts(ctx: Context) {const STR=ctx.querystring;
    if(STR.includes(":")||STR.includes("..")||STR.length<3)return "Not Allowed";
    return getFilesAsync(STR);
  }
}