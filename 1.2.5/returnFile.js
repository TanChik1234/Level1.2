
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
 
 function outputHttpResponse(statusCode, statusMessage, headers, body) {
  let text = `HTTP/1.1 ${statusCode} ${statusMessage}
Server: Apache/2.2.14 (Win32)
Content-Length: ${body != undefined ? body.length : 0}
Connection: Closed
Content-Type: text/html; charset=utf-8

${body}`
     console.log(text);
 }
 
 function processHttpRequest($method, $uri, $headers, $body) {
    let path;
    if($headers["Host"].startsWith("student.shpp.me")){
      path = "student";
    } else if($headers["Host"].startsWith("another.shpp.me")){
      path = "another";
    } else {
      outputHttpResponse("404", "Bad Request", $headers, $body);
      return;
    }

    if($uri === "/"){
      path = path + "\\index.html";
    } else {
      path = path + $uri.replaceAll("/", "\\");
    }
    $body = require("fs").readFileSync(path);
    if($body === undefined){
      outputHttpResponse("404", "Bad Request", $headers, "");
    }
     outputHttpResponse("200", "OK", $headers, $body);
 }
 
 function parseTcpStringAsHttpRequest($string) {
  let result = {};
  let arr = $string.split('\n');

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
 processHttpRequest(http.method, http.uri, http.headers, http.body);
 