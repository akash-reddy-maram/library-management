const express = require("express");
const path = require("path");
const mysql = require('mysql');


const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'sqluser',
  password: 'password',
  database: 'books_data'
});

const port = 3000; // Set the desired port number
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


let db = null;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Library Management.html'));
});

// app.get('/data/', (req, res) => {
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error('Error connecting to the database: ', err);
//       return res.status(500).json({ error: 'Database connection error' });
//     }
//     const query = `SELECT name, image, author FROM books_dataset LIMIT 100;`;
//     connection.query(query, (err, results) => {
//       connection.release(); // Release the connection back to the pool

//       if (err) {
//         console.error('Error executing query: ', err);
//         return res.status(500).json({ error: 'Database query error' });
//       }

//       // Process and send the query results
//       const allBooksResponse = results.map((eachObj) => {
//         return {
//           imageLink : eachObj.image,
//           title : eachObj.name,
//           author : eachObj.author
//         }
//       })
//       res.send({search_results: allBooksResponse});
//     });
//   });
// });

app.get('/data/', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to the database: ', err);
      return res.status(500).json({ error: 'Database connection error' });
    }
    let {title} = req.query;
    const query = `SELECT book_id, name, image, author, category, concat(price," ", currency) price FROM books_dataset WHERE name LIKE "%${title}%" LIMIT 60;`;
    connection.query(query, (err, results) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error('Error executing query: ', err);
        return res.status(500).json({ error: 'Database query error' });
      }

      // Process and send the query results
      const allBooksResponse = results.map((eachObj) => {
        return {
          bookId : eachObj.book_id,
          imageLink : eachObj.image,
          title : eachObj.name,
          author : eachObj.author,
          price : eachObj.price
        }
      })
      res.send({search_results: allBooksResponse, responses: allBooksResponse.length});
    });
  });
});
