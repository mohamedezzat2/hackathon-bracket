import * as React from "react";
import {
    BrowserRouter,
    Route,
    Routes
} from 'react-router-dom';
import Home from "../components/home";
import * as microsoftTeams from "@microsoft/teams-js";
import Configure from "../components/configure";
import $ from "jquery";



export const AppRoute = () => {
    React.useEffect(() => {
        microsoftTeams.app
            .initialize()
            .then(() => {
                console.log("App.js: initializing client SDK initialized");
                microsoftTeams.app.notifyAppLoaded();
                microsoftTeams.app.notifySuccess();

                microsoftTeams.app
                    .getContext()
                    .then(context => {
                        const meetingId = context.meeting.id;
                        const username = context.user.userPrincipalName;
                        $.ajax({
                            url: "/addPlayer?id=" + meetingId + "&player="+username,
                            type: "POST",
                            success: function (bracket) {
                                console.log("added player to tournment!");
                                console.log(bracket);
                            },
                            error: function (xhr, textStatus, errorThrown) {
                                console.log("textStatus: " + textStatus + ", errorThrown:" + errorThrown);
                            },
                        })
                    })

            })
            .catch((error) => console.error(error));
      }, []);

    return (
        <React.Fragment>
            <BrowserRouter>
                <Routes>
                    <Route path="/configure" element={<Configure />}/>
                    <Route path="/appInMeeting" element={<Home />}/>
                </Routes>
            </BrowserRouter>
        </React.Fragment>
    );
};