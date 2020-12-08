import { createHash } from 'crypto';//常量c中不好区分的后四位字符，在下面的注释中
const c = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZياخش'; //"ي", "ا", "خ", "ش"
type T = "md5"|"sha1"|"shake128"|"shake256"|"sha256"|"sha224"|"sha512"|"sha384"|"sm3"|"whirlpool"|"ripemd";
type H = "latin1"|"hex"|"base64";
/**
 * 加密登录密码,digest只有"hex"|"base64"支持utf8，而latin1在mysql里面是utf8mb4，postgres是utf8
 * outputLength:加密后的密码长度=latin1，*1.25~1.45=base64，*2=hex
 * 28的outputLength使用latin1输出的长度是28，base64是40，hex则56
 * 对于outputLength输出,shake支持任意长度,ripemd只支持20,其他一般是16的倍数
 * @param pwd 登录密码
 */
const encrypt = (pwd: string,type:T='shake128',digest:H='hex',length:number=25): string => {
  return createHash(type, { outputLength: length }).update(pwd).digest(digest);
}
/**
 * 检查登录密码是否正确
 * @param pwd 登录密码
 * @param encryptedPwd 加密后的密码
 */
const checkPwd = (pwd: string, encryptedPwd,type:T,digest:H,length:number): boolean => {
  const currentPass = encrypt(pwd,type,digest,length);
  if (currentPass === encryptedPwd)return true;return false;
}
/**
 * 编码中文
 * @param string 中文
 */
const utf8_encode = (string: string) => {
  string = string.replace(/\r\n/g, "\n");
  var utftext = "";
  for (var n = 0; n < string.length; n++) {
    var z = string.charCodeAt(n);
    if (z < 128) {
      utftext += String.fromCharCode(z);
    } else if (z > 127 && z < 2048) {
      utftext += String.fromCharCode(z >> 6|192);
      utftext += String.fromCharCode(z & 63|128);
    } else {
      utftext += String.fromCharCode(z >> 12|224);
      utftext += String.fromCharCode(z >> 6 & 63|128);
      utftext += String.fromCharCode(z & 63|128);
    }
  }
  return utftext;
}
/**
 * 解码utf8
 * @param utf8 utf8字符
 */
const utf8_decode = (utf8: string) => {
  let string = "", i = 0, z = 0;
  while (i < utf8.length) {
    z = utf8.charCodeAt(i);
    if (z < 128) {
      string += String.fromCharCode(z);
      ++i;
    } else if (z > 191 && z < 224) {
      string += String.fromCharCode((z & 31) << 6|(utf8.charCodeAt(i + 1) & 63));
      i += 2;
    } else {
      string += String.fromCharCode((z & 15) << 12|(utf8.charCodeAt(i + 1) & 63) << 6|(utf8.charCodeAt(i + 2)
        & 63));
      i += 3;
    }
  }
  return string;
}
/**
 * 整数转62进制
 * @param n 数字
 */
const IntTo62 = (n: number) => {
  let s = '', t;
  do {
    t = n % 62;
    n = (n - t) / 62;
    s = c.charAt(t) + s;
  }
  while (n);
  return s;
};
/**
 * 十进制转任意
 * @param v 十进制数
 * @param n 几进制
 */
const TenToN=(v:number,n:number):string=>{
  if(n>66||n<2||v>9007199254740991)return;
  let num="",mod
  for(let i=1;i<54;i++){mod=v%n;v=Math.floor(v/n);
    if(v>0){num=c.charAt(mod)+num
    }else return c.charAt(mod)+num;
  }
}
/**
 * 任意进制转十进制
 * @param v 任意进制字符串
 * @param n 表示v是多少进制
 */
const NTo10=(v:string,n:number):number=>{if(n>66||n<2)return;if(n<37)v=v.toLowerCase();
  let addNumber=0,l=v.length
  for(let i=0;i<l;i++){if(c.indexOf(v.charAt(i))===-1)return
    for(let h=0;h<66;h++){
      if(v.charAt(l-i-1)===c.charAt(h)){
        addNumber=addNumber+h*Math.pow(n,i);
      }
    }
  }
  return addNumber;
}
export { T, H, encrypt, checkPwd, utf8_encode, utf8_decode, IntTo62, TenToN, NTo10 }