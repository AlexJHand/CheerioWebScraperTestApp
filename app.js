// Requires
var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

// Get call
app.get('/scrape', function(req, res) {
    // url of page to get info from 
    url = 'http://www.imdb.com/title/tt1229340/';

    // request function
    request(url, function(error, response, html) {
        // checks to see if request returns an error
        if(!error) {
            // loads the Cheerio dependency and makes things
            // on the target website selectable
            var $ = cheerio.load(html);
            var title, release, rating;
            // create json object
            var json = {title: "", release: "", rating: ""};

            // grab the movie title info from the h1 
            $('h1').filter(function () {
                var data = $(this);
                title = data.clone() // clones the element
                    .children()      // selects the child
                    .remove()        // removes the child
                    .end()           // goes back to the element
                    .text();         // grabs the text
                json.title = title;
            });

            // grab the year from the text of the link element within the span with id=titleYear
            $('#titleYear').filter(function(){
                var data = $(this);
                release = data.children().first().text();
                json.release = release;
            })

            // grab the rating from the text of the span inside the strong element
            $('.ratingValue').filter(function(){
                var data = $(this);
                rating = data.children().text();
                json.rating = rating;
            })
        }
        // write the new json object to a json file, output.json
        fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
            console.log('File successfully written - check your project directory for the output.json file.');
        });
    })

    // send a message to the front end
    res.send('Check your console.');
});

// Listener
app.listen(8081);

console.log('The magic happens on port 8081');

// Exports
exports = module.exports = app;