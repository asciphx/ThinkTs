import { Class, Get, Post, Roles, Service } from "../decorator"
import { W } from '../weblogic'
import { UserService } from "../service/UserService"
import { Context } from "koa"
import { Controller } from '../controller';

@Class(["add","delete","modify","search"])//or @Class("user",……),or @Class("/user",……)
class UserController extends Controller{
  @Service(UserService) readonly userSvc: UserService

  @Post("register")
  async register(ctx: Context) {
    ctx.body = await this.userSvc.register(ctx.request.body);
  }
  @Post("login")
  async login(ctx: Context) {
    ctx.body = await this.userSvc.login(ctx.request.body);
  }
  @Roles(W.Login)
  @Get()
  async all(ctx: Context) {
    ctx.body = await this.userSvc.all();
  }
}