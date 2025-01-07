import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Campgrounds from "../pages/Campgrounds";
import CampView from "../pages/CampView";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CampgroundEditForm from "../pages/CampgroundEditForm";

export const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    {
        element: <App />,
        children: [
            { path: "/campgrounds", element: <Campgrounds /> },
            { path: "/campground/:id", element: <CampView /> },
            { path: "/campground/:id/edit", element: <CampgroundEditForm /> },
            { path: "/login", element: <LoginPage /> },
            { path: "/register", element: <RegisterPage /> },
            // { path: "*", element: <NotFound /> }
        ]
    },
]);                                                                   