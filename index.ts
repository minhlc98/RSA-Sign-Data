import * as fs from "fs";
import * as crypto from 'crypto';

const dataToSign = JSON.stringify({ name: 'Test', email: 'test@gmail.com' });

const getFile = (path: string) : Promise<string> => new Promise(resolve => fs.readFile(path, 'utf8', (err: any, data: string) => resolve(data)));

const generateDigitalSignature = (privateKey: string, data: string) : string => {
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(data);
  return sign.sign(privateKey, 'hex');
}

const validateDigitalSignature = (publicKey: string, data: string, receivedSignature: string) : boolean => {
  const verify = crypto.createVerify('RSA-SHA256');
  verify.update(data);
  return verify.verify(publicKey, receivedSignature, 'hex');
}

async function main() {
  const privateKey = await getFile('./private-key.pem');
  const signature = generateDigitalSignature(privateKey, dataToSign);

  console.log("Generated Signature: ", signature);

  const publicKey = await getFile('./public-key.pem');
  const validateResult = validateDigitalSignature(publicKey, dataToSign, signature);
  console.log("Validation Result: ", validateResult);
}

main();