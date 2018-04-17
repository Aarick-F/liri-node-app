const dotenv = require("dotenv").config();
const Twitter = require("twitter");
const Spotify = require("node-spotify-api");
const request = require("request");
const inquirer = require("inquirer");
const keys = require("./keys.js");

const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

startApp();

function startApp() {
  inquirer
  .prompt([
    {
      type: "list",
      message: "Welcome to Liri! Please select an option:",
      choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says", "quit"],
      name: "userSelection"
    }
  ])
  .then(data => {
    let app = data.userSelection;
    switch(app) {
      case "my-tweets":
        myTweets();
        break;
      case "spotify-this-song":
        inquirer.prompt([
          {
            type: "input",
            message: "Enter the name of a song:",
            name: "songChoice"
          }
        ]).then(data => {
          spotifyThis(data.songChoice);
        });
        break;
      case "movie-this":
        inquirer.prompt([
          {
            type: "input",
            message: "Enter the name of a movie:",
            name: "movieChoice"
          }
        ]).then(data => {
          movieThis(data.movieChoice);
        });
        break;
      case "do-what-it-says":
        doThis();
        break;
      case "quit":
        console.log("Thank you for using Liri!");
        break;
    }
  });
}

function myTweets() {
  console.log("INCOMMING TWEETS!");
  console.log("======================");
  const params = {
    screen_name: "dummy4skool",
    count: 20
  };
  client.get("statuses/user_timeline", params, function(err, tweets, response) {
    if(err) {
      console.log(err);
    } else {
      tweets.forEach(tweet => {
        console.log(tweet.text);
        console.log("====================================");
      });
    }
    startApp();
  });
}

function spotifyThis(song) {
  const params = {
    type: "track",
    query: song
  };
  spotify.search(params, function(err, data) {
    if(err) {
      console.log(err);
    } else {
      let artist = data.tracks.items[0].artists[0].name;
      console.log("ARTIST: " + artist);
    }
  });
}

function movieThis(movie) {
  console.log("YOU'VE MADE IT TO THE MOVIE FUNCTION, YOU'RE SONG CHOICE WAS: " + movie);
}

function doThis() {

}