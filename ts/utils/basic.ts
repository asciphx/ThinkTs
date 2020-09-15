/**
 * 随机id生成
 */
const GenerateId = () => {
  return 'xxx'.replace(/x/g, () => (Math.random() * 36 | 0).toString(36))
    + (('0x' + new Date().getTime() as any).toString(16) << 1).toString(36).replace(/^-/, '');
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
export { GenerateId, Suffix, J2T, Backslash, hextoString }