import { html, getFilesPath, getfiles } from "./utils/tool";import Tag from "./utils/tag";
import { Class, Get, Q } from "./think/decorator";

@Class()
class View {
  @Get() @Get("index.html") @Get("login.html")
  html(ctx) { return html(ctx, { test: "For ", author: "anyone" }).next().value; }
  @Get("_")
  _() { return ""; }
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
    return getFilesPath(STR);
  }
} 