import { Context } from "koa"
import { html } from "./utils/tool"
import { Class, Get } from "./decorator"

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
}