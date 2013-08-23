var widgetAPI = new Common.API.Widget();

var feedData;
var bgData;
var updateInterval;
var burnInterval;
var burnIndex = 0;
var updateTimeInterval;
var tempHtml;
var eventIndex = new Array();
var slideshow;

var weekday=new Array(7);
weekday[0]="Sunday";
weekday[1]="Monday";
weekday[2]="Tuesday";
weekday[3]="Wednesday";
weekday[4]="Thursday";
weekday[5]="Friday";
weekday[6]="Saturday";
var month=new Array();
month[0]="January";
month[1]="February";
month[2]="March";
month[3]="April";
month[4]="May";
month[5]="June";
month[6]="July";
month[7]="August";
month[8]="September";
month[9]="October";
month[10]="November";
month[11]="December";
baseURL= "http://dev.its.ucdavis.edu/v1/TVDisplay/";
apiURL = "http://dev.its.ucdavis.edu/scripts/CowsTvServer.php?siteId=its&callback=?";

/**
 * Executes all necessary ajax to update the data arrays for events and background images
 */
function doAjax() {
	$.ajaxSetup({
		async: false
		});
	$.getJSON(apiURL, function(data) {
			feedData = data;
			eventUpdate();
		});
	$.getJSON(baseURL + 'ajaxImages.php?callback=?', function(data) {
		bgData = data;
	});
}
/**
 * Updates the content html object with 3 events. Cycles through all available events in groups of 3
 */
function eventUpdate() {
		if (feedData != null)	{
		  if (feedData[0] == "noEvent")	{
			 $('#content').html(feedData[1]); 
		  }
		  else if (feedData.length >= 1 && feedData.length < 3)	{
			 
			  $('#content').html(feedData[0]);
			  for (var i = 1; i <feedData.length;i++){
				  $('#content').append(feedData[i]);
			  }
			  $('.title').css("font-size",850/feedData.length + "%");
			  $('.other').css("font-size",700/feedData.length + "%");
			  $('.event').css("height",100/feedData.length + "%");
		  }
		  else if (feedData.length >= 3)	{
			  $('#content').html('');
			  for (var i = 1; i < 4; i++)	{
			  	if (eventIndex[i] != -1)	{
					  $('#content').append(feedData[eventIndex[i]]);
					  eventIndex[i] = eventIndex[i] + 3;
					  if (eventIndex[i] >= feedData.length) eventIndex[i] = -1;
				  }
			  }
			  if (eventIndex[1] == -1 && eventIndex[2] == -1 && eventIndex[3] == -1) {
				  eventIndex[1] = 0;
				  eventIndex[2] = 1;
				  eventIndex[3] = 2;
			  }
			  $('.title').css("font-size",850/3 + "%");
			  $('.other').css("font-size",700/3 + "%");
			  $('.event').css("height",100/3 + "%");
		  }
		}
}
/**
 * Function to handle regular screen clear	ing to avoid any possible burn-in on the screen. Every 30 minutes, displays 12 images for 15 seconds each
 */
function burnProtect()	{
	clearInterval(updateInterval);
	clearInterval(updateTimeInterval);
	tempHtml = $('body').html();
	newHtml = "<div class=\"pics\">"; 
    for (var x = 0; x < bgData.length; x++)	{
    	newHtml = newHtml.concat("<img src=\"http://dev.its.ucdavis.edu/images/" + encodeURIComponent(bgData[x]) + "\" width=\"100%\" height=\"100%\" /> ");
    }
    newHtml = newHtml.concat("</div>");
    $('body').html(newHtml);
    $('body').css("background-color", "black");
    $(document).ready(function() { 
    	$('.pics').cycle({
    	aspect: 1,
    	fx: 'fade',
        fit: 1,
        random:  1
    	});
    });
	//setTimeout(clearBurn,1000*20);
	setTimeout(clearBurn,1000*3*60);
}
/**
 * Returns the program to the normal event-displaying state
 */
function clearBurn()	{
	$('.pics').cycle('destroy');
	$('body').html(tempHtml);
	$('body').css("background-color", "white");
	eventUpdate();
	updateTime();
	updateInterval = setInterval(eventUpdate,1000*20);
	updateTimeInterval = setInterval(updateTime,1000);
}
/**
 * Helper function for the time display. Forces HH:MM with 0 padding if necessary
 * @param n int
 * @returns padded string
 */
function pad(n) { 
	return ("0" + n).slice(-2); 
}
/**
 * Updates the time display in the footer
 */
function updateTime()	{
	var date = new Date();
	var half = "AM";
	var hours = date.getHours();
	if (hours >= 12) {
		hours = hours % 12;
		if (hours == 0) hours = 12;
		half = "PM";
	}
	var minutes = date.getMinutes();
	var dayNum = pad(date.getDate());
	var monthText = month[date.getMonth()];
	var day = weekday[date.getDay()];
	$('#footer').html("<div id='time'><h2>" + pad(hours) + ":" + pad(minutes) + " " + half +"</h2></div>");
	$('#eventHeaderText').html("<h1>" + day + " " + monthText + " " + dayNum + " at UC Davis West Village</h1>");
}

var Main = function()
{
		
};
/**
 * Handles variable initialization, first runs of doAjax() and updateTime, and sets all initial intervals
 */
Main.onLoad = function()
{
	widgetAPI.sendReadyEvent();
	
	eventIndex[1] = 0;
	eventIndex[2] = 1;
	eventIndex[3] = 2;
	
	doAjax();
	updateTime();
	
	updateInterval = setInterval(eventUpdate, 1000*20);
	updateTimeInterval = setInterval(updateTime,1000);
	//setInterval(burnProtect, 1000*10);
	setInterval(burnProtect,1000*60*30);
	setInterval(doAjax, 1000*60*5);
};