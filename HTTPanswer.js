
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
//  const date = new Date();

//   const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
//   const formattedDate = `${daysOfWeek[date.getUTCDay()]}, ${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()} GMT`;
   
  let text = `HTTP/1.1 ${statusCode} ${statusMessage}
Server: Apache/2.2.14 (Win32)
Connection: Closed
Content-Type: text/html; charset=utf-8
Content-Length: ${body != undefined ? body.length : 0}

${body}`
     console.log(text);
 }
 
 function processHttpRequest($method, $uri, $headers, $body) {
     let statusCode;
     let statusMessage;
     if($method === "GET" && $uri.startsWith("/sum") && $uri.includes("?nums")){
      statusCode = "200";
      $body = $uri.split("=",2)
                          .splice(1,1);
      $body = $body[0].split(",")
                      .reduce((sumNum, elem)=>{
                        return sumNum + +elem;
                      }, 0) + "";
      statusMessage = "OK";
     } else if($method !== "GET" || $uri.includes("?nums")){
      statusCode = "400";
      statusMessage = "Bad Request";
     } else {
      statusCode ="404";
      statusMessage = "Not Found";
     }
     outputHttpResponse(statusCode, statusMessage, $headers, $body);
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
 