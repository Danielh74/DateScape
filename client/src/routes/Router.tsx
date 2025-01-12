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

export const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    {
        element: <App />,
        children: [
            { path: "/locations", element: <DateLocations /> },
            { path: "/location/:id", element: <LocationView /> },
            { path: "/mylocations", element: <UserLocations /> },
            { path: "/favorites", element: <FavoriteLocations /> },
            { path: "/login", element: <LoginPage /> },
            { path: "/register", element: <RegisterPage /> },
            { path: "*", element: <NotFound /> }
        ]
    },
]);                                                                   