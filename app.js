var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function(req, res) {
    url = 'http://www.imdb.com/title/tt1229340/';

    request(url, function(error, response, html) {
        if(!error) {
            var $ = cheerio.load(html);
            var title, release, rating;
            var json = {title: "", release: "", rating: ""};

            $('h1').filter(function () {
                var data = $(this);
                title = data.clone() // clones the element
                    .children()      // selects the child
                    .remove()        // removes the child
                    .end()           // goes back to the element
                    .text();         // grabs the text
                json.title = title;
            });

            $('#titleYear').filter(function(){
                var data = $(this);
                release = data.children().first().text();
                json.release = release;
            })

            $('.ratingValue').filter(function(){
                var data = $(this);

                // rating = data.text();
                rating = data.children().text();
                json.rating = rating;
            })
        }

        fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
            console.log('File successfully written - check your project directory for the output.json file.');
        });
    })

    

    res.send('Check your console.');
});

app.listen(8081);

console.log('The magic happens on port 8081');

exports = module.exports = app;