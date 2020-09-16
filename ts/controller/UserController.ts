import { Class, Post, Roles, Service, Get, Put } from "../decorator"
import { W } from '../weblogic'
import { UserService } from "../service/UserService"
import { Context } from "koa"
import { Controller } from '../controller';
//自动实现curd,第一参数可省
@Class("user",["add", "del", "info", "page"])
class UserController extends Controller {
  @Service(UserService) readonly u_: UserService
  
  @Roles(W.Qx)
  @Post("register")
  async register(ctx: Context) {
    await this.u_.register(ctx.request.body)
    .then(r=>ctx.body=r.status===409?r.mes:{code: 200, mes: `第${r.raw.insertId}位注册成功`});
  }
  @Roles(W.Qx)
  @Post("login")
  async login(ctx: Context) {
    await this.u_.login(ctx.request.body.account,ctx.request.body.pwd)
    .then(r=>ctx.body=r.status?r.mes:r).catch(e=>console.error(e))
  }
  @Put(":id")
  async update(ctx:Context){
    ctx.body = await this.u_.fix(ctx.params.id,ctx.request.body);

  }
}