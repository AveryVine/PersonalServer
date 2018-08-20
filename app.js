const express = require('express');
const request = require('request');
const discordBot = require('./discordBot.js');
const app = express();

//receive a port, or select default port
app.set('port', (process.env.PORT || 5000));

//log each server request
app.use(function (req, res, next) {
	console.log(req.method + " request for " + req.url);
	next();
});

app.get("/discordBot/:function", function (req, res) {
	switch (req.params.function) {
		case "keys":
			res.json({
				"riot": process.env.riot,
				"championGG": process.env.championGG
			});
			break;
		default:
			next();
	}
});

//start listening on the selected port
app.listen(app.get('port'), function () {
	console.log('Server listening on port', app.get('port'));
	ping();
	setInterval(() => {
		ping();
	}, 1500000);

	discordBot.startBot();
});

//gets around the Heroku (hosting service) limit of 30 minutes of inactivity
function ping() {
	request('http://avery-vine-server.herokuapp.com', function (error) {
		if (error) {
			console.log('Failed to ping hosting service!');
		}
		else {
			console.log('Pinged to keep dyno awake');
		}
	});
}
