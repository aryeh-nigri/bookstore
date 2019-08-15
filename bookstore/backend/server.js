const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();

// Bodyparser Middleware
app.use(express.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to Mongo
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true
  }) // Adding new mongo url parser
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));


app.use(cors());

// Use Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/books", require("./routes/api/books"));
app.use("/api/auth", require("./routes/api/auth"));

// // Serve static assets if in production
// if (process.env.NODE_ENV === 'production') {
//   // Set static folder
//   app.use(express.static('client/build'));

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server started on port ${port}`));
