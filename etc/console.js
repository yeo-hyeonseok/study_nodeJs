/*
    - nodeJs에서 console 인자값을 받는 방법
*/
const args = process.argv;

// ['내 컴퓨터에서 nodeJs가 설치된 위치', '현재 실행 중인 파일의 절대경로', '인자값1', '인자값2', ...]
console.log(args);

args[2] == 1 ? console.log("응") : console.log("아니야");
