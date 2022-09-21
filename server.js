const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const app = express();
const { BracketsManager } = require('brackets-manager');
const { JsonDatabase } = require('brackets-json-db');
const storage = new JsonDatabase();
const manager = new BracketsManager(storage);
storage.reset();
const server = require('http').createServer(app);
const todoData = {};
const doneData = {};
const doingData = {};

const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

// parse application/json
app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})


app.get('/tournmentData', async function(req, res) {
    storage.reset();
    await manager.create({
        name: 'Example with BYEs',
        tournamentId: 0,
        type: 'single_elimination',
        seeding: [
            'Fadi', 'Team 2',
            'Team 3', 'Team 4',
        ],
        settings: {
            seedOrdering: ['natural'],
            balanceByes: false, // Default value.
            size: 4,
        },
      });
    await manager.update.match({
        id: 0,
        opponent1: { score: 10 , result:"win"},
        opponent2: { score: 0 },
      });

      await manager.update.match({
        id: 1,
        opponent1: { score: 20, result:"win" },
        opponent2: { score: 15 },
      });

      
      await manager.update.match({
        id: 3,
        opponent1: { score: 23, result:"win" },
        opponent2: { score: 11 },
      });
    const b = await manager.get.tournamentData(0);
    res.status(200).send(b);
});

server.listen(3000, function () {
  console.log('app listening on port 3000!');
});