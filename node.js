var ws = require("nodejs-websocket");

ws.createServer(function(conn) {
    conn.on("binary", function(data) {
        conn.send(data.data)
    })
    conn.on("text", function(data) {
        conn.send(data)
    })
    conn.on("close", function(code, reason) {
        console.log("关闭连接")
    });
    conn.on("error", function(code, reason) {
        console.log("异常关闭")
    });
}).listen(5555);