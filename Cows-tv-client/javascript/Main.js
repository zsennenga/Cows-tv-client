var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();
var feedData;
var index;
function doAjax() {
	$.ajaxSetup({
		async: false
		});
	$.getJSON('http://169.237.123.4/cows/includes/ajax.php?callback=?', function(data) {
			feedData = data;
			eventUpdate();
			index = 0;
		});
}
function eventUpdate(){
	  if (feedData[0] == "noEvent")	{
		 $('#content').html(feedData[1]); 
	  }
	  else if (feedData.length > 1)	{
		  $('#content').html(feedData[index]);
		  index = (index + 1) % feedData.length;
	  }
	  else	{
		  $('#content').html(feedData[0]);
		  index = 0;
	  }
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
	setInterval(eventUpdate, 1000*20);
	setInterval(doAjax, 1000*120*60);
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
