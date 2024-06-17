/*
    - nodeJs에서 특정 디렉토리의 파일 목록을 읽는 방법
*/

const fs = require("fs");

// 루트 디렉토리
fs.readdir("/", (_, result) => console.log("root:", result));

// 현재 디렉토리
fs.readdir("./", (_, result) => console.log("current:", result));

// data 디렉토리
fs.readdir("data", (_, result) => console.log("data:", result));

// 배열 반환받아서 어쩌구저쩌구 하고 싶으면 readdirSync 쓰셈
const arr = fs.readdirSync("data", (_, result) => result);
console.log("arr:", arr);
