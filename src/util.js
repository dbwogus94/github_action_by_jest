'use strict';
const fs = require('fs');

function GetFileEncodingHeader(filePath) {
  const readStream = fs.openSync(filePath, 'r');
  const bufferSize = 2;
  const buffer = Buffer.alloc(bufferSize);
  let readBytes = 0;

  if ((readBytes = fs.readSync(readStream, buffer, 0, bufferSize, 0))) {
    return buffer.slice(0, readBytes).toString('hex');
  }

  return '';
}

function ReadFileSyncUtf8(filePath) {
  const fileEncoding = GetFileEncodingHeader(filePath);
  let content = null;

  if (fileEncoding === 'fffe' || fileEncoding === 'utf16le') {
    content = fs.readFileSync(filePath, 'ucs2'); // utf-16 Little Endian
  } else if (fileEncoding === 'feff' || fileEncoding === 'utf16be') {
    content = fs.readFileSync(filePath, 'uts2').swap16(); // utf-16 Big Endian
  } else {
    content = fs.readFileSync(filePath, 'utf8');
  }

  // trim removes the header...but there may be a better way!
  return content.toString('utf8').trimStart();
}

/**
 * ### BOM이 포함된 .json파일을 읽어 json 객체를 리턴한다.
 * 1. .json 파일을 읽어온다.
 * 2. BOM을 찾는다.
 * 3. 원본 데이터에서 BOM을 제거한다.
 * 4. BOM에 맞춰 원본 데이터를 인코딩한다.
 * 5. 인코딩한 문자열을 JSON 객체로 파싱하여 리턴한다.
 * @param {string} filePath
 * @returns
 */
function getJson(filePath) {
  const jsonContents = ReadFileSyncUtf8(filePath);
  //console.log(GetFileEncodingHeader(filePath));

  return JSON.parse(jsonContents);
}

//const data = getJson(require('path').join(__dirname, 'test/data/new-product.json'));
module.exports = getJson;
