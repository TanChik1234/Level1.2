// цей файл потрібно буде дописати...

// не звертайте увагу на цю функцію 
// вона потрібна для того, щоб коректно зчитувати вхідні данні
function readHttpLikeInput(){
  var fs = require("fs");
  var res = "";
  var buffer = Buffer.alloc ? Buffer.alloc(1) : new Buffer(1);
  let was10 = 0;
  for(;;){ 
      try { fs.readSync(0 /*stdin fd*/, buffer, 0, 1); } catch (e) {break; /* windows */}
      if(buffer[0] === 10 || buffer[0] === 13) {
          if (was10 > 10) 
              break;
          was10++;
      } else 
         was10 = 0;
      res += new String(buffer);
  }

  return res;
}

let contents = readHttpLikeInput();

// ось цю функцію, власне, і треба написати
function parseTcpStringAsHttpRequest(string) { 
  let result = {};
  let arr = string.split('\n');

  result.method = arr[0].split(" ")[0];
  result.uri = arr[0].split(" ")[1];
  result.headers = {};
  let counter = 0;
  arr.splice(0,1);

  for(let str of arr){
    if(str.trim() === "") break;
    str = str.split(": ");
    if(str[0]==="HOST") str[0]="Host";
    result.headers[str[0]] = str[1];
    counter++;
  }
  if(arr.length > counter){
    result.body = arr[counter+1];
  } else {
    result.body = "";
  }
  return result; 
}

http = parseTcpStringAsHttpRequest(contents); 
console.log(JSON.stringify(http, undefined, 2));