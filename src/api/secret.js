const CryptoJS = require("crypto-js"); // 引用AES源码js
const key = CryptoJS.enc.Utf8.parse("YOUOTECH12345678"); // 十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse("YOUOTECH12345678"); // 十六位十六进制数作为密钥偏移量

// 加密方法
export function Encrypt(word) {
  console.log(word);
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  console.log(encrypted);
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}
// 解密方法
export function Decrypt(word) {
  let encryptedHexStr = CryptoJS.enc.Base64.parse(word);
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  let decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}
