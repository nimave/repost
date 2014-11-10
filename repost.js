//Repost.js
//Helper worker that refreshes (reposts) car ads that are have been posted for more than 2 days
//By Nima Veiseh
//nima@carlypso.com
//We want to run the script every hour, to check for posts more than 2 days old and click repost
//file must be run by command prompt: "casperjs repost.js", not "node repost.js"

//Require necessary libraries
//Casper, request, etc

//config will have the craigslist login information
var fs = require('fs'); //standard Node.Js library
var config = require('./config'); //for importing external project, login settings
var utils = require('utils'); //casperjs library, not Node library

//initalize caspser
//npm install casper, if needed
//Check 'npm list', for casper installation, then add it to package.json with version
//phantom may also need to be locally installed
//http://casperjs.readthedocs.org/en/latest/faq.html#can-i-use-jquery-with-casperjs
var casper = require('casper').create({
    verbose:true,
    logLevel:'debug',
    clientScripts: ["jquery.min.js"]
});
var x = require('casper').selectXPath;

// Set user agent. Websites often behave differently based off of this.
//casper.userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X)');
// I set the user agent to what the iPhone uses. There were some issues with
// redirects to non-mobile pages. This may or may not prevent that.
casper.userAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_4 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B350 Safari/8536.25');

//confirm we have received the login information
var clUsername = config.account.email;
var clPass = config.account.pass;
var purchaseOrderNumber = "34849933"; //abstract this into the config file, eventually

//Depending on how we would like to automate this, we can either repost every 2 days, or at certain peak times
var cLPeakTimes = ""; //= config.account.repost;
var clRepostFreq = 24*2*3600*1000; //172800 seconds, 2 days

console.log('Craigslist Login Information is: ');
console.log('Username: ' + clUsername);
console.log('Password: ' + clPass);
console.log('Reposting will happen every (milli-seconds): ' + clRepostFreq);
console.log('Repost Automatically at these times: ' + cLPeakTimes);


//Command line format for script: casperjs repost.js username password
//First version will take list of Craigslist Post IDs from the command line
//casper.echo == console.log
casper.echo("Casper CLI passed args:");
utils.dump(casper.cli.args);

casper.echo("Casper CLI passed options:");
utils.dump(casper.cli.options);

//LAUNCH OVERVIEW
//Test URL: https://post.craigslist.org/manage/4749888185?action=repost&go=repost
//First design of this problem is perform one repost per launch,
repostId = casper.cli.args[0];
console.log("Repost ID: " + repostId);




//Login website for Craigslist account
casper.start('https://accounts.craigslist.org/login');

casper.on("page.error", function(msg, trace) {
    this.log("Error: " + msg, "ERROR");
});

casper.on("mouse.click", function(msg, trace) {
    this.log("Click: " + msg, "CLICK");
});

//After starting, initiate casper function, from login to specific car page,
//to clicking repost
casper.then(function() {
    //"this" represents actually page we are on
    this.capture('statusImage0.png');
    console.log("Login Screen Entered. Screenshot 0 taken.");

    this.sendKeys('#inputEmailHandle', clUsername);
    this.capture('statusImage1.png');
    console.log("Login Data Entered. Screenshot 1 taken.");
    this.sendKeys('#inputPassword', clPass);
    this.capture('statusImage2.png');
    console.log("Pass Data Entered. Screenshot 2 taken.");

    //Press Enter to login
    this.sendKeys('#inputPassword', casper.page.event.key.Enter, {keepFocus: true});
    this.wait(2000, function () {
        this.capture('statusImage3.png');
        console.log("Press Enter to Login. Screenshot 3 taken.");
        console.log(this.getCurrentUrl());
    });

    //Now, we have logged into our CL Account, and can see the cars that may need reposting
    //Construct URL for car that needs to be reposted
    //Test URL: https://post.craigslist.org/manage/4749888185?action=repost&go=repost
    this.wait(2000, function() {
        var repostURL = "https://post.craigslist.org/manage/" + repostId + "?action=repost&go=repost";
        console.log("URL Corresponding to Repost: " + repostURL);
        this.thenOpen(repostURL);
    });

    this.wait(2000,function(){
        casper.capture('statusImage4.png');
        console.log("respost button");
//        this.evaluate(function () {
//            console.log('do we even get inside this block? usually not');
//            return $($('input[type=submit]')[1]).trigger('click');
//        });
        //Press the "Repost" button for that car posting and wait
        this.click('input.managebtn:nth-of-type(3)'); //WOOOHOOO!!!

        this.wait(2000,function(){
            casper.capture('statusImage5.png');
        });
    });

    this.wait(2000,function(){
        console.log("need to fill in Purchase Order number before submitting ");
        this.sendKeys('#PONumber', purchaseOrderNumber);
        this.capture('statusImage6.png');
        console.log('StatusImage6 Taken, of purchase order entered.');

        this.click('#postingForm > button');
        this.wait(2000, function () {
            this.capture('statusImage7.png');
            console.log('StatusImage7 Taken, after continue button pressed.');

            console.log("Now that the confirmation-before-publication page has loaded, click the confirmation button");
            console.log(this.exists('button.bigbutton'));
            //this.clickLabel('publish', 'button');

            var formAction = this.getElementAttribute('.draft_warning form', 'action');
            var formMethod = this.getElementAttribute('.draft_warning form', 'method');

            this.log(formMethod, 'info');
            this.log(formAction, 'info');
            this.click('.draft_warning form button');


            //button.bigbutton

            this.evaluate(function () {
                // elem contains the <select>
//                var event = new MouseEvent('click', {
//                    'view': window,
//                    'bubbles': true,
//                    'cancelable': true
//                });
//                var domNode = document.querySelectorAll('button.bigbutton')[0];
//                domNode.dispatchEvent(event);
//
                //$('button.bigbutton').click();
            });

                this.wait(10000, function () {
                this.capture('statusImage8.png');
                console.log('StatusImage8 Taken, after final confirmation button pressed.');
            });
        });

    });
});



//END: Must run Casper.run() at end of file
casper.run();
