/* global ga:false */

(function () {

    'use strict';

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // | Google Universal Analytics                                            |
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // More information about the Google Universal Analytics:
    // https://developers.google.com/analytics/devguides/collection/analyticsjs/
    // https://mathiasbynens.be/notes/async-analytics-snippet#universal-analytics

    function loadGoogleAnalytics(){

        /* jshint ignore:start */
        (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;e=o.createElement(i);r=o.getElementsByTagName(i)[0];e.src='//www.google-analytics.com/analytics.js';r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
        /* jshint ignore:end */

        // Create tracker object
        ga('create', 'UA-17904194-4');

        // Send a page view
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
        ga('send', 'pageview');

        // Track events
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
        $('body').on('click', '[data-ga-category]', function (e) {

            var $target = $(e.currentTarget);
            var action = $target.attr('data-ga-action') || undefined; // required
            var category = $target.attr('data-ga-category') || undefined; // required
            var label = $target.attr('data-ga-label') || undefined;
            var url = $target.attr('href');
            var value = parseInt($target.attr('data-ga-value'), 10) || undefined;

            if ( ga && category && action ) {

                // Handle outbound links manually to ensure that
                // they are registered with Google Analytics
                e.preventDefault();

                // 1. Ensure that `Download` links work as intended

                // The `Download` links aren't directing the user away
                // from the page. So, using `window.location.href` in this
                // case may cause unwanted problems. E.g: If the user clicks
                // on a `Download` link before all the page's content is
                // downloaded, the browser will abort any remaining downloads.
                // This happens because the browser considers that it no
                // longer needs to download anything from this page, and
                // should start downloading the next page and its content.

                // Also, the following is done here, and not in `hitCallback`,
                // so that it prevents the browser popup blocking behavior

                if ( category === 'Download' ) {
                    window.open(url);
                }

                (function (url) {

                    var timeout;

                    // Registerd the event
                    ga('send', 'event', category, action, label, value, {
                        // 2. Ensure that `Outbound links` are registerd before
                        // navigating away from the current page
                        // https://developers.google.com/analytics/devguides/collection/analyticsjs/advanced#hitCallback
                        'hitCallback': function () {
                            if ( category === 'Outbound links' ) {
                                if ( timeout ) {
                                    clearTimeout(timeout);
                                }
                                window.location.href = url;
                            }
                        }
                    });

                    // In case `hitCallback` takes to long
                    timeout = setTimeout(function () {
                        if ( category === 'Outbound links' ) {
                            window.location.href = url;
                        }
                    }, 1000);
                }(url));
            }

        });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // | Twitter                                                               |
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Tweet Buttons
    // https://dev.twitter.com/docs/tweet-button

    function loadTweetButtons() {
        /* jshint ignore:start */
        !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src='//platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document,'script','twitter-wjs');
        /* jshint ignore:end */
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Load widgets asynchronously
    loadGoogleAnalytics();
    window.onload = loadTweetButtons; // low priority content

}());