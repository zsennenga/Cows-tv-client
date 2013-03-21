var widgetAPI = new Common.API.Widget();

var feedData;
var bgData;
var updateInterval;
var burnInterval;
var burnIndex = 0;
var tempHtml;
var eventIndex = new Array();

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

function burnProtect()	{
	clearInterval(updateInterval);
	tempHtml = $('body').html();
	$('body').html('');
	$('body').css('background-color','black');
	burnInterval = setInterval(doBurn,1000*60);
	doBurn();
	setTimeout(clearBurn,1000*3*60);
}

function doBurn()	{
	$('body').html("");
	$('body').css("background-color","black");
	$('body').css("background-image","url(http://169.237.123.4/cows/images/"+bgData[burnIndex] + ")");
	burnIndex = (burnIndex + 1) % bgData.length;
}

function clearBurn()	{
	clearInterval(burnInterval);
	$('body').css('background-color','white');
	$('body').css("background-image","");
	$('body').html(tempHtml);
	eventUpdate();
	updateInterval = setInterval(eventUpdate,1000*20);
}
function pad(n) { return ("0" + n).slice(-2); }
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

Main.onLoad = function()
{
	widgetAPI.sendReadyEvent();
	
	eventIndex[1] = 0;
	eventIndex[2] = 1;
	eventIndex[3] = 2;
	
	doAjax();
	updateTime();
	
	updateInterval = setInterval(eventUpdate, 1000*20);
	setInterval(burnProtect, 1000*30*60);
	setInterval(doAjax, 1000*60*60);
	setInterval(updateTime,500);
};