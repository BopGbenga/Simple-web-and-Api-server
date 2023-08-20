const path = require("path");
const fs = require("fs");
const http = require("http");

const webPath = path.join(__dirname, "index.html");

// console.log(webPath);
// const errorPath = path.join(__dirname, "error.html");

const PORT = 4000;

const server = http.createServer(requesthandler);

function requesthandler(req, res) {
  if (req.url === "/index.html" || req.url === "/") {
    fs.readFile(webPath, "utf-8", (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end();
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else {
    fs.readFile("./error.html", "utf-8", (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(404, { "Content-Type": "text/html" });
      }
      res.end(data);
    });
  }
}

server.listen(PORT, () => {
  console.log(`server has started running locally at http://localhost:${PORT}`);
});
