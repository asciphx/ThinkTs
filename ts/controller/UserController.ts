import { Class, Post, Middle, Inject, Put, R, P } from "../think/decorator"
import { W } from '../weblogic'
import { UserService } from "../service/UserService"
import { Controller } from '../think/controller';

@Class("user",["del", "info", "page"])
class UserController extends Controller {
  @Inject(UserService) readonly u_: UserService
  
  @Middle(W.Log)
  @Post("register")
  async register(@R r) {
    return this.u_.register(r.body).then(r=>r.code?r.message:`第${r.raw.insertId}位注册成功`)
  }
  @Middle(W.Log)
  @Post("login")
  async login(@R r) {
    return await this.u_.login(r.body.account,r.body.pwd)
  }
  @Put(":id")
  async fix(@P p,@R r){
    return this.u_.fix(p.id,r.body).then(r=>r.raw.changedRows?'已修改':'未修改')
  }
}