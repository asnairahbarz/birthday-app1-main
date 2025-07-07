const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const messagesFile = path.join(__dirname, 'messages.json');

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => res.redirect('/greet.html'));
app.get('/greet.html', (req, res) => res.sendFile(path.join(__dirname, 'greet.html')));
app.get('/celebrant.html', (req, res) => res.sendFile(path.join(__dirname, 'celebrant.html')));

// API to get and post messages
app.get('/messages', (req, res) => {
  fs.readFile(messagesFile, 'utf-8', (err, data) => {
    res.json(err ? [] : JSON.parse(data || '[]'));
  });
});

app.post('/messages', (req, res) => {
  const newMessage = req.body.message;
  fs.readFile(messagesFile, 'utf-8', (err, data) => {
    const messages = !err && data ? JSON.parse(data) : [];
    messages.push(newMessage);
    fs.writeFile(messagesFile, JSON.stringify(messages, null, 2), err => {
      if (err) return res.status(500).send("Error saving");
      res.json({ message: newMessage });
    });
  });
});

app.listen(PORT, () => console.log(`?? Birthday App running at http://localhost:${PORT}`));
