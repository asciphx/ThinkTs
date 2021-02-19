/**
 * 将Object内部空的键，移除 @param obj
 */
const paraFilter = (obj:Object) => {
  for (const i in obj) {
    if (obj[i] === undefined || obj[i] === '' || obj[i] === null) delete obj[i];
  }
  return obj;
}
/**
 * 深拷贝 @param obj
 */
const deepCopy = obj=>{
  const newObj = obj instanceof Array ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = typeof obj[key] === 'object' ? (deepCopy(obj[key]),
      typeof key==="object"?key=null:typeof key==="function"?key=null:void 0) : obj[key];
    }
  }
  return newObj;
}
/**
 * RGB颜色转html代码# @param r @param g @param b
 */
const rgb2h = (r:number, g:number, b:number) =>`#${((r << 16) + (g << 8) + b).toString(16)}`;
/**
 * html代码颜色转RGB数组[r,g,b] @param hex
 */
const h2rgb = (hex:string) =>[1, 3, 5].map((h) => parseInt(hex.substring(h, h + 2), 16));
/**
 * 将Object内部的键按照asci码来排序
 * @param obj
 */
const sortAsci=(obj:Object)=>{
	let arr = new Array(),num = 0;
	for (let i in obj)arr[num++]=i;
	let a = arr.sort(),s = {};
	for (let i in a)s[a[i]] = obj[a[i]];
	return s;
}
/**
 * 路径获参数 @param p @param r @param o
 */
const pathField = (p:string, r:string, o:object) => {
  let pl = p.split("/");
  return r.split("/").reduce((a, c, i) => {
    if (c[0] === ":") {
      const param = c.substr(1);
      a[param] = o && o[param]
        ? o[param](pl[i])
        : pl[i];
    }
    return a;
  }, {});
};
// pathField("/2/1", "/:arr/:id", {
//   arr:v=>['Apple','Bus','Car'][v],id:v=>+v
// });返回一个JSON对象，并解构里面
/**
 * url的parser @param url
 */
const queryParams = (url:string) =>
  url.match(/([^?=&]+)(=([^&]*))/g).reduce((obj, v) => {
    const [key, value] = v.split("=");
    obj[key] = value;return obj;
  }, {});
export { paraFilter, sortAsci, rgb2h, h2rgb, deepCopy, pathField, queryParams }