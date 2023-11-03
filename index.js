const express = require('express');
const fs = require('fs');
const qs = require('querystring');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8080;

app.use(cookieParser());
app.get('/checkcookie', function(express, resp) {
  console.log(express.cookies['broadcastrName']);
  console.log(express.cookies['broadcastrPass']);
  
  fs.readFile('userdb', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading userdb:', err);
    return res.status(500).send('Internal Server Error');
  }

  // Split data into lines
  const lines = data.trim().split('\n');
  if (express.cookies['broadcastrName'] !== null && express.cookies['broadcastrPass'] !== null) {
    // Check if the username and password match the userdb
    const userExists = lines.some((line, index) => {
      if (index % 2 === 0) {
        const storedUsername = line.trim();
        const storedPassword = lines[index + 1]?.trim();
        return storedUsername === express.cookies['broadcastrName'] && storedPassword === express.cookies['broadcastrPass'];
        } 
      });
    } else {
    console.log("nulled lol")
    window.location.replace("https://broadcastr-2001.rosewoodpens.repl.co");
    }
    return false;
  });
  if (userExists) {
    res.status(200).send('<h1>Login successful!</h1><script>setTimeout(function(){ window.location.href = "https://broadcastr-2001.rosewoodpens.repl.co/dashboard"; }, 3000);</script>');
  } else {
    // redirect to normal homepage
    console.log("Account does not exist.")
  }
})

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('html'));

app.post('/login', (express, res) => {
  const { username, password } = express.body;

  // Read the userdb file
  fs.readFile('userdb', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading userdb:', err);
      return res.status(500).send('Internal Server Error');
    }

    // Split data into lines
    const lines = data.trim().split('\n');

    // Check if the username and password match the userdb
    const userExists = lines.some((line, index) => {
      if (index % 2 === 0) {
        const storedUsername = line.trim();
        const storedPassword = lines[index + 1]?.trim();
        return storedUsername === username && storedPassword === password;
      }
      return false;
    });

    if (userExists) {
      res.cookie('broadcastrName', username);
      res.cookie('broadcastrPass', password);
      // Respond with a success message and redirect to the homepage
      res.status(200).send('<h1>Login successful!</h1><script>setTimeout(function(){ window.location.href = "https://broadcastr-2001.rosewoodpens.repl.co/dashboard"; }, 3000);</script>');

    } else {
      // Respond with an error message for invalid credentials
      res.status(401).send('<h1>Invalid username or password</h1>');
    }
  });
});

app.post('/signup', (express, res) => {
  const { email, username, password } = express.body;

  // Handle the received data as per your requirements
  // Here, we're just logging the values for demonstration purposes
  console.log('Email:', email);
  console.log('Username:', username);
  console.log('Password:', password);

  fs.appendFile('userdb', username + "\n" + password + "\n\n", function (err) {
    if (err) throw err;
    console.log('Updated userdb!');
  });

  // Respond with an acknowledgment or appropriate response
  res.status(200).send('<h1>Signup successful!</h1>');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});