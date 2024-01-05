const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const port = 5500;

const users = [
    { id: 1, name: 'user1', skills: ['JavaScript', 'HTML', 'CSS'], seeking: ['Python'] },
    { id: 2, name: 'user2', skills: ['Python', 'Java'], seeking: ['JavaScript'] },
];

const skillListings = [
    { id: 101, userId: 1, skill: 'Python', description: 'Offering Python Tutoring.' },
    { id: 102, userId: 2, skill: 'JavaScript', description: 'Offering JavaScript tutoring.' },
];

app.set('view engine', 'ejs');
app.use(express.static('public'));

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
        res.send('Invalid username or password.');
    }
});

// link newAccount to app.js
app.get('/newAccount', (req, res) => {
    res.render('newAccount.ejs');
});

app.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const skills = req.body.skills;
    const seeking = req.body.seeking;
    users.push({ id: users.length + 1, name: username, skills: "", seeking: "" });
    skillListings.push({ id: skillListings.length + 1, userId: users.length, skill: skills, description: seeking });
    res.redirect('/index');
});

app.get('/index', (req, res) => {
    res.render('index.ejs', { users, skillListings });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});