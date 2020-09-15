import * as fs from "fs";import * as url from "url";import { Context } from "koa"
type Y<T>=object;type P<T>=Y<T[keyof T]>;
/**
 * 将ejs模板渲染到html
 * @param ctx koa的Context
 * @param obj 展开的Object
 */
const html = async (ctx: Context, ...obj:Array<P<{K:{k:string}}>>) => 
await ctx.render(url.parse(ctx.url).path.replace(/^\//, '') || "index", ...obj)
const readFileList = (path, filesList) => {
  fs.readdirSync(path).forEach((itm) => {
    let stat = fs.statSync(path + itm);
    if (stat.isDirectory())
      readFileList(path + itm + "/", filesList)
    else filesList.push(path + itm);
  })
}
const deleteAll = async (path) => {
  path.slice(-1) === "/" ? undefined : path = path + "/";
  fs.readdirSync(path).forEach((itm) => {
    fs.unlinkSync(path + itm)
  })
}
const deleteOne = async (path) => {
  if (fs.existsSync(path)) fs.unlinkSync(path);
}
const fileAction = async (ctx: Context) => {
  let filesList = new Array;
  await readFileList(ctx.query.path, filesList);
  await ctx.send(filesList);
}
export { html, readFileList, deleteAll, deleteOne, fileAction }