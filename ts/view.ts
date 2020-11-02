import { Context } from "koa"
import { html } from "./utils/tool"
import { Class, Get, Q } from "./think/decorator"
import { Maps } from "./config"
import { Tag } from "./utils/tag";

@Class()
class View {
  @Get()
  @Get("index.html")
  @Get("login.html")
  html(ctx: Context) {
    return html(ctx, { test: "For ", author: "anyone" });
  }
  @Get("_")
  _() {
    return Maps;
  }
  @Get("static")//前端渲染Tag，使用/static是为了方便
  $(@Q q) {
    return Tag.h(q.v,q.a,q.n,Number(q.t)as 0,q.c);
  }
}