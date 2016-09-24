'use strict';
var router = require('express').Router();
var googleTrends = require('google-trends-api');
var request = require('request');
var cheerio = require('cheerio');
var fetchUrl = require('fetch').fetchUrl;

// var striptags = require('striptags');

//summary tools!
var SummaryTool = require('node-summary');
var sum = require('sum');
var pullquoter = require('pullquoter');

module.exports = router;

//path: api/search

router.get('/hotTrendsDetail/test', function(req, res, next) {
    res.send("hello");
})

router.post('/hotTrendsDetail/test', function(req, res, next) {
    res.send("Post request info");
})

router.post('/hotTrendsDetail/random', function(req, res, next) {

    googleTrends.hotTrendsDetail(req.params.countryCode)
        .then(function(results) {

            //randomizer 0-19
            var randomizer = function() {
                var num = Math.floor(Math.random() * 20);
                return num
            }

            var options = {
                disableRedirects: true
            }

            var random = randomizer();

            fetchUrl(results.rss.channel[0].item[random]['ht:news_item'][0]['ht:news_item_url'][0], options, function(error, response, body) {

                if (error) {
                    throw error
                }

                var $ = cheerio.load(body, {
                    normalizeWhitespace: true,
                    withDomLvl1: true
                });

                var content = '';
                var dupCheckerArr = [];

                function dupChecker(sentence) {
                    var dup = false;

                    dupCheckerArr.forEach(function(ele) {
                        if (ele === sentence) {
                            dup = true;
                        }
                    })

                    if (dup) {
                        return true;
                    } else {
                        dupCheckerArr.push(sentence);
                        return false;
                    }
                }

                $('p').each(function() {
                    var link = $(this);
                    var text = link.text();

                    if (!dupChecker(text)) {
                        if (text.length > 50) {
                            content += ' ';
                            content += text;
                        }
                    }

                })

                //TESTING USING SUMMARY-TOOL
                SummaryTool.getSortedSentences(content, 5, function(err, sorted_sentences) {

                    if (err) {
                        res.send(results.rss.channel[0].item[random]['ht:news_item'][0]['ht:news_item_url'][0])
                    }
                    // console.log(sorted_sentences)
                    if (Array.isArray(sorted_sentences)) {
                        res.send(sorted_sentences.join(' '))
                    } else {
                        res.send(sorted_sentences)
                    }
                })

            })


        })
        .catch(next);

})

router.get('/topRelated/:criteria', function(req, res, next) {

    googleTrends.topRelated(req.params.criteria, 'US')
        .then((result) => res.send(result))
        .catch(next);

    //http://www.google.com/search?q=pew&btnI
})

router.get('/hotTrendsDetail/:countryCode', function(req, res, next) {

    googleTrends.hotTrendsDetail(req.params.countryCode)
        .then(function(results) {
            console.log(results)
            res.send(results)
        })
        .catch(next);

})

router.post('/getSummary', function(req, res, next) {
    var options = {
        disableRedirects: true
    }

    fetchUrl(req.body['ht:news_item'][0]['ht:news_item_url'][0], options, function(error, response, body) {

        if (error) {
            throw error
        }

        var $ = cheerio.load(body, {
            normalizeWhitespace: true,
            withDomLvl1: true
        });

        var content = '';
        var dupCheckerArr = [];

        function dupChecker(sentence) {
            var dup = false;

            dupCheckerArr.forEach(function(ele) {
                if (ele === sentence) {
                    dup = true;
                }
            })

            if (dup) {
                return true;
            } else {
                dupCheckerArr.push(sentence);
                return false;
            }
        }

        $('p').each(function() {
            var link = $(this);
            var text = link.text();

            if (!dupChecker(text)) {
                if (text.length > 50) {
                    content += ' ';
                    content += text;
                }
            }

        })

        //TESTING USING SUMMARY-TOOL
        SummaryTool.getSortedSentences(content, 5, function(err, sorted_sentences) {

            if (err) {
                res.send(req.body['ht:news_item'][0]["ht:news_item_snippet"][0])
            }
            // console.log(sorted_sentences)
            if (Array.isArray(sorted_sentences)) {
                res.send(sorted_sentences.join(' '))
            } else {
                res.send(sorted_sentences)
            }
        })

    })

    // request(req.body['ht:news_item'][0]['ht:news_item_url'][0], function(error, response, body) {

    //     if (error) {
    //         throw error
    //     }

    //     var $ = cheerio.load(body, {
    //         normalizeWhitespace: true,
    //         withDomLvl1: true
    //     });

    //     var content = '';
    //     var title = $('h1').text();
    //     var dupCheckerArr = [];

    //     function dupChecker(sentence) {
    //         var dup = false;

    //         dupCheckerArr.forEach(function(ele) {
    //             if (ele === sentence) {
    //                 dup = true;
    //             }
    //         })

    //         if (dup) {
    //             return true;
    //         } else {
    //             dupCheckerArr.push(sentence);
    //             return false;
    //         }
    //     }

    //     $('p').each(function() {
    //         var link = $(this);
    //         var text = link.text();

    //         if (!dupChecker(text)) {
    //             if (text.length > 100) {
    //                 content += ' ';
    //                 content += text;
    //             }
    //         }

    //     })

    //     //TESTING USING SUMMARY-TOOL
    //     SummaryTool.getSortedSentences(content, 5, function(err, sorted_sentences) {

    //         if (err) {
    //             res.send(req.body['ht:news_item'][0]["ht:news_item_snippet"][0])
    //         }

    //         res.send(sorted_sentences.join(' '))
    //     })

    // })

})


router.get('/test', function(req, res, next) {
    //TESTING GOOGLE HOT TRENDS !
    // googleTrends.hotTrendsDetail('US')
    //     .then(function(results) {
    //         res.send(results)
    //     })
    //     .catch(function(err) {
    //         console.error(err);
    //     });


    //TESTING HOW TO MAKE HTML REQUEST to get DOM

    // request('http://www.ew.com/article/2016/09/22/pottermore-patronus', function(error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         res.send(body)
    //     }
    // })

    request("http://gizmodo.com/the-recent-string-of-listeria-contaminations-is-unnervi-1786943589", function(error, response, body) {

        if (error) {
            throw error
        }

        var $ = cheerio.load(body, {
            normalizeWhitespace: true,
            withDomLvl1: true
        });

        var content = '';
        var title = $('h1').text();
        var dupCheckerArr = [];

        function dupChecker(sentence) {
            var dup = false;

            dupCheckerArr.forEach(function(ele) {
                if (ele === sentence) {
                    dup = true;
                }
            })

            if (dup) {
                return true;
            } else {
                dupCheckerArr.push(sentence);
                return false;
            }
        }

        $('p').each(function() {
                var link = $(this);
                var text = link.text();

                if (!dupChecker(text)) {
                    if (text.length > 100) {
                        content += ' ';
                        content += text;
                    }
                }

            })
            // console.log(allP)

        //TESTING USING SUMMARY-TOOL
        SummaryTool.getSortedSentences(content, 5, function(err, sorted_sentences) {

            if (err) {
                throw err
            }

            res.send(sorted_sentences)
        })

        // SummaryTool.summarize(title, content, function(err, summary) {
        //     res.send([title, summary]);
        // })

        // TESTING SUM!!!!!
        // var abstract = sum({
        //   'corpus': content,
        //   'nWords': content.length,
        // })

        // res.send(abstract.summary)

        //TESTING PULLQUOTER
        // var quotes = pullquoter(content);
        // res.send(quotes)


        // res.send(content)

    })

    // request({
    //     uri: "http://www.sitepoint.com",
    // }, function(error, response, body) {
    //     var $ = cheerio.load(body);

    //     $(".entry-title > a").each(function() {
    //         var link = $(this);
    //         var text = link.text();
    //         var href = link.attr("href");

    //         console.log(text + " -> " + href);
    //         res.send(text)
    //     });
    // });

})
