const express = require(`express`);
const authRoutes = require(`./routes/auth-routes`);
const passportSetup = require('./config/passport-setup');   

const app = express();

app.set('view engine', 'ejs');

// setup routes
app.use(`/auth`, authRoutes);

app.get("/", (req, res) => {
    res.render(`home`);
}) ; 


app.listen(3001, () => {
    console.log(`Server listening on port 3001`); 
});