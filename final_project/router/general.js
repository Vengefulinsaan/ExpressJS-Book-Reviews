const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  
public_users.post("/register", (req, res) => {
    const { username, password } = req.body; // use body instead of query

    if (username && password) {
        if (!doesExist(username)) { 
            users.push({ username, password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(400).json({ message: "User already exists!" });    
        }
    } 
    return res.status(400).json({ message: "Unable to register user. Username and/or password not provided" });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify({ books }, null, 4));
});

// Get the user list available in the shop
public_users.get('/users', function (req, res) {
    res.send(JSON.stringify({ users }, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = Object.values(books).find(book => book.isbn === isbn);

    if (book) {
        res.send(JSON.stringify(book, null, 4));
    } else {
        res.send(`Book with ISBN ${isbn} not found.`);
    }
}); 

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const book = Object.values(books).find(book => book.author === author);

    if (book) {
        res.send(JSON.stringify(book, null, 4));
    } else {
        res.send(`Book with author name ${author} not found.`);
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const book = Object.values(books).find(book => book.title === title);

    if (book) {
        res.send(JSON.stringify(book, null, 4));
    } else {
        res.send(`Book with title ${title} not found.`);
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = Object.values(books).find(book => book.isbn === isbn);
    const review = book.reviews;
    if (book) {
        res.send(JSON.stringify(review, null, 4));
    } else {
        res.send(`Book with ISBN ${isbn} not found.`);
    }
});



public_users.get('/all-books-callback', function (req, res) {
    function getBooks(callback) {
        // simulate async operation
        setTimeout(() => {
            callback(null, books); // first argument: error, second: result
        }, 100);
    }

    getBooks((err, result) => {
        if (err) {
            res.status(500).json({ message: "Error fetching books" });
        } else {
            res.json(result);
        }
    });
});



// Task 11: Search by ISBN using callback
public_users.get('/search-isbn-callback/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    function findBookByISBN(isbn, callback) {
        setTimeout(() => {
            const book = Object.values(books).find(b => b.isbn === isbn);
            callback(null, book);
        }, 100);
    }

    findBookByISBN(isbn, (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error fetching book" });
        } else if (!result) {
            res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
        } else {
            res.json(result);
        }
    });
});

// Task 11: Search by ISBN using async/await
public_users.get('/search-isbn-async/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    function getBook() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const book = Object.values(books).find(b => b.isbn === isbn);
                resolve(book);
            }, 100);
        });
    }

    const book = await getBook();
    if (!book) {
        res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    } else {
        res.json(book);
    }
});

// Task 12: Search by Author using callback
public_users.get('/search-author-callback/:author', (req, res) => {
    const author = req.params.author;

    function findBookByAuthor(author, callback) {
        setTimeout(() => {
            const book = Object.values(books).find(b => b.author === author);
            callback(null, book);
        }, 100);
    }

    findBookByAuthor(author, (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error fetching book" });
        } else if (!result) {
            res.status(404).json({ message: `Book by author ${author} not found.` });
        } else {
            res.json(result);
        }
    });
});

// Task 12: Search by Author using async/await
public_users.get('/search-author-async/:author', async (req, res) => {
    const author = req.params.author;

    function getBook() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const book = Object.values(books).find(b => b.author === author);
                resolve(book);
            }, 100);
        });
    }

    const book = await getBook();
    if (!book) {
        res.status(404).json({ message: `Book by author ${author} not found.` });
    } else {
        res.json(book);
    }
});

// Task 13: Search by Title using callback
public_users.get('/search-title-callback/:title', (req, res) => {
    const title = req.params.title;

    function findBookByTitle(title, callback) {
        setTimeout(() => {
            const book = Object.values(books).find(b => b.title === title);
            callback(null, book);
        }, 100);
    }

    findBookByTitle(title, (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error fetching book" });
        } else if (!result) {
            res.status(404).json({ message: `Book with title "${title}" not found.` });
        } else {
            res.json(result);
        }
    });
});

// Task 13: Search by Title using async/await
public_users.get('/search-title-async/:title', async (req, res) => {
    const title = req.params.title;

    function getBook() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const book = Object.values(books).find(b => b.title === title);
                resolve(book);
            }, 100);
        });
    }

    const book = await getBook();
    if (!book) {
        res.status(404).json({ message: `Book with title "${title}" not found.` });
    } else {
        res.json(book);
    }
});




module.exports.general = public_users;
