const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const app = express();
const { BracketsManager } = require('brackets-manager');
const { JsonDatabase } = require('brackets-json-db');
const { async } = require('q');
const storage = new JsonDatabase();
const manager = new BracketsManager(storage);
storage.reset();
const server = require('http').createServer(app);
const todoData = {};
const doneData = {};
const doingData = {};

const tournmentPlayers = {};

const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

// parse application/json
app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})

app.post("/addPlayer", async function(req, res) {
  const id = req.body.id;
  const players = req.body.players; 
  if (tournmentPlayers[id] == undefined) {
    tournmentPlayers[id] = []
  }
  tournmentPlayers[id].push(...players);
  res.send(tournmentPlayers);
});


app.post("/create", async function(req, res) {
  const id = parseInt(req.body.id);
  const players = tournmentPlayers[id];
  if (players === undefined){
    res.status(406).send("players not found");

    return 
  }
  await manager.create({
    name: 'Example with BYEs',
    tournamentId: id,
    type: 'single_elimination',
    seeding: players,
    settings: {
        seedOrdering: ['natural'],
        balanceByes: false, // Default value.
        size: players.length,
    },
  });

  const data = await manager.get.tournamentData(id);
  res.status(200).send(data);

})

app.get('/tournmentData', async function(req, res) {
    
    const id = parseInt(req.query.id);
    console.log(id);
    const data = await manager.get.tournamentData(id);
    res.status(200).send(data);
});


app.post('/update', async function(req, res) {
    
  const id = parseInt(req.body.id);
  const match_id = parseInt(req.body.match_id);
  const winner_index = parseInt(req.body.winner_index);

  if (winner_index === 1) {
    await manager.update.match({
      id: match_id,
      opponent1: { result:"win" },
      opponent2: {  },
    });
  } else {
    await manager.update.match({
      id: match_id,
      opponent1: {  },
      opponent2: { result:"win" },
    });

  }
 
  const data = await manager.get.tournamentData(id);
  res.status(200).send(data);
});




server.listen(3000, function () {
  console.log('app listening on port 3000!');
});