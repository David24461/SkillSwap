// Constants
const express = require('express');
const app = express();
const sqlite3 = require("sqlite3");
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const axios = require('axios');
const session = require('express-session');
const port = 5500;
const saltRounds = 5;

const db = new sqlite3.Database('Users.db');

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'skillswap',
    resave: false,
    saveUninitialized: true,
}));

// Login route
app.get('/login', (req, res) => {
    res.render('login.ejs');
});

// Handle login form submission
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Query the database to find the user
    db.get(`SELECT * FROM users WHERE Name = ?`, [username], (err, row) => {
        if (err) {
            console.log(err.message);
            return res.status(500).send({ error: 'Database error' });
        }
        // If the user is found
        if (row) {
            // console.log(row);
            // Compare the provided password with the stored hash using bcrypt for encryption
            bcrypt.compare(password, row.Password, function (err, result) {
                if (err) {
                    console.log(err.message);
                    return res.status(500).send({ error: 'Error comparing passwords' });
                }
                if (result) {
                    // If the password is correct, set the session user and redirect to index (home page)
                    req.session.user = row;
                    return res.redirect('/index');
                } else {
                    // If the password is incorrect, send an error message
                    return res.status(401).send({ error: 'Incorrect password' });
                }
            });
        } else {
            // If the user is not found, send an error message
            return res.redirect('/login?error=User not found');
        }
    });
});

// link create.ejs to app.js
app.get('/create', (req, res) => {
    res.render('create.ejs');
});

// Handle create form submission
app.post('/signup', (req, res) => {
    const password = req.body.password;
    const username = req.body.username;
    const skills = req.body.skills;
    const seeking = req.body.seeking;
    const description = req.body.description;
    bcrypt.hash(password, saltRounds, function (err, hash) {
        db.run(`INSERT INTO users(Name, Password, Skills, Seeking, Description) VALUES(?, ?, ?, ?, ?)`, [username, hash, skills, seeking, description], function (err) {
            if (err) {
                console.log(err.message);
                return res.status(500).send({ error: 'Database error' });
            } else {
                // get the last insert id
                console.log(`A row has been inserted with row-ID ${this.lastID}`);
                return res.redirect('/index');
            }
        });
    });
});

app.get('/search', (req, res) => {
    const query = req.query.query;
    db.all(`SELECT * FROM users WHERE name LIKE ?`, [`%${query}%`], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        res.render('index', { users: rows });
    });
});

// link index.ejs to app.js
app.get('/index', (req, res) => {
    if (req.session.user) {
        db.all(`SELECT * FROM users`, [], (err, rows) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(rows)
            res.render('index', { users: rows });
        });
    } else {
        res.redirect('/login');
    }
});

const users = []; // Declare the users array

app.get('/profiles/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    //const userId = 12;
    db.all(`SELECT * FROM users WHERE ID = ?`, userId, (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        var user = row.find(user => user.id === userId);
        console.log(row);
        res.render('profiles', { users: row[0] });
    });
});

app.get('/certificationTest', (req, res) => {
    // Fetch the certification tests from your database or another data source here
    const certificationTests = [];

    // Render the certification tests page with the certification tests data
    res.render('certificationTest', { certificationTests });
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/login`);
});