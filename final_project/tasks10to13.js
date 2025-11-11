// tasks10to13.js
// Book Review Project - Tasks 10–13
// Requires: axios (npm install axios)

const axios = require('axios');
const BASE_URL = 'http://localhost:5000';

// --- Task 10: Get all books (async/await) ---
async function getAllBooks() {
  try {
    const res = await axios.get(`${BASE_URL}/books`);
    console.log("Task 10 - All Books:", res.data);
  } catch (err) {
    console.error("Task 10 - Error:", err.message);
  }
}

// --- Task 11: Search by ISBN (Promises) ---
function getBookByISBN(isbn) {
  axios.get(`${BASE_URL}/books/isbn/${isbn}`)
    .then(res => console.log("Task 11 - Book by ISBN:", res.data))
    .catch(err => console.error("Task 11 - Error:", err.message));
}

// --- Task 12: Search by Author (async/await) ---
async function getBooksByAuthor(author) {
  try {
    const res = await axios.get(`${BASE_URL}/books/author/${author}`);
    console.log("Task 12 - Books by Author:", res.data);
  } catch (err) {
    console.error("Task 12 - Error:", err.message);
  }
}

// --- Task 13: Search by Title (Promises) ---
function getBooksByTitle(title) {
  axios.get(`${BASE_URL}/books/title/${title}`)
    .then(res => console.log("Task 13 (Promise) - Books by Title:", res.data))
    .catch(err => console.error("Task 13 (Promise) - Error:", err.message));
}

// --- Task 13 (Callback version) ---
function getBooksByTitleCallback(title, callback) {
  axios.get(`${BASE_URL}/books/title/${title}`)
    .then(res => callback(null, res.data))
    .catch(err => callback(err));
}

// Run all tasks
(async () => {
  console.log("---- Running Tasks 10–13 ----");
  await getAllBooks(); // Task 10
  getBookByISBN("1234"); // Task 11
  await getBooksByAuthor("Author A"); // Task 12
  getBooksByTitle("Book One"); // Task 13 (Promises)

  // Task 13 (Callback)
  getBooksByTitleCallback("Book One", (err, data) => {
    if (err) {
      console.error("Task 13 (Callback) - Error:", err.message);
    } else {
      console.log("Task 13 (Callback) - Books by Title:", data);
    }
  });
})();
