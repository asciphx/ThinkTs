import { html, getFilesAsync, getfiles } from "./utils/tool";import Tag from "./utils/tag";
import { Class, Get, Q, S } from "./think/decorator";

@Class()
class View {
  @Get() @Get("index.html")
  html(ctx) { return html(ctx, { test: "For ", author: "anyone" }).next().value; }
  @Get("_")
  _() { return ""; }
  @Get("static/tag")
  $(@Q q){ return Tag.h(q.v, q.a, q.n, Number(q.t) as 0, q.c) };
  @Get("static/tsx")//localhost:8080/static/tsx?./ts
  tsx(@S s,@R r) {
    if(s.includes(":")||s.includes("..")||s.charAt(0)==="/"||s.length<3){
      r.status=403;return 'Not Allowed';
    }
    return getfiles(s);
  }
  @Get("static/ts")//localhost:8080/static/ts?./ts
  ts(@S s,@R r) {
    if(s.includes(":")||s.includes("..")||s.charAt(0)==="/"||s.length<3){
      r.status=403;return 'Not Allowed';
    }
    return getFilesAsync(s);
  }
} 