/*
    - nodeJs에서 특정 디렉토리의 파일 목록을 읽는 방법
*/
const fs = require("fs");

// 루트 디렉토리 출력
fs.readdir("/", (_, result) => console.log("root:", result));

// 현재 디렉토리 출력
fs.readdir("./", (_, result) => console.log("current:", result));

// data 디렉토리 출력
fs.readdir("data", (_, result) => console.log("data:", result));

/* 
    - 배열 반환받아서 어쩌구저쩌구 하고 싶으면 readdirSync 쓰셈
    - sync 붙은 애들이 반환값이 있음. 그리고 동기적으로 동작하기 때문에 콜백 함수는 안받음
*/
console.log("sync", fs.readdirSync("data"));
