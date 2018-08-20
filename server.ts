import app from "./app";
import DiscordBot from './discordbot';
import { request } from "http";

const port = (process.env.PORT || 5000);
app.listen(port, function () {
    console.log('Express server listening on port ' + port);
    ping();
    setInterval(() => {
        ping();
    }, 1500000);

    let discordBot = new DiscordBot();
});

function ping(): void {
    console.log("Pinging...");
    request('http://localhost:5000/ping', function (error) {
    // request('http://avery-vine-server.herokuapp.com/ping', function (error) {
        if (error) {
			console.log('Failed to ping hosting service!');
		}
		else {
			console.log('Pinged hosting service to keep dyno awake.');
		}
    });
}
