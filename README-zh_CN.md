# ThinkTs
- 支持 **TypeORM**，最好的 Typescript ORM 框架，轻松编写 DAO 层的各类逻辑
- 允许使用静态类型修饰、类型推断，为后端开发和维护提供支持
- 模块化开发，让应用程序更容易分层，提供了易于使用的模块化管理机制
- 最低调编写 AOP 代码，面向切面编程，却轻松实现日志、拦截器、过滤器等功能
- 最快，最迅速，最猛烈构建 MVC、API、websocket、微服务等系统
- ......
## 使用**ThinkTs**让你的controller看起来像是:

```typescript
@Class("user")
export class UserController{
  @Service(UserService) readonly userSvc:UserService

  @Post("login")
  async login(ctx:Context) {
    ctx.body=await this.userSvc.login(ctx.request.body);
  }
  @Roles(W.Qx,W.Login)
  @Get()
  async all(ctx:Context) {
    ctx.body=await this.userSvc.all();
  }
  @Roles(W.Login)
  @Get(":id")
  async one(ctx:Context) {
    let v=await this.userSvc.one(ctx.params.id);
    if (!v) {ctx.status = 404;return;}
    ctx.body=v;
  }
}
/** Here's how to show EJS template rendering */
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
```
### 让你的service看起来像是:
```typescript
export class UserService implements UserFace{
  constructor(private user=getRepository(User)){}
  async login(user: User) {
    throw new Error("Method not implemented.");
  }
  async all(){
    return this.user.find()
  }
  async one(id:number){
    return this.user.findOne(id);
  }
  async save(obj:User) {
    return this.user.save(obj);
  }
}
```
### 让你的interface看起来像是:
```typescript
export interface UserFace{
  /** register one*/register(entity)
  /** login one*/login(entity)
  /** search all*/all()
  /** search one*/one(id:number)
  /** save one*/save(entity)
  /** update one*/update(id:number,entity)
  /** remove one*/remove(id:number)
}
```
### 让你的entity看起来像是[TypeORM](https://github.com/typeorm/typeorm)中的写法
## 特征
- [x] Class类装饰器默认值为 "/"+实体类名 ,当然也可以自定义
- [x] 自动扫描controller目录，并且配置Routes路由
- [x] 自动生成配置路由文件以便查阅，在routes目录下，也可删除，或者去src/config.js下更改printRoute为false
- [x] 有近似于nest.js架构的速度，还有java:SpringBoot框架的可维护性
- [x] 如不采用typeORM库，也可以使用Sequelize，并重写entity类


## 目录结构
1. src:`后端文件入口`
2. src/controller:`控制层`
3. src/entity:`实体层`
4. src/interface:`接口层`
5. src/service:`服务层`
6. src/utils:`工具层`
7. views:`后台ejs模板渲染文件夹`
8. routes:`输出查看的路由文件，每个controller会创建一个`

## **请赞助本项目**
如你觉有收获，请务必给我打赏

![微信打赏](http://www.91huanwei.com/1.jpg)
![支付宝打赏](http://www.91huanwei.com/0.jpg)
