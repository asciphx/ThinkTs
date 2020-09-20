import { Context } from "koa"
import { html } from "./utils/tool"
import { Class, Get } from "./think/decorator"
import { Maps } from "./config"

@Class()
class View {
  @Get()
  @Get("index.html")
  async index(ctx: Context) {
    ctx.body = await html(ctx, { test: "test", author: "asciphx" })
  }
  @Get("login.html")
  async login(ctx: Context) {
    ctx.body = await html(ctx, { test: "test", author: "Login" })
  }
  @Get("_")
  async _(ctx: Context) {
    ctx.body = Maps;
  }
}