require(`dotenv`).config(); // Utilizing Environment Variables
const config = require('./config/config');   
const app = config.app;

// setup routes
const routes = require(`./routes/routes`);
app.use(``, routes);

// -* Listener
const port = 3000; // Port number; Adjustable depending on eventual hosting config 
app.listen(port, function () {
    console.log(`Server started on ${port}`);
});