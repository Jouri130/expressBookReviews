const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
const auth = require('./auth_users.js');

const public_users = express.Router();

const BOOKS_API = 'http://localhost:5000';

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (auth.isValid(username)) {
    return res.status(409).json({ message: 'User already exists' });
  }

  auth.users.push({ username, password });
  return res.status(201).json({ message: 'User successfully registered' });
});

public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get(BOOKS_API);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve books' });
  }
});

public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(BOOKS_API);
    const book = response.data[req.params.isbn];

    if (!book) return res.status(404).json({ message: 'Book not found' });
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve book' });
  }
});

public_users.get('/author/:author', async (req, res) => {
  try {
    const response = await axios.get(BOOKS_API);
    const author = req.params.author.toLowerCase();
    const result = Object.values(response.data).filter(
      book => book.author && book.author.toLowerCase() === author
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve books' });
  }
});

public_users.get('/title/:title', async (req, res) => {
  try {
    const response = await axios.get(BOOKS_API);
    const title = req.params.title.toLowerCase();
    const result = Object.values(response.data).filter(
      book => book.title && book.title.toLowerCase() === title
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve books' });
  }
});

public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: 'Book not found' });
  return res.status(200).json(book.reviews || {});
});

module.exports.general = public_users;
