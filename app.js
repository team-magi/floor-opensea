var { getFloorInfo } = require('./getFloor');
var express = require('express');

var cors = require('./middlewares/cors');
var app = express();

const network = {
  main: "opensea.io",
  test: "testnets.opensea.io"
}

app.use(cors);

app.use('/v1', async function (req, res) {
  const collectionName = req.query.collectionName;
  const website = network[req.query.network] || "testnets.opensea.io";
  var info = await getFloorInfo(website, collectionName);
  res.json(
    info
  );
});

app.listen(4000);
