# ThinkTs
- Support **typeorm**, the best typescript ORM framework, and easily write all kinds of logic of Dao layer
- Allow static type modification and type inference to support back-end development and maintenance
- Modular development makes the application easier to layer and provides an easy-to-use modular management mechanism
- AOP code is written in a low-key way, but it is easy to realize log, interceptor, filter and other functions
- MVC, API, websocket, microservice and other systems are constructed fastest, good and most fiercely

## Features
- [x] The default value of class class decorator is`/`+ entity class name, which can also be customized
- [x] automatically scan controller directory and configure routes route
- [x] automatically generate the configuration route file for reference, which is under the routes directory

## Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Run `npm start` command

## Directory structure
1. src: ` back end file entry`
2. src/controller: ` control layer`
3. src/entity:'entity layer`
4. src/interface: ` interface layer`
5. src/service: service layer`
6. src/utils: ` tool layer`
7. views: ` background EJS template rendering folder`
8. routes: ` output the route file to view. Each controller will create one`

## Other
> Built by the world's first great teaser, Asciphx  
> Please wait this project will generate a blog project
