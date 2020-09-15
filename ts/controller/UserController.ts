import { Class, Post, Roles, Service, Get } from "../decorator"
import { W } from '../weblogic'
import { UserService } from "../service/UserService"
import { Context } from "koa"
import { Controller } from '../controller';
//自动实现curd,第一参数可省
@Class("user",["add", "del", "fix", "info", "page"])
class UserController extends Controller {
  @Service(UserService) readonly user_: UserService
  
  @Roles(W.Qx)
  @Post("register")
  async register(ctx: Context) {
    ctx.body = await this.user_.register(ctx.request.body);
  }
  @Roles(W.Qx)
  @Post("login")
  async login(ctx: Context) {
    ctx.body = await this.user_.login(ctx.request.body);
  }
}