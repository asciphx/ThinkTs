import { Class, Post, Middle, Inject, Put, B, P } from "../think/decorator"
import { W } from '../weblogic'
import { UserService } from "../service/UserService"
import { Controller } from '../think/controller';

@Class("user",["del", "info", "page"])
class UserController extends Controller {
  @Inject(UserService) readonly u_: UserService
  
  @Middle(W.Log)
  @Post("register")
  async register(@B b) {
    return this.u_.register(b).then(r=>r.code?r.message:`第${r.raw.insertId}位注册成功`)
  }
  @Middle(W.Log,W.V_B("account","pwd"))
  @Post("login")
  async login(@B b) {
    return await this.u_.login(b.account,b.pwd)
  }
  @Put(":id")
  async fix(@B b,@P p){
    return this.u_.fix(p.id,b).then(r=>r.raw.changedRows?'已修改':'未修改')
  }
}