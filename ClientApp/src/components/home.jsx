// <copyright file="home.tsx" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// </copyright>

import React, { useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import $ from "jquery";
import { Bracket, RoundProps } from 'react-brackets';


// Handles redirection after successful/failure sign in attempt.

const featchCurrentBracket = () => {
  $.ajax({
    url: "http://localhost:3000/tournmentData",
    type: "GET",
    success: function (bracket) {
      console.log(bracket)
        if(bracket) {
          document.getElementById('brackets-viewer').innerHTML = "";
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
}
const Home = (props) => {
  useEffect(() => {
    featchCurrentBracket()
    setInterval(() => featchCurrentBracket(), 10000);
  })
    
  return (<div id="brackets-viewer" className="brackets-viewer"></div>)
};

export default Home;