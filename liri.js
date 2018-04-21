const dotenv = require("dotenv").config();
const Twitter = require("twitter");
const Spotify = require("node-spotify-api");
const request = require("request");
const inquirer = require("inquirer");
const keys = require("./keys.js");
const fs = require("file-system");

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
        }).catch(err => {
          spotifyThis("The Ace");
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
          if(!data.movieChoice) {
            movieThis("Mr Nobody");
          } else {
            movieThis(data.movieChoice);
          }
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
        console.log("DATE CREATED: " + tweet.created_at);
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
      let album = data.tracks.items[0].album.name;
      let preview = data.tracks.items[0].preview_url;
      console.log("SONG: " + song);
      console.log("ARTIST: " + artist);
      console.log("ALBUM: " + album);
      console.log("PREVIEW: " + preview);
    }
    startApp();
  });
}

function movieThis(movie) {
  let key = "&apikey=8fe5fd42";
  let query = "http://www.omdbapi.com/?t=" + movie + key;
  request(query, function(err, res, body) {
    if (!err && res.statusCode === 200) {
      let data = JSON.parse(body);
      console.log("TITLE: " + data.Title);
      console.log("YEAR: " + data.Year);
      console.log("IMDB RATING: " + data.Ratings[0].Value);
      console.log("ROTTEN TOMATOES RATING: " + data.Ratings[1].Value);
      console.log("COUNTRY: " + data.Country);
      console.log("LANGUAGE: " + data.Language);
      console.log("PLOT: " + data.Plot);
      console.log("ACTORS: " + data.Actors);
    }
    startApp();
  });
}

function doThis() {
  fs.readFile("random.txt", "UTF-8", function(err, data) {
    if(err) {
      console.log(err);
    } else {
      spotifyThis(data);
    }
  });
}