import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import DateLocations from "../pages/DateLocations";
import LocationView from "../pages/LocationView";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFound from "../pages/NotFound";
import FavoriteLocations from "../pages/FavoriteLocations";
import UserLocations from "../pages/UserLocations";
import { AuthRoute, NotAuthRoute } from "./ProtectedRoutes";
import Profile from "../pages/Profile";

export const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    {
        element: <App />,
        children: [
            { path: "/locations", element: <DateLocations /> },
            { path: "/location/:id", element: <LocationView /> },
            { path: "/profile", element: <AuthRoute><Profile /></AuthRoute> },
            { path: "/mylocations", element: <AuthRoute><UserLocations /></AuthRoute> },
            { path: "/favorites", element: <AuthRoute><FavoriteLocations /></AuthRoute> },
            { path: "/login", element: <NotAuthRoute><LoginPage /></NotAuthRoute> },
            { path: "/register", element: <NotAuthRoute><RegisterPage /></NotAuthRoute> },
            { path: "*", element: <NotFound /> }
        ]
    },
]);                                                                   