const express = require('express');
const path = require('path');
const app = express();
const { BracketsManager } = require('brackets-manager');
const { JsonDatabase } = require('brackets-json-db');
const storage = new JsonDatabase();
const manager = new BracketsManager(storage);
storage.reset();
const server = require('http').createServer(app);

const tournmentPlayers = {};
// map between the tournment number and the meeting id
const meetingTournmentNumberMap = {};
let tournments_count = 0;

const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

// parse application/json
app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})

const isPowerOfTwo = number => (number & (number - 1)) === 0;

const getIdFromMeetingId = (meeting_id) => {
  if(meetingTournmentNumberMap[meeting_id]) {
    return meetingTournmentNumberMap[meeting_id];
  }
  return meetingTournmentNumberMap[meeting_id] = ++tournments_count;
}
app.post("/addPlayer", async function(req, res) {
  const id = getIdFromMeetingId(req.query.id);
  const player = req.query.player; 
  if (tournmentPlayers[id] == undefined) {
    tournmentPlayers[id] = [];
  }
  const tournment = await manager.get.tournamentData(id);
  if(tournment && tournment.stage && tournment.stage.length) {
    res.status(406).send("Tournment already started!");
    return;
  }
  if(!tournmentPlayers[id].includes(player)) {
    tournmentPlayers[id].push(player);
  }
  
  console.log(player)
  res.send(tournmentPlayers);
});


app.post("/create", async function(req, res) {
  const id = getIdFromMeetingId(req.query.id);
  console.log(id)
  const players = tournmentPlayers[id];
  console.log(tournmentPlayers)
  console.log(players)

  if (players === undefined){
    res.status(406).send("players not found");
    return 
  }

  if(!isPowerOfTwo(players.length)) {
    res.status(406).send("num of players must be power of two");
    return 
  }


  const tournment = await manager.get.tournamentData(id);
  if(tournment && tournment.stage && tournment.stage.length) {
    res.status(200).send(tournment);
    return;
  }

  await manager.create({
    name: 'Tournment',
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
    const id = getIdFromMeetingId(req.query.id);
    const data = await manager.get.tournamentData(id);
    if(data.participant.length == 0) {
      data.participant = tournmentPlayers[id];
    }
    res.status(200).send(data);
});


app.post('/update', async function(req, res) {
  const id = getIdFromMeetingId(req.query.id);
  const match_id = parseInt(req.query.match_id);
  const winner_index = parseInt(req.query.winner_index);

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