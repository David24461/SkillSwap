// Constants
const express = require('express');
const app = express();
const sqlite3 = require("sqlite3");
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
dotenv.config({ path: './.env' })
const port = 5500;

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database('userData.db');

const users = [
    { id: 1, name: 'user1', skills: ['JavaScript', 'HTML', 'CSS'], seeking: ['Python'] },
    { id: 2, name: 'user2', skills: ['Python', 'Java'], seeking: ['JavaScript'] },
];

const skillListings = [
    { id: 101, userId: 1, skill: ['Python'], description: 'Offering Python Tutoring.' },
    { id: 102, userId: 2, skill: ['JavaScript'], description: 'Offering JavaScript tutoring.' },
];

// Login route
app.get('/', (req, res) => {
    res.render('login.ejs');
});

// Handle login form submission
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Authenticate user here
    // This is just a dummy check for demonstration purposes
    const user = users.find(user => user.name === username);
    if (user == user && password === 'password') {
        res.redirect('/index');
    } else {
        // make an alert pop up telling the user the username or passowrd is invalid
        res.send('<script>alert("Invalid username or password."); window.location.href = "/";</script>');
    }
});

// link newAccount to app.js
app.get('/create', (req, res) => {
    res.render('create.ejs');
});

app.post('/signup', (req, res) => {
    const password = req.body.password;
    const username = req.body.username;
    const skills = req.body.skills;
    const seeking = req.body.seeking;
    const description = req.body.description;
    users.push({ id: users.length + 1, name: username, skills: [], seeking: [] });
    users[users.length - 1].skills.push(skills);
    users[users.length - 1].seeking.push(seeking);
    skillListings.push({ id: skillListings.length + 1, userId: users.length, skill: skills, description: description });
    console.log(users);
    res.redirect('/index');
});

app.get('/index', (req, res) => {
    res.render('index.ejs', { users, skillListings });
});

app.get('/profiles/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(user => user.id === userId);
    if (!user) {
        res.status(404).send('User not found');
    } else {
        res.render('profile.ejs', { user });
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});