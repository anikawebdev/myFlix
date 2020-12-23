const express = require("express");
const morgan = require("morgan");
const bodyParser = require('body-parser');
// const methodOverride = require('method-override');
const server = express();

let movies = [
    {
        id: 1,
        title: "Movie One",
        status: "Top 10",
    },
    {
        id: 2,
        title: "Movie Two",
        status: "Regular", 
    },
    {
        id: 3,
        title: "Movie Three",
        status: "Regular", 
    },
    {
        id: 4,
        title: "Movie Four",
        status: "Regular",
    },
    {
        id: 5,
        title: "Movie Five",
        status: "Regular",
    },
    {
        id: 6,
        title: "Movie Six",
        status: "Regular", 
    },
    {
        id: 7,
        title: "Movie Seven",
        status: "Regular", 
    },
    {
        id: 8,
        title: "Movie Eight",
        status: "Regular", 
    },
    {
        id: 9,
        title: "Movie Nine",
        status: "Regular", 
    },
    {
        id: 10,
        title: "Movie Ten",
        status: "Regular",
    },
    {
        id: 11,
        title: "Movie Eleven",
        status: "Top 10", 
    },
    {
        id: 12,
        title: "Movie Twelve",
        status: "Regular",
    },
    {
        id: 13,
        title: "Movie Thirteen",
        status: "Regular", 
    },
    {
        id: 14,
        title: "Movie Fourteen",
        status: "Regular", 
    },
    {
        id: 15,
        title: "Movie Fifteen",
        status: "Top 10", 
    },
];

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

// Get requests
server.get('/movies', (request, response) => {
    // throw new Error();
    response.json(movies.filter(movie => {return movie.status === "Top 10"}));
});

server.get('/', (request, response) => {
    response.json(movies);
});

// Port
server.listen(8080);


