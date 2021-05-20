const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

app.use(express.static(__dirname + "/public"));

routes(app);

const server = app.listen(port, (error) => {
    if (error) {
		return console.log(`Error: ${error}`);
	} else {
		var port = server.address().port;
		console.log('Server running at http://localhost' + ':' + port)
	}
});