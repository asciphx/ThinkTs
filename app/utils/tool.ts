import path = require("path"); import * as fs from "fs"; import { Context } from "koa"
type Y<T> = object; type P<T> = Y<T[keyof T]>;
/**
 * 将ejs模板渲染到html
 * @param ctx koa的Context
 * @param obj 展开的Object
 */
function* html(ctx: Context, ...obj: Array<P<{ K: { k: string } }>>) {
  yield ctx.render(ctx.url.replace(/^\//, '') || "index", ...obj)
}
const readFileList = async (path, filesList) => {
  const items = await fs.promises.readdir(path);
  for (const itm of items) {
    const stat = await fs.promises.stat(path + itm);
    if (stat.isDirectory())
      await readFileList(path + itm + "/", filesList)
    else filesList.push(path + itm);
  }
}
const deleteAll: Function = async path => {
  path.slice(-1) === "/" ? void 0 : path = path + "/";
  const items = await fs.promises.readdir(path);
  for (const itm of items) {
    await fs.promises.unlink(path + itm)
  }
}
const deleteOne: Function = async path => {
  try { await fs.promises.access(path); await fs.promises.unlink(path); } catch { /* file not exist */ }
}
const getfiles: Function = async (str: string) => {
  let filesList = new Array;
  await readFileList(str + "/", filesList);
  return filesList;
}
const promise: Function = F => (...a) => new Promise((s, f) => { F.call(this, ...a, (e, d) => { if (e) { f(e) } else { s(d) } }) });
const getFilesAsync: Function = async dir => {
  let files: any = await promise(fs.readdir)(dir);
  return Promise.all(files.map(file => {
    let filePath = path.join(dir, file);
    return promise(fs.stat)(filePath).then(stat => {
      if ((stat as fs.StatsBase<any>).isDirectory())
        return getFilesAsync(filePath);
      else return filePath.replace("ts\\", "");
    });
  }));
};
export { html, deleteAll, deleteOne, getfiles, promise, getFilesAsync }
