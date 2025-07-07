const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('./messages.db', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

db.run(\`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
\`);

app.post('/messages', (req, res) => {
  const content = req.body.content;
  if (!content) return res.status(400).json({ error: 'Message content is required.' });

  db.run(\`INSERT INTO messages (content) VALUES (?)\`, [content], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Message saved successfully.' });
  });
});

app.get('/messages', (req, res) => {
  db.all(\`SELECT content FROM messages ORDER BY created_at ASC\`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => r.content));
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'greet.html'));
});

app.listen(port, () => {
  console.log(\`🎉 Server running at http://localhost:\${port}\`);
});
