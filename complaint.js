const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // ✅ Serve static files

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ashok@2005',
  database: 'grama'
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL Connection Error:', err);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL database');
});

// ✅ Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yourgmail@gmail.com', // <-- Replace with your Gmail
    pass: 'your-app-password'    // <-- Use an App Password (not your Gmail password)
  }
});

// ✅ Complaint API Endpoint
app.post('/send-complaint', (req, res) => {
  const { to, from, subject, message, username, issue, language, description } = req.body;

  if (!to || !from || !subject || !message || !username || !issue || !language || !description) {
    return res.status(400).json({ status: "fail", error: "Missing fields" });
  }

  const mailOptions = {
    from,
    to,
    subject,
    text: message
  };

  const query = `INSERT INTO complaints (username, email, issue, description, language, created_at)
                 VALUES (?, ?, ?, ?, ?, NOW())`;

  db.query(query, [username, from, issue, description, language], (err, result) => {
    if (err) {
      console.error("❌ DB Error:", err);
      return res.status(500).json({ status: "fail", error: "Database error" });
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Email Error:", error);
        return res.status(500).json({ status: "fail", error: "Email sending failed" });
      }

      console.log('✅ Complaint Email sent:', info.response);
      return res.status(200).json({
        status: "success",
        message: "Complaint sent successfully and request granted!"
      });
    });
  });
});

// ✅ Load complaint.html at root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'complaint.html'));
});

// ✅ 404 Handler for other routes
app.use((req, res) => {
  res.status(404).json({ status: "fail", error: "Not Found" });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
