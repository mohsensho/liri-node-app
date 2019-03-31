// DotEnv
require('dotenv').config();
// File System
let fs = require('fs');
// Axios Package from NPM
const axios = require("axios");
// Moment.JS
const moment = require('moment');
// Spotify
const Spotify = require('node-spotify-api');
//API Keys
const keys = require('./keys.js');
const spotify = new Spotify(keys.spotify);

// concatenate all search words together to form one variable
let searchTerm;



if (process.argv[3] != undefined) {
    searchTerm = process.argv.splice(3, process.argv.length - 1).join();
    console.log("searchTerm: "+searchTerm);
    searchTerm = searchTerm.replace(/,/g, ' '); 
}
console.log(`search:${searchTerm}`);

function callConcert()  {
    let queryURL = "https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id="  + keys.bandsInTown.app_id;
    console.log('~~~~~~~~~~~~~~~~~~~~');
    console.log('Searching For Events...');
    // search bandsintown api for artist events api
    axios.get(queryURL).then(function  (data) {
        const returned = data.data;
        for (var i = 0; i < returned.length; i++) {
            const venue = returned[i].venue.name;
            const location = returned[i].venue.city;
            const date = returned[i].datetime;
            console.log('~~~~~~~~~~~~~~~~~~~~');
            console.log(`Venue: ${venue}`);
            console.log(`City of Event: ${location}`);
            console.log(`Date of Event: ${moment(date).format('dddd, MMMM Do YYYY')}`);
            console.log('~~~~~~~~~~~~~~~~~~~~');
        }
    }).catch(err=>console.log(err));
}
function callSpotify() {
    if (searchTerm === undefined) {
        // if no song is provided it will default to 'the sign'  by ace  of base
        searchTerm = 'the Sign';
    }
    spotify.search({ type: 'track', query: searchTerm, limit: '1' }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        // shows following information about the song
        // artists, the songname, a preview of the song in spotify,  the album the song is from
        let artists = data.tracks.items[0].artists[0].name;
        let songName = data.tracks.items[0].name;
        let preview = data.tracks.items[0].external_urls.spotify;
        let album = data.tracks.items[0].album.name;
        console.log('~~~~~~~~~~~~~~~~~~~~');
        console.log('Searching For Song...');
        console.log('~~~~~~~~~~~~~~~~~~~~');
        console.log(`Name of Song: ${songName}`);
        console.log(`Name of Album: ${album}`);
        console.log(`Artist Name: ${artists}`);
        console.log(`Link to Song: ${preview}`);
        console.log('~~~~~~~~~~~~~~~~~~~~');
    }); 
}
function callMovie() {
    if (searchTerm === undefined) {
        searchTerm = 'mr nobody';
    }
    let queryUrl = "http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=" + keys.OMDB.API_KEY;
    console.log('~~~~~~~~~~~~~~~~~~~~');
    console.log('Searching For Movie...');
    
    if (searchTerm != undefined) {
        axios.get(queryUrl).then(
            // outputs  following info:
            // Title  of the movie,  year released, imdb rating, rotten tomatoes  rating, country produced
            // language of the movie, plot, actors in movie
            function(response) {
                // console.log(response.data);
                const title = response.data.Title;
                const year = response.data.Released;
                const IMDBRating = response.data.imdbRating;
                let RTRating = 'No Data Available';
                if (response.data.Ratings.length > 0)  {
                    RTRating = response.data.Ratings[0].Value;
                };
                const country = response.data.Country;
                const language = response.data.Language;
                const plot = response.data.Plot;
                const actors = response.data.Actors;
                console.log('~~~~~~~~~~~~~~~~~~~~');
                console.log(`Title: ${title}`);
                console.log(`Year Released: ${year}`);
                console.log(`Plot: ${plot}`);
                console.log(`Actors: ${actors}`);
                console.log(`IMDB Rating: ${IMDBRating}`);
                console.log(`Rotten Tomatoes Rating: ${RTRating}`);
                console.log(`Language: ${language}`);
                console.log(`Country: ${country}`);
                console.log('~~~~~~~~~~~~~~~~~~~~');
            }
        ).catch(function (error) {
            console.log(error);
          });;
    }
}
// LIRI will take following commands:
// node liri.js concert-this <artist/band name here>
if (process.argv[2] === 'concert') {
    callConcert();
}else if (process.argv[2] === 'spotify') {
    callSpotify();
}else if (process.argv[2] === 'movie') {
    callMovie();
}else if (process.argv[2] === 'do') {
    fs.readFile('random.txt', "utf8", function(error, data){ 
        if (error) {
            return console.log(error);
        }
        let dataArr = data.split(',');
        searchTerm = dataArr[1];
        if (dataArr[0] === 'spotify') {
            callSpotify();
        } else if (dataArr[0] === 'concert') {
            callConcert();
        } else if (dataArr[0] === 'movie') {
            callMovie();
        }
    })
};