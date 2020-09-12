## ThinkTs
- Support **typeorm**, the best typescript ORM framework, and easily write all kinds of logic of Dao layer
- Allow static type modification and type inference to support back-end development and maintenance
- Modular development makes the application easier to layer and provides an easy-to-use modular management mechanism
- AOP code is written in a low-key way, but it is easy to realize log, interceptor, filter and other functions
- MVC, API, websocket, microservice and other systems are constructed fastest, good and most fiercely

### With ThinkTs your controller look like this:
```typescript
@Class(["add","delete","modify","search"])//or @Class("/admin",……)or @Class("admin",……)
class AdminController{
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
#### And your service looks like this:
```typescript
export class UserService implements UserFace{
  constructor(
    private user=getRepository(User),
    private admin=getRepository(Admin)
  ){ super(user) }
  async all(){
    let a=await this.admin.find()
    let u=await this.user.find()
    return [...a,...u]
  }
  async one(id:number){
    return this.user.findOne(id);
  }
  async save(obj:User) {
    return this.user.save(obj);
  }
}
```
#### And your interface looks like this:
```typescript
export interface UserFace{
  /** register one*/register(entity)
  /** login one*/login(entity)
  /** search all*/all()
}
```
### Finally, please refer to the entity class writing method of [TypeORM](https://github.com/typeorm/typeorm)

### Features
- [x] The default value of class class decorator is`/`+ entity class name, which can also be customized
- [x] automatically scan controller directory and configure routes route
- [x] automatically generate the configuration route file for reference, which is under the routes directory
- [x] automatic implementation of addition, deletion, modification and query

### Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Run `npm start` command

### Directory structure
1. src: ` back end file entry`
2. src/controller: ` control layer`
3. src/entity:`entity layer`
4. src/interface: ` interface layer`
5. src/service: `service layer`
6. src/utils: ` tool layer`
7. views: ` background EJS template rendering folder`
8. routes: ` output the route file to view. Each controller will create one`

### Other
> Built by the world's No.1 man, Asciphx  
> Please wait this project will generate a blog project
