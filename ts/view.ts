import { html, getFilesPath } from "./utils/tool";
import Tag from "./utils/tag";
import { Class, Get, Q } from "./think/decorator";
import socket  from "./utils/socketIo";

@Class()
class View {
  @Get() @Get("index.html") @Get("login.html")
  html(ctx) { return html(ctx, { test: "For ", author: "anyone" }); }
  @Get("static/tag")
  $(@Q q){ return Tag.h(q.v, q.a, q.n, Number(q.t) as 0, q.c) };
  @Get("static/ts")
  ts() { return getFilesPath("./ts") }
  @Get("_")
  webkit() {return Promise.resolve(socket.users);}//获取socket用户列表
}