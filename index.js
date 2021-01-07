const express = require("express");
const morgan = require("morgan");
const bodyParser = require('body-parser');
// const methodOverride = require('method-override');
const server = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

// let movies = [
//     {
//         id: 1,
//         title: "Movie One",
//         status: "Top 10",
//         description: "description 1",
//         genre: "genre 1",
//         director: {
//             name: "director 1",
//             bio: "bio 1",
//             birthyear: "1951",
//             deathyear: "2020",
//         },
//         image: "image 1",
//     },
//     {
//         id: 2,
//         title: "Movie Two",
//         status: "Regular", 
//         description: "description 2",
//         genre: "genre 2",
//         director: {
//             name: "director 2",
//             bio: "bio 2",
//             birthyear: "1952",
//             deathyear: "",
//         },
//         image: "image 2",
//     },
//     {
//         id: 3,
//         title: "Movie Three",
//         status: "Regular", 
//         description: "description 3",
//         genre: "genre 3",
//         director: {
//             name: "director 3",
//             bio: "bio 3",
//             birthyear: "1953",
//             deathyear: "2020",
//         },
//         image: "image 3",
//     },
//     {
//         id: 4,
//         title: "Movie Four",
//         status: "Regular",
//         description: "description 4",
//         genre: "genre 4",
//         director: {
//             name: "director 4",
//             bio: "bio 4",
//             birthyear: "1954",
//             deathyear: "",
//         },
//         image: "image 4",
//     },
//     {
//         id: 5,
//         title: "Movie Five",
//         status: "Regular",
//         description: "description 5",
//         genre: "genre 5",
//         director: {
//             name: "director 5",
//             bio: "bio 5",
//             birthyear: "1955",
//             deathyear: "2020",
//         },
//         image: "image 5",
//     },
//     {
//         id: 6,
//         title: "Movie Six",
//         status: "Regular",
//         description: "description 6",
//         genre: "genre 6",
//         director: {
//             name: "director 6",
//             bio: "bio 6",
//             birthyear: "1956",
//             deathyear: "",
//         },
//         image: "image 6", 
//     },
//     {
//         id: 7,
//         title: "Movie Seven",
//         status: "Regular", 
//         description: "description 7",
//         genre: "genre 7",
//         director: {
//             name: "director 7",
//             bio: "bio 7",
//             birthyear: "1957",
//             deathyear: "2020",
//         },
//         image: "image 7",
//     },
//     {
//         id: 8,
//         title: "Movie Eight",
//         status: "Regular", 
//         description: "description 8",
//         genre: "genre 8",
//         director: {
//             name: "director 8",
//             bio: "bio 8",
//             birthyear: "1958",
//             deathyear: "",
//         },
//         image: "image 8",
//     },
//     {
//         id: 9,
//         title: "Movie Nine",
//         status: "Regular", 
//         description: "description 9",
//         genre: "genre 9",
//         director: {
//             name: "director 9",
//             bio: "bio 9",
//             birthyear: "1959",
//             deathyear: "2020",
//         },
//         image: "image 9",
//     },
//     {
//         id: 10,
//         title: "Movie Ten",
//         status: "Regular",
//         description: "description 10",
//         genre: "genre 10",
//         director: {
//             name: "director 10",
//             bio: "bio 10",
//             birthyear: "1960",
//             deathyear: "",
//         },
//         image: "image 10",
//     },
//     {
//         id: 11,
//         title: "Movie Eleven",
//         status: "Top 10", 
//         description: "description 11",
//         genre: "genre 11",
//         director: {
//             name: "director 11",
//             bio: "bio 11",
//             birthyear: "1961",
//             deathyear: "2020",
//         },
//         image: "image 11",
//     },
//     {
//         id: 12,
//         title: "Movie Twelve",
//         status: "Regular",
//         description: "description 12",
//         genre: "genre 12",
//         director: {
//             name: "director 12",
//             bio: "bio 12",
//             birthyear: "1962",
//             deathyear: "",
//         },
//         image: "image 12",
//     },
//     {
//         id: 13,
//         title: "Movie Thirteen",
//         status: "Regular", 
//         description: "description 13",
//         genre: "genre 13",
//         director: {
//             name: "director 13",
//             bio: "bio 13",
//             birthyear: "1963",
//             deathyear: "2020",
//         },
//         image: "image 13",
//     },
//     {
//         id: 14,
//         title: "Movie Fourteen",
//         status: "Regular", 
//         description: "description 14",
//         genre: "genre 14",
//         director: {
//             name: "director 14",
//             bio: "bio 14",
//             birthyear: "1964",
//             deathyear: "",
//         },
//         image: "image 14",
//     },
//     {
//         id: 15,
//         title: "Movie Fifteen",
//         status: "Top 10", 
//         description: "description 15",
//         genre: "genre 15",
//         director: {
//             name: "director 15",
//             bio: "bio 15",
//             birthyear: "1965",
//             deathyear: "2020",
//         },
//         image: "image 15",
//     },
// ];

server.use(express.static('public'));

// Invoke middleware function
server.use(morgan('common'));
server.use(bodyParser.urlencoded({
    extended: true
}));
  
server.use(bodyParser.json());
// server.use(methodOverride());

// Error-handling middleware function
server.use((error, request, response, next) => {
    console.error(error.stack);
    response.status(500).send('Something broke');
});

//
//  GET REQUESTS
// 
// Return a list of ALL movies to the user
server.get('/', (request, response) => {
    response.json(movies);
});

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
server.get('/movies/:title', (request, response) => {
    response.send("Successful GET request returning single movie data");
});

// Return data about a genre (description) by name/title (e.g., “Thriller”)
server.get('/movies/:title/:genre', (request, response) => {
    response.send("Successful GET request by title returning genre data");
});
server.get('/movies/:name/:genre', (request, response) => {
    response.send("Successful GET request by name returning genre data");
});

// Return data about a director (bio, birth year, death year) by name
server.get('/movies/:director', (request, response) => {
    response.send("Successful GET request returning director data");
});

// 
// POST REQUESTS
// 
// Allow new users to register
server.post('/register', (request, response) => {
    response.send("Successful POST request registration");
});

// Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later
server.post('/users/favorites', (request, response) => {
    response.send("Successful POST request favorites");
});

// 
// PUT REQUESTS
// 
// Allow users to update their user info (username)
server.put('/users/:id', (request, response) => {
    response.send("Successful PUT request update");
});

// 
// DELETE REQUESTS
// 
// Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)
server.delete('/users/favorites/:id', (request, response) => {
    response.send("Successful DELETE request favorites");
});
// Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)
server.delete('/users/:id', (request, response) => {
    response.send("Successful DELETE request users");
});

// Port
server.listen(8080);


