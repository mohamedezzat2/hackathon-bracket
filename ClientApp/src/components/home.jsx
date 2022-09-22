// <copyright file="home.tsx" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// </copyright>

import React, { useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import $ from "jquery";
import { Bracket, RoundProps } from 'react-brackets';
import { useState } from "react";

// Handles redirection after successful/failure sign in attempt.
const isPowerOfTwo = number => (number & (number - 1)) === 0;

const featchCurrentBracket = (setPlayers) => {
  
  microsoftTeams.app.initialize().then(() => {
    microsoftTeams.app.getContext().then((context) => {
      const meetingId = context.meeting.id;
      $.ajax({
        url: "/tournmentData?id=" + meetingId,
        type: "GET",
        success: function (bracket) {
          console.log(bracket)
            if(bracket && bracket.stage && bracket.stage.length) {
              document.getElementById('tournment-btn').disabled = true;
              document.getElementById('brackets-viewer').innerHTML = "";
              setPlayers(bracket.participant.length)
              window.bracketsViewer.render({
                stages: bracket.stage,
                matches: bracket.match,
                matchGames: bracket.match_game,
                participants: bracket.participant,
              });
            }
            
            if(bracket && bracket.participant) {
              setPlayers(bracket.participant.length)
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("textStatus: " + textStatus + ", errorThrown:" + errorThrown);
        },
    });
    });
  });
}

const startTournment = (setPlayers) => {
  microsoftTeams.app.initialize().then(() => {
    microsoftTeams.app.getContext().then((context) => {
    console.log('hereee')
      const meetingId = context.meeting.id;
      $.ajax({
        url: "/create?id="+meetingId,
        type: "POST",
        success: function (bracket) {
          console.log(bracket)
            if(bracket && bracket.stage && bracket.stage.length) {
              document.getElementById('brackets-viewer').innerHTML = "";
              document.getElementById('tournment-btn').disabled = true;
              window.bracketsViewer.render({
                stages: bracket.stage,
                matches: bracket.match,
                matchGames: bracket.match_game,
                participants: bracket.participant,
              });
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("textStatus: " + textStatus + ", errorThrown:" + errorThrown);
        },
      });
  
    });
  });
}
const Home = (props) => {
  const [players, setPlayers] = useState(0);
  useEffect(() => {
    featchCurrentBracket(setPlayers)
    setInterval(() => featchCurrentBracket(setPlayers), 5000);
  })
    
  return (
    <div>
      <div id="brackets-viewer" className="brackets-viewer">
      </div>

      <div className="btn-group">
        <p id="error-msg" className={isPowerOfTwo(players) ? "hidden" : ""}>Number of players must be power of two</p>
        <button id="tournment-btn" onClick={() => startTournment(setPlayers)} disabled={!isPowerOfTwo(players)}>Start Tournment</button>
      </div>
    </div>
  )
};

export default Home;