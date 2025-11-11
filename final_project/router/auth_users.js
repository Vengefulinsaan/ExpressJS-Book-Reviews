const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { "username": "cagri", "password": "32", reviews: {} },
    { "username": "user1", "password": "pwd1", reviews: {} },
    { "username": "user2", "password": "pwd2", reviews: {} },
    { "username": "jan2", "password": "123", reviews: {} }
];

const isValid = (username) => {
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

// Login route
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ data: username }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = { accessToken, username };
        return res.status(200).json({ message: "User successfully logged in", accessToken });
    } else {
        return res.status(401).json({ message: "Invalid login. Check username and password" });
    }
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;
    const username = req.session?.authorization?.username;

    if (!username) return res.status(401).json({ message: "User not logged in" });

    const book = Object.values(books).find(book => book.isbn === isbn);
    if (!book) return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });

    const existingReview = book.reviews.find(r => r.username === username);
    if (existingReview) {
        existingReview.review = review;
        return res.json({ message: `Review updated for user ${username}` });
    } else {
        book.reviews.push({ username, review });
        return res.json({ message: `Review added for user ${username}` });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session?.authorization?.username;

    if (!username) return res.status(401).json({ message: "User not logged in" });

    const book = Object.values(books).find(book => book.isbn === isbn);
    if (!book) return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });

    const reviewIndex = book.reviews.findIndex(r => r.username === username);
    if (reviewIndex !== -1) {
        book.reviews.splice(reviewIndex, 1);
        return res.json({ message: `Review deleted for user ${username}` });
    } else {
        return res.json({ message: `No review found for user ${username} on this book.` });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

