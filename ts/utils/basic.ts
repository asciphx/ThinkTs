/**
 * 生成长度9的随机id
 */
const GenerateId = () => {
  return 'xxx'.replace(/x/g, () => (Math.random() * 36 | 0).toString(36))
    + (('0x' + new Date().getTime() as any).toString(16)>>> 1).toString(36);
}
/**
 * 取文件名类型
 * @param name
 */
const Suffix = (name: string) => name.replace(/().*(?=)\./, '\.')
/**
 * json字符串在双引号的时候，完整转text格式
 * @param json
 */
const J2T = (json: string) => json.replace(/(\\|\\'|\"|\n)/g, "\\\$1")
/**
 * 数据库内模糊查询支持反斜杠，并且不被截断
 * @param str
 */
const Backslash = (str: string) => {
  let stri = str.split("\\", -1), b: string = "\\";
  for (let a = 0; a < stri.length; a++) {
    if (stri[a] != "") {
      if (a != 0) b = b + "\\\\" + stri[a]; else b = b + stri[a];
    } else { if (a > 1 || stri[0] != "") b = b + "\\\\"; else b = b + "\\"; }
  }; return b;
}
/**
 * 哈希字符转字符串
 * @param hex
 */
const hextoString=(hex:string)=>{
  let arr = hex.split("")
  let out = ""
  for (let i = 0; i < arr.length / 2; i++) {
    let tmp = "0x" + arr[i * 2] + arr[i * 2 + 1]
    let charValue = String.fromCharCode(tmp as any);
    out += charValue
  }
  return out
}
/**
 * 字符串转byteArray数据格式
 * @param str
 */
const strToBytes=(str:string)=>{
  let bytes = new Array(),len, z;
  len = str.length;
  for (let i = 0; i < len; i++) {
    z = str.charCodeAt(i);
    if (z >= 0x010000 && z <= 0x10FFFF) {
      bytes.push(((z >> 18) & 0x07) | 0xF0);
      bytes.push(((z >> 12) & 0x3F) | 0x80);
      bytes.push(((z >> 6) & 0x3F) | 0x80);
      bytes.push((z & 0x3F) | 0x80);
    } else if (z >= 0x000800 && z <= 0x00FFFF) {
      bytes.push(((z >> 12) & 0x0F) | 0xE0);
      bytes.push(((z >> 6) & 0x3F) | 0x80);
      bytes.push((z & 0x3F) | 0x80);
    } else if (z >= 0x000080 && z <= 0x0007FF) {
      bytes.push(((z >> 6) & 0x1F) | 0xC0);
      bytes.push((z & 0x3F) | 0x80);
    } else {
      bytes.push(z & 0xFF);
    }
  }
  return bytes;
}
/**
 * byteArray数据格式转字符串
 * @param arr
 */
const bytesToStr=(arr:Array<number>)=>{
  if (typeof arr === 'string') {
    return arr;
  }
  let str = '',_arr = arr;
  for (let i = 0; i < _arr.length; i++) {
    let one = _arr[i].toString(2),
        v = one.match(/^1+?(?=0)/);
    if (v && one.length === 8) {
      let bytesLength = v[0].length;
      let store = _arr[i].toString(2).slice(7 - bytesLength);
      for (let st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(_arr[i]);
    }
  }
  return str;
}
export { GenerateId, Suffix, J2T, Backslash, hextoString, strToBytes, bytesToStr }