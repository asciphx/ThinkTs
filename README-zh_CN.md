# ThinkTs
- 支持 **TypeORM**，最好的 Typescript ORM 框架，轻松编写 DAO 层的各类逻辑
- 允许使用静态类型修饰、类型推断，为后端开发和维护提供支持
- 模块化开发，让应用程序更容易分层，提供了易于使用的模块化管理机制
- 最低调编写 AOP 代码，面向切面编程，却轻松实现日志、拦截器、过滤器等功能
- 最快，最迅速，最猛烈构建 MVC、API、websocket、微服务等系统
- 配置大于编码，优先自动实现增删改查以及分页等五个方法，方便权限后台系统搭建
- 服务能够implements接口，快速定位每个方法，轻松维护代码复杂繁多的service
- ......
## 使用**ThinkTs**让你的controller看起来像是:

```typescript
@Class(["add","del","fix","info"])//or @Class("/admin",……)or @Class("admin",……)
class AdminController extends Controller{
  @Service(AdminService) readonly adminSvc:AdminService
  @Service(UserService) readonly userSvc:AdminService

  @Post("login")
  async login(ctx:Context) {
    ctx.body=await this.userSvc.login(ctx.request.body);
  }
  @Roles(W.Qx,W.Login)
  @Get()
  async all(ctx:Context) {
    let adminList=await this.adminSvc.all()
    let userList=await this.userSvc.all()
    ctx.body=[...adminList,...userList]
  }
}
/** Here's how to show EJS template rendering */
class View{
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
export class UserService extends Service implements UserFace{
  constructor(
    private user:Repository<User>=Conf[User.name],
    private role:Repository<Role>=Conf[Role.name]
  ) {
    super({
      leftJoin:{e:"user.roles",a:'role'},
      select:[ 'user.id','user.account', 'role.id','role.name', 'user.photo', 'user.status'],
      where: query => {
        return new Brackets(qb => {
          if (query.account) qb.where('account like :v', { v: `%${query.account}%` })
          if (query.id) qb.andWhere('id >:i', { i: query.id })
        });
      },
      orderBy: { "user.id": "desc" }
    })
  }
  async all(){
    let a=await this.admin.find()
    let u=await this.user.find()
    return [...a,...u]
  }
}
```
### 让你的interface看起来像是:
```typescript
export interface UserFace{
  /** register one*/register(entity)
  /** login one*/login(entity)
  /** search all*/all()
}
```
### 让你的entity看起来像是[TypeORM](https://github.com/typeorm/typeorm)中的写法
## 特征
- [x] Class类装饰器默认值为 "/"+实体类名 ,当然也可以自定义
- [x] 自动扫描entity目录，载入到Conf，相当于一个容器,可以避免entity被多次实例化
- [x] 自动扫描controller目录，并且配置Routes路由
- [x] 自动生成配置路由文件以便查阅，在routes目录下，也可删除，或者去src/config.js下更改printRoute为false
- [x] 有近似于nest.js架构的速度，还有java:SpringBoot框架的可维护性
- [x] 如不采用typeORM库，也可以使用Sequelize，并重写entity类
- [x] 现在增加基础控制器、服务层，控制器装饰器可以自定义自动实现增删改查以及分页
- [x] 可以自定义控制器调用的服务类变量名，并且不会影响运行速度
- [x] 为降低内存开销和实例调用，现在已经实现实体类容器化

## 新版自定义JWT鉴权说明
> Headers请求头现在为2个参数，原版jwt不变。现增加一个secret，算法是在cryptoUtil.ts里
> ```javascript
> a:`${token}`
> s:`${secret}`
> ```
> 现在由后端提供secret

## 目录结构
1. src:`后端文件入口`
2. src/controller:`控制层`
3. src/entity:`实体层`
4. src/interface:`接口层`
5. src/service:`服务层`
6. src/utils:`工具层`
7. views:`后台ejs模板渲染文件夹`
8. routes:`输出查看的路由文件，每个controller会创建一个`

## 权限管理
菜单只包含目录结构，没有请求路径。
路由的上级节点只能是菜单，包含请求路径。
按钮的上级节点只能是路由，而且必须没有请求路径，是因为按钮的功能都基于spa单页应用。
put方法实际上跟patch方法等同，如果局部修改也不会影响其他，所以没写patch装饰器。

## **请赞助本项目**
如你觉有收获，请务必给我打赏

![微信打赏](http://www.91huanwei.com/1.jpg)
![支付宝打赏](http://www.91huanwei.com/0.jpg)
