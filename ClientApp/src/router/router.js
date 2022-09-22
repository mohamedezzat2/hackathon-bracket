import * as React from "react";
import {
    BrowserRouter,
    Route,
    Routes
} from 'react-router-dom';
import Home from "../components/home";
import * as microsoftTeams from "@microsoft/teams-js";
import Configure from "../components/configure";



export const AppRoute = () => {
    React.useEffect(() => {
        microsoftTeams.app
            .initialize()
            .then(() => {
            console.log("App.js: initializing client SDK initialized");
            microsoftTeams.app.notifyAppLoaded();
            microsoftTeams.app.notifySuccess();
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