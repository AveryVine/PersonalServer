import app from "./App";
import DiscordBot from './DiscordBot/DiscordBot';
import request from 'request';

const port = (process.env.PORT || 5000);
app.listen(port, function () {
    console.log('Express server listening on port ' + port);
    ping();
    setInterval(() => {
        ping();
    }, 1500000);

    if (process.env.ENABLE_DISCORD_BOT) {
        DiscordBot.getInstance().login();
    }
});

function ping(): void {
    console.log("Pinging...");
    request('http://avery-vine-server.herokuapp.com/ping', function (error) {
        if (error) {
			console.log('Failed to ping hosting service!');
		}
		else {
			console.log('Pinged hosting service to keep dyno awake.');
		}
    });
}
