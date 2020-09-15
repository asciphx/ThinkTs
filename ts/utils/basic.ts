const IntTo62 = (n: number) => {
  const c = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ'; let s = '', t;
  do {
    t = n % 62;
    n = (n - t) / 62;
    s = c.charAt(t) + s;
  }
  while (n);
  return s;
};
const GenerateId = () => {
  return 'xxx'.replace(/x/g, () => (Math.random() * 36 | 0).toString(36))
    + (('0x' + new Date().getTime() as any).toString(16) << 1).toString(36).replace(/^-/, '');
}
const Suffix = (name: string) => name.replace(/().*(?=)\./, '\.')
const J2T = (json: string) => json.replace(/(\\|\\'|\"|\n)/g, "\\\$1")
const Backslash = (str: string) => {
  let stri = str.split("\\", -1), b: string = "\\";
  for (let a = 0; a < stri.length; a++) {
    if (stri[a] != "") {
      if (a != 0) b = b + "\\\\" + stri[a]; else b = b + stri[a];
    } else { if (a > 1 || stri[0] != "") b = b + "\\\\"; else b = b + "\\"; }
  }; return b;
}
const hextoString=(hex)=>{
  let arr = hex.split("")
  let out = ""
  for (let i = 0; i < arr.length / 2; i++) {
    let tmp = "0x" + arr[i * 2] + arr[i * 2 + 1]
    let charValue = String.fromCharCode(tmp as any);
    out += charValue
  }
  return out
}
export { IntTo62, GenerateId, Suffix, J2T, Backslash, hextoString }