import { html, getFilesPath } from "./utils/tool";import { Tag } from "./utils/tag";import * as fs from "fs"
import { Class, Get, Q } from "./think/decorator"; import { Maps } from "./config";import { Context } from "koa"

@Class()
class View {
  @Get() @Get("index.html") @Get("login.html")
  html(ctx: Context) { return html(ctx, { test: "For ", author: "anyone" }); }
  @Get("_")
  _() { return Maps; }
  @Get("static/tag")//前端渲染Tag,前缀static可以不被拦截
  $(@Q q){ return Tag.h(q.v, q.a, q.n, Number(q.t) as 0, q.c) };
  @Get("static/tsx")//获取ts目录这一层的目录或者是文件的名称
  tsx() {
    let str=""
    fs.readdirSync("./ts").forEach(i=>{str += i + ",";});
    return str.replace(/,$/,"")
  }
  @Get("static/ts")//获取ts路径下，所有文件的相对路径
  ts() { return getFilesPath("./ts") }
}