import { Context } from "koa"
import { html } from "./utils/tool"
import { Class, Get } from "./think/decorator"
import { Maps } from "./config"

@Class()
class View {
  @Get()
  @Get("index.html")
  @Get("login.html")
  async html(ctx: Context) {
    ctx.body = await html(ctx, { test: "For ", author: "anyone" })
  }
  @Get("_")
  async _(ctx: Context) {
    ctx.body = Maps;
  }
}