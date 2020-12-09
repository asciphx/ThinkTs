import { html, getFilesPath } from "./utils/tool";import Tag from "./utils/tag";import { Context } from "koa"
import { Class, Get, Q } from "./think/decorator"; import { Maps } from "./config";import * as fs from "fs"

@Class()
class View {
  @Get() @Get("index.html") @Get("login.html")
  html(ctx: Context) { return html(ctx, { test: "For ", author: "anyone" }); }
  @Get("_")
  _() { return Maps; }
  @Get("static/tag")
  $(@Q q){ return Tag.h(q.v, q.a, q.n, Number(q.t) as 0, q.c) };
  @Get("static/tsx")
  tsx() {
    let str=""
    fs.readdirSync("./ts").forEach(i=>{str += i + ",";});
    return str.replace(/,$/,"")
  }
  @Get("static/ts")
  ts() { return getFilesPath("./ts") }
}