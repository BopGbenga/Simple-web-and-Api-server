const http = require("http");
const fs = require("fs");
const path = require("path");
const { BlockNodeDependencies } = require("mathjs");

const shoesDbPath = path.join(__dirname, "items.json");
const shoesDb = [];

const PORT = 3000;

function requestHandler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/shoes" && req.method === "GET") {
    getAll(req, res);
  } else if (req.url === "/shoes" && req.method === "POST") {
    postItem(req, res);
  } else if (req.url === "/shoes" && req.method === "PUT") {
    UpdateItem(req, res);
  } else if (req.url === "/shoes" && req.method === "DELETE") {
    deleteitem(req, res);
  }
}
// GET
function getAll(req, res) {
  fs.readFile(shoesDbPath, "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      res.writeHead(400);
      res.end("An error occured");
    }
    res.end(data);
  });
}

//POST
function postItem(req, res) {
  const body = [];

  req.on("data", (chunk) => {
    body.push(chunk);
  });
  req.on("end", () => {
    const parsedItem = Buffer.concat(body).toString();
    const newItem = JSON.parse(parsedItem);

    const lastItem = shoesDb[shoesDb.length - 1];
    const lastItemId = lastItem ? lastItem.id : 0;
    newItem.id = lastItemId + 1;
    // const lastItemId = lastItem.id;
    // newItem.id = lastItemId + 1;

    shoesDb.push(newItem);

    fs.readFile(shoesDbPath, "utf-8", (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(400);
        res.end("An error occured");
      }

      const oldItem = JSON.parse(data);

      const allItem = [...oldItem, newItem];

      fs.writeFile(shoesDbPath, JSON.stringify(allItem), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(
            JSON.stringify({
              message: "internal server error. could not save book to database",
            })
          );
        }
        res.end(JSON.stringify(newItem));
      });
    });
    console.log(parsedItem);
  });
}

//UPDATE
function UpdateItem(req, res) {
  const body = [];

  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const parsedBody = Buffer.concat(body).toString();
    const itemToUpdate = JSON.parse(parsedBody);
    const bookId = itemToUpdate.id;
    fs.readFile(shoesDbPath, "utf-8", (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(400);
        res.end("An error occured");
      }
      const shoesobj = JSON.parse(data);
      const shoesIndex = shoesobj.findIndex((shoe) => shoe.id === bookId);

      if (shoesIndex === -1) {
        res.writeHead(404);
        res.end("Book not found");
        return;
      }

      const updatedShoe = { ...shoesobj[shoesIndex], ...itemToUpdate };
      shoesobj[shoesIndex] = updatedShoe;

      fs.writeFile(shoesDbPath, JSON.stringify(shoesobj), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(
            JSON.stringify({
              message:
                "internal server Error. could not update book in database.",
            })
          );
        }
      });
    });
  });
}

function deleteitem(req, res) {
  const body = [];

  req.on("data", (chunk) => {
    body.push(chunk);
  });

  req.on("end", () => {
    const parsedBody = Buffer.concat(body).toString();
    const itemToUpdate = JSON.parse(parsedBody);
    const bookId = itemToUpdate.id;
    fs.readFile(shoesDbPath, "utf-8", (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(400);
        res.end("An error occured");
      }
      const shoesobj = JSON.parse(data);
      const shoesIndex = shoesobj.findIndex((shoe) => shoe.id === bookId);

      if (shoesIndex === -1) {
        res.writeHead(404);
        res.end("Book not found");
        return;
      }
      shoesobj.splice(shoesIndex, 1);

      fs.writeFile(shoesDbPath, JSON.stringify(shoesobj), (err) => {
        if (err) {
          console.log(err);
          res.writeHead(500);
          res.end(
            JSON.stringify({
              message:
                "internal server Error. could not update book in database.",
            })
          );
        }
      });
    });
  });
}

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
