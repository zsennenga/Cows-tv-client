var widgetAPI = new Common.API.Widget();

var feedData;
var bgData;
var updateInterval;
var burnInterval;
var burnIndex = 0;
var updateTimeInterval;
var tempHtml;
var eventIndex = new Array();

/**
 * Executes all necessary ajax to update the data arrays for events and background images
 */
function doAjax() {
	$.ajaxSetup({
		async: false
		});
	$.getJSON('http://169.237.123.4/cows/includes/ajaxEvents.php?callback=?', function(data) {
			feedData = data;
			eventUpdate();
		});
	$.getJSON('http://169.237.123.4/cows/includes/ajaxImages.php?callback=?', function(data) {
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
 * Function to handle regular screen clearing to avoid any possible burn-in on the screen. Every 30 minutes, displays 12 images for 15 seconds each
 */
function burnProtect()	{
	clearInterval(updateInterval);
	clearInterval(updateTimeInterval);
	tempHtml = $('body').html();
	$('body').html('');
	$('body').css('background-color','black');
	burnInterval = setInterval(doBurn,1000*15);
	doBurn();
	setTimeout(clearBurn,1000*3*60);
}
/**
 * Function to actually change the background image.
 */
function doBurn()	{
	$('body').html("");
	$('body').css("background-color","black");
	$('body').css("background-image","url(http://169.237.123.4/cows/images/"+bgData[burnIndex] + ")");
	burnIndex = (burnIndex + 1) % bgData.length;
}
/**
 * Returns the program to the normal event-displaying state
 */
function clearBurn()	{
	clearInterval(burnInterval);
	$('body').css('background-color','white');
	$('body').css("background-image","");
	$('body').html(tempHtml);
	eventUpdate();
	updateTime();
	updateInterval = setInterval(eventUpdate,1000*20);
	updateTimeInterval = setInterval(updateTime,500);
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
	var seconds = date.getSeconds();
	$('#footer').html("<div id='time'><h2>" + pad(hours) + ":" + pad(minutes) + " " + half +"</h2></div>");
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
	updateTimeInterval = setInterval(updateTime,500);
	setInterval(burnProtect, 1000*30*60);
	setInterval(doAjax, 1000*60*60);
};