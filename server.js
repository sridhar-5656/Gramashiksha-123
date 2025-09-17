// import express from 'express';
// import mysql from 'mysql2';
// import bcrypt from 'bcrypt';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Serve static frontend files
// app.use(express.static(path.join(__dirname))); // put your HTML, CSS, JS inside 'public' folder

// // MySQL connection
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Ashok@2005',
//   database: 'gramashiksha'
// });

// db.connect(err => {
//   if (err) {
//     console.error('Database connection failed:', err);
//     return;
//   }
//   console.log('Connected to MySQL');
// });

// // Signup route
// app.post('/signup', async (req, res) => {
//   const { name, email, password } = req.body;
//   if (!name || !email || !password) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     db.query(
//       'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
//       [name, email, hashedPassword],
//       (err) => {
//         if (err) {
//           if (err.code === 'ER_DUP_ENTRY') {
//             return res.status(400).json({ error: 'Email already exists' });
//           }
//           return res.status(500).json({ error: 'Database error' });
//         }
//         res.json({ message: 'Signup successful' });
//       }
//     );
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Login route
// app.post('/login2', (req, res) => {
//   const { email, password } = req.body;

//   db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
//     if (err) return res.status(500).json({ error: 'Database error' });
//     if (results.length === 0) return res.status(400).json({ error: 'Invalid email or password' });

//     const user = results[0];
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ error: 'Invalid email or password' });

//     res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
//   });
// });

// // Home route (to handle GET requests)
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname,'signup.html'));
// });

// app.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });





// server.js
import express from 'express';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static frontend files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname))); // public folder contains signup.html, login.html, index.html

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // your MySQL username
  password: 'Ashok@2005', // your MySQL password
  database: 'gramashiksha'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Signup route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      (err) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Signup successful' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(400).json({ error: 'Invalid email or password' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid email or password' });

    res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
