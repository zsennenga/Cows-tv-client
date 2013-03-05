var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();
var feedData;
var index1 = 0;
var index2 = 1;
function doAjax() {
	$.ajaxSetup({
		async: false
		});
	$.getJSON('http://169.237.123.4/cows/includes/ajax.php?callback=?', function(data) {
			feedData = data;
		});
}
function eventUpdate(){
	  $('#event1').fadeOut(500);
	  $('#event2').fadeOut(500, function(){
		  $('#event1').delay(1000).html(feedData[index1]).fadeIn('fast');
		  $('#event2').delay(1000).html(feedData[index2]).fadeIn('fast');
	  });
	  index1 = (index1 + 2) % 6;
	  index2 = (index2 + 2) % 6;
}
var Main = function()
{
		
};

Main.onLoad = function()
{
	// Enable key event processing
	this.enableKeys();
	widgetAPI.sendReadyEvent();
	doAjax();
	setInterval(eventUpdate, 1000*15);
	setInterval(doAjax, 1000*15*60);
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
