var page = require("webpage").create();
var homePage = "http://www.google.com/";
 
page.open(homePage);
page.onLoadFinished = function(status) {
  var url = page.url;
 
  console.log("Status:  " + status);
  console.log("Loaded:  " + url);
  page.render("google.png");
  phantom.exit();
};