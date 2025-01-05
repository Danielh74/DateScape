import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Campgrounds from "../pages/Campgrounds";
import CampView from "../pages/CampView";
import CampgroundForm from "../pages/CampgroundForm";

export const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    {
        element: <App />,
        children: [
            { path: "/campgrounds", element: <Campgrounds /> },
            { path: "/campground/new", element: <CampgroundForm /> },
            { path: "/campground/:id", element: <CampView /> },
            { path: "/campground/:id/edit", element: <CampgroundForm /> },
            // { path: "/register", element: <RegisterPage /> },
            // { path: "*", element: <NotFound /> }
        ]
    },
]);                                                                   