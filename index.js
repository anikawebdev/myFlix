const path = require('path');
const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser');

const app = express();
const cors = require('cors');
app.use(cors());

const mongoose = require('mongoose');
const Models = require('./models.js');

app.use(bodyParser.json());

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

const { check, validationResult } = require('express-validator');

const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://localhost:27017/myFlixDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(morgan('common'));

app.get('/', (req, res) => {
  res.send('Welcome to movies api');
});

//Get list of movies with authentication
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    //res.json(topmovies);
    Movies.find()
      .then(movies => {
        res.status(201).json(movies);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//Get list of users
app.get('/users', (req, res) => {
  Users.find()
    .then(users => {
      res.status(201).json(users);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Get a user by Username
app.get(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then(user => {
        res.json(user);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//Get data about a movie using authentication
app.get(
  '/movies/:Title',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then(movie => {
        res.json(movie);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//Get description of a genre with authentication
app.get(
  '/movies/genre/:Genre',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Genre })
      .then(movie => {
        res.json(movie.Genre);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//Get a director's details using authentication
app.get(
  '/movies/director/:Director',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Director })
      .then(movie => {
        res.json(movie.Director);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

//Create a new user without using authentication
app.post(
  '/users',
  //Validation logic
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Only alphanumeric allowed').isAlphanumeric(),
    check('Password', 'Password is required')
      .not()
      .isEmpty(),
    check('Email', 'Email not valid').isEmail()
  ],
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOne({ Username: req.body.Username })
      .then(user => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already Exists');
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
            .then(user => {
              res.status(201).json(user);
            })
            .catch(error => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

//Update a user's details using authentication
app.put(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//Add a movie as favorite using authentication
app.post(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID }
      },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//Remove a movie from favorites using authentication
app.delete(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//Delete a user using authentication
app.delete(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then(user => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch(err => {
        console.error(err);
        res.status(400).send('Error: ' + err);
      });
  }
);

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on port ' + port);
});
// app.listen(8080, () => console.log('Your app is listening on port 8080.'));

app.use(express.static('public'));








// app.use('/client', express.static(path.join(__dirname, 'client', 'dist')));
// app.get('/client/*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });







// const express = require("express");
// const morgan = require("morgan");
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { check, validationResult } = require('express-validator');
// // const methodOverride = require('method-override');
// const server = express();
// const mongoose = require('mongoose');
// const Models = require('./models.js');
// const passport = require('passport');
// require('./passport');

// const Movies = Models.Movie;
// const Users = Models.User;

// mongoose.connect('process.env.CONNECTION_URI', { useNewUrlParser: true, useUnifiedTopology: true });

// server.use(express.static('public'));

// // Invoke middleware function
// server.use(morgan('common'));
// server.use(bodyParser.urlencoded({
//     extended: true
// }));
  
// server.use(bodyParser.json());
// // server.use(methodOverride());

// let auth = require('./auth')(server);

// server.use(cors());

// // Error-handling middleware function
// server.use((error, request, response, next) => {
//     console.error(error.stack);
//     response.status(500).send('Something broke');
// });

// //
// //  GET REQUESTS
// //
// server.get('/', (request, response) => {
//     response.send('Welcome to movies api');
//   });

// // Return a list of ALL movies to the user
// server.get('/movies', passport.authenticate('jwt', { session: false }), (request, response) => {
//     Movies.find(
//         {},
//         { Title: 1 },
//     )
//     .then((movies) => {
//         response.status(201).json(movies);
//     })
//     .catch((error) => {
//         console.error(error);
//         response.status(500).send('Error: ' + error);
//     });
// });

// // Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
// server.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (request, response) => {
//     Movies.findOne(
//         { Title: request.params.Title }
//     )
//     .then((movie) => {
//         response.status(201).json(movie);
//     })
//     .catch((error) => {
//         console.error(error);
//         response.status(500).send('Error: ' + error);
//     });
// });

// // Return data about a genre (description) by name/title (e.g., “Thriller”)
// server.get('/movies/:Title/genre', passport.authenticate('jwt', { session: false }), (request, response) => {
//     Movies.findOne(
//         { Title: request.params.Title },
//         {Title: 1, Genre: 1}
//     )
//     .then((movie) => {
//         response.status(201).json(movie);
//     })
//     .catch((error) => {
//         console.error(error);
//         response.status(500).send('Error: ' + error);
//     });
// });
// server.get('/movies/genre/:Name', passport.authenticate('jwt', { session: false }), (request, response) => {
//     Movies.findOne(
//         { "Genre.Name": request.params.Name },
//         {Genre: 1, "_id": 0}
//     )
//     .then((movie) => {
//         response.status(201).json(movie);
//     })
//     .catch((error) => {
//         console.error(error);
//         response.status(500).send('Error: ' + error);
//     });
// });

// // Return data about a director (bio, birth year, death year) by name
// server.get('/movies/director/:Name', passport.authenticate('jwt', { session: false }), (request, response) => {
//     Movies.findOne(
//         { "Director.Name": request.params.Name },
//         {Director: 1, "_id": 0}
//     )
//     .then((movie) => {
//         response.status(201).json(movie);
//     })
//     .catch((error) => {
//         console.error(error);
//         response.status(500).send('Error: ' + error);
//     });
// });

// // 
// // POST REQUESTS
// // 
// // Return a list of ALL movies to the user
// // server.get('/users', passport.authenticate('jwt', { session: false }), (request, response) => {
// //     Movies.find(
// //         {},
// //         { Title: 1 },
// //     )
// //     .then((movies) => {
// //         response.status(201).json(movies);
// //     })
// //     .catch((error) => {
// //         console.error(error);
// //         response.status(500).send('Error: ' + error);
// //     });
// // });

// // Allow new users to register
// server.post('/users', [
//         check('Username', 'Username is required').isLength({min: 5}),
//         check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
//         check('Password', 'Password is required').not().isEmpty(),
//         check('Email', 'Email does not appear to be valid').isEmail()
//     ],
//     (request, response) => {
//         let errors = validationResult(request);

//         if (!errors.isEmpty()) {
//           return response.status(422).json({ errors: errors.array() });
//         }
//         let hashedPassword = Users.hashPassword(request.body.Password);
//         Users.findOne(
//             { Username: request.body.Username }
//         )
//         .then((user) => {
//             if (user) {
//             return response.status(400).send(request.body.Username + ' already exists');
//         } 
//         else {
//             Users
//                 .create({
//                     Username: request.body.Username,
//                     Password: hashedPassword,
//                     Email: request.body.Email,
//                     Birthday: request.body.Birthday,
//                     FavoriteMovies: [],
//                 })
//                 .then((user) =>{response.status(201).json(user) })
//                 .catch((error) => {
//                     console.error(error);
//                     response.status(500).send('Error: ' + error);
//                 })
//         }
//     })
//     .catch((error) => {
//       console.error(error);
//       response.status(500).send('Error: ' + error);
//     });
// });

// // Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later
// server.post('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', { session: false }), (request, response) => {
//     Users.findOneAndUpdate(
//         { Username: request.params.Username }, 
//         {
//             $addToSet: { FavoriteMovies: mongoose.Types.ObjectId(request.params.MovieID) }
//         },
//         { new: true }, // This line makes sure that the updated document is returned
//         (error, updatedUser) => {
//             if (error) {
//                 console.error(error);
//                 response.status(500).send('Error: ' + error);
//             } 
//             else {
//                 response.json(updatedUser);
//             }
//      });
// });

// // 
// // PUT REQUESTS
// // 
// // Allow users to update their user info (username)
// server.put('/users/:Username', passport.authenticate('jwt', { session: false }), [
//     check('Username', 'Username is required').isLength({min: 5}),
//     check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
//     check('Password', 'Password is required').not().isEmpty(),
//     check('Email', 'Email does not appear to be valid').isEmail()
// ], (request, response) => {
//     let errors = validationResult(request);

//     if (!errors.isEmpty()) {
//         return response.status(422).json({ errors: errors.array() });
//     }
//     let hashedPassword = Users.hashPassword(request.body.Password);
    
//     Users.findOneAndUpdate(
//         { Username: request.params.Username }, 
//         { $set:
//             {
//                 Username: request.body.Username,
//                 Password: hashedPassword,
//                 Email: request.body.Email,
//                 Birthday: request.body.Birthday
//             }
//         },
//         { new: true }, // This line makes sure that the updated document is returned
//         (error, updatedUser) => {
//             if(error) {
//                 console.error(error);
//                 response.status(500).send('Error: ' + error);
//             } 
//             else {
//                 response.json(updatedUser);
//             }
//     });
// });

// // 
// // DELETE REQUESTS
// // 
// // Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)
// server.delete('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', { session: false }), (request, response) => {
//     Users.findOneAndUpdate(
//         { 
//             Username: request.params.Username }, 
//         {
//             $pull: { FavoriteMovies: mongoose.Types.ObjectId(request.params.MovieID) }
//         },
//         { new: true }, // This line makes sure that the updated document is returned
//         (error, updatedUser) => {
//             if (error) {
//                 console.error(error);
//                 response.status(500).send('Error: ' + error);
//             } 
//             else {
//                 response.json(updatedUser);
//             }
//      });
// });
// // Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)
// server.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (request, response) => {
//     Users
//     .findOneAndRemove({ Username: request.params.Username })
//     .then((user) => {
//         if (!user) {
//             response.status(400).send(request.params.Username + ' was not found');
//         } 
//         else {
//             response.status(200).send(request.params.Username + ' was deleted.');
//         }
//     })
//     .catch((error) => {
//       console.error(error);
//       response.status(500).send('Error: ' + error);
//     });
// });

// // Port
// // server.listen(8080);
// const port = process.env.PORT || 8080;
// server.listen(port, '0.0.0.0',() => {
//  console.log('Listening on Port ' + port);
// });


