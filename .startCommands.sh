DISCORD="Mzg2OTk3MzYzNjE4NzQyMjcy.DZdf9A.-qwiCaiUp-etNqHjgrP03BdTKfg"
RIOT="RGAPI-332390a6-bcf0-40d8-8830-4fc1aed5bcd9"
GOOGLE="AIzaSyCwys46oVhdwlhQ7iNgtT56TtMUG5Nn3Qs"
TWITCH="1pyk0xppawf9cy7gohkemfjcjq78aa"
CHAMPIONGG="245e4f76b33c6b217115e7d14e7f00f2"

if [[ $1 == "true" ]] || [[ $1 == "false" ]]; then
    discord=$DISCORD riot=$RIOT google=$GOOGLE twitchId=$TWITCH championGG=$CHAMPIONGG startBot=$1 node app.js
else
    echo "Unknown argument - failed to start"
fi