# DateScape Client Side

This README provides details about the client-side implementation of the DateScape application. The frontend is built using React for the UI, Bootstrap for responsive design, and React Router for seamless navigation between pages.

### Features

**Navigation and Routing**

**React Router:** Used for handling navigation between pages, ensuring a smooth single-page application experience.

**Access Control:** If a user attempts to access a restricted page without being logged in, they are automatically redirected to the login page.

**Map Functionalities**

**MapTiler Integration:** Maps are powered by MapTiler to provide an interactive and visually appealing map experience.

**Cluster Map:** The main page features a cluster map that displays all locations, making it easy to explore and identify grouped locations.

**Specific Location View:** Each location's detail page includes a map zoomed in on the specific location, allowing users to see its exact position.

**Design and Responsiveness**

**Bootstrap:** Used for creating a clean, modern, and fully responsive design.

## Project Structure

### Pages:

**Main page:** Displays the cluster map with all locations.

**Login/Register:** Allows users to sign in or create an account.

**Location View:** Displays detailed information about a specific location along with its map.

**Favorites:** Displays the locations that the user assigned as favorites.

**UserLocations:** Displays the locations the user submitted.


### Components:

Map components for rendering cluster and specific location maps.

Form components for location submissions and updates.
