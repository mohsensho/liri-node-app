require('dotenv').config();
let fs = require('fs');
const axios = require("axios");
const moment = require('moment');
const Spotify = require('node-spotify-api');
//API Keys
const keys = require('./keys.js');
const spotify = new Spotify(keys.spotify);

console.log('________________________________________________');
let searchKeyWord;
if (process.argv[3] != undefined) {
    searchKeyWord = process.argv.splice(3, process.argv.length - 1).join();
    console.log("search result for: "+searchKeyWord); 
}else{
    searchKeyWord = undefined;
}

function showConcert()  {
    console.log('Concert info:');
    axios.get("https://rest.bandsintown.com/artists/" + searchKeyWord + "/events?app_id="  + keys.bandsInTown.app_id).then(function  (data) {
        const concertResult = data.data;
        for (var i = 0; i < concertResult.length; i++) {
            const venue = concertResult[i].venue.name;
            const location = concertResult[i].venue.city;
            const date = concertResult[i].datetime;
            const country = concertResult[i].venue.country;
            console.log(`Date: ${moment(date).format('dddd, ll')}`);
            console.log(`Venue: ${venue}`);
            console.log(`City: ${location}`);
            console.log(`Country: ${country}`);
            console.log('________________________________________________');
        }
    }).catch(err=>console.log(err));
}
function showSong() {
    if (searchKeyWord === undefined) {
        // if no song is provided it will default to 'the sign'  by ace  of base
        searchKeyWord = 'hello';
    }
    spotify.search({ type: 'track', query: searchKeyWord, limit: '1' }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        // showing information
        let song = data.tracks.items[0].name;
        let artist = data.tracks.items[0].artists[0].name;
        let preview = data.tracks.items[0].external_urls.spotify;
        let album = data.tracks.items[0].album.name;
        console.log('Song info:');
        console.log(`Name of Song: ${song}`);
        console.log(`Artist Name: ${artist}`);
        console.log(`Name of Album: ${album}`);
        console.log(`Link to Song: ${preview}`);
        console.log('________________________________________________');
    }); 
}
function showMovie() {
    if (searchKeyWord === undefined) {
        searchKeyWord = 'mr nobody';
    }
    let queryUrl = "http://www.omdbapi.com/?t=" + searchKeyWord + "&y=&plot=short&apikey=" + keys.OMDB.API_KEY;
    console.log('Movie info:');
    
    if (searchKeyWord != undefined) {
        axios.get(queryUrl).then(
            // showing information:
            function(response) {
                const title = response.data.Title;
                const year = response.data.Released;
                const IMDBRating = response.data.imdbRating;
                const RTRating = response.data.Ratings[0].Value;
                const country = response.data.Country;
                const language = response.data.Language;
                const plot = response.data.Plot;
                const actors = response.data.Actors;
                console.log('');
                console.log(`Title: ${title}`);
                console.log(`Year Released: ${year}`);
                console.log(`Plot: ${plot}`);
                console.log(`Actors: ${actors}`);
                console.log(`IMDB Rating: ${IMDBRating}`);
                console.log(`Rotten Tomatoes Rating: ${RTRating}`);
                console.log(`Language: ${language}`);
                console.log(`Country: ${country}`);
                console.log('________________________________________________');
            }
        ).catch(function (error) {
            console.log(error);
          });;
    }
}
// LIRI will take following commands:
// node liri.js concert-this <artist/band name here>
if (process.argv[2] === 'concert') {
    showConcert();
}else if (process.argv[2] === 'spotify') {
    showSong();
}else if (process.argv[2] === 'movie') {
    showMovie();
}else if (process.argv[2] === 'do') {
    fs.readFile('random.txt', "utf8", function(error, data){ 
        if (error) {
            return console.log(error);
        }
        let dataArr = data.split(',');
        let searchType = dataArr[0].split('-');
        searchType = searchType[0];
        searchKeyWord = dataArr[1];
        if (searchType === 'spotify') {
            showSong();
        } else if (searchType === 'concert') {
            showConcert();
        } else if (searchType === 'movie') {
            showMovie();
        }
    })
};