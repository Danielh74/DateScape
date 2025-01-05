import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Campgrounds from "../pages/Campgrounds";
import CampView from "../pages/CampView";

export const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    {
        element: <App />,
        children: [
            { path: "/campgrounds", element: <Campgrounds /> },
            { path: "/campground/:id", element: <CampView /> },
            // { path: "/register", element: <RegisterPage /> },
            // { path: "*", element: <NotFound /> }
        ]
    },
]);                                                                   