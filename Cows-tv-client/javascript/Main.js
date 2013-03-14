var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();
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
				  if (eventIndex[i] > feedData.length) eventIndex[i] = -1;
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
	$('body').html(tempHtml);
	eventUpdate();
	updateInterval = setInterval(eventUpdate,1000*5*60);
}
var Main = function()
{
		
};

Main.onLoad = function()
{
	this.enableKeys();
	widgetAPI.sendReadyEvent();
	eventIndex[1] = 0;
	eventIndex[2] = 1;
	eventIndex[3] = 2;
	doAjax();
	updateInterval = setInterval(eventUpdate, 1000*5*60);
	setInterval(burnProtect, 1000*30*60);
	setInterval(doAjax, 1000*60*60);
};

Main.onUnload = function()
{

};

Main.enableKeys = function()
{
};

Main.keyDown = function()
{
	var keyCode = event.keyCode;
	alert("Key pressed: " + keyCode);

	switch(keyCode)
	{
		case tvKey.KEY_RETURN:
		case tvKey.KEY_PANEL_RETURN:
			alert("RETURN");
			widgetAPI.sendReturnEvent();
			break;
		case tvKey.KEY_LEFT:
			alert("LEFT");
			break;
		case tvKey.KEY_RIGHT:
			alert("RIGHT");
			break;
		case tvKey.KEY_UP:
			alert("UP");
			break;
		case tvKey.KEY_DOWN:
			alert("DOWN");
			break;
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			alert("ENTER");
			break;
		default:
			alert("Unhandled key");
			break;
	}
};
