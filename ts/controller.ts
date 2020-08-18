import {Context} from "koa"
import {html} from "./utils/tool"
import {Class,Get} from "./decorator"

@Class()
export class Controller{
  @Get()
  @Get("index.html")
  async index(ctx:Context){
    await html(ctx,{test:"test",author:"asciphx"})
  }
  @Get("login.html")
  async login(ctx:Context){
    await html(ctx,{test:"test",author:"Login"})
  }
}