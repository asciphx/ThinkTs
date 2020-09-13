import { Class, Get, Post, Roles, Service } from "../decorator"
import { W } from '../weblogic'
import { UserService } from "../service/UserService"
import { Context } from "koa"
import { Controller } from '../controller';
import { Brackets } from "typeorm";

@Class("user",["add", "del", "fix", "info", "page"])//自动实现增删改查以及分页,第一个参数也可省略
class UserController extends Controller {
  @Service(UserService) readonly user_: UserService
  constructor() {//配置page分页查询，where是模糊条件
    super({
      where: query => {
        return new Brackets(qb => {
          if (query.account) qb.where('account like :account', { account: `%${query.account}%` });
          if (query.id) qb.andWhere('id =:id',{id:query.id})
        });
      },
      orderBy: { "id": "desc" }
    })
  }
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