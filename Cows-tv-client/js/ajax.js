var feedData;
var index1 = 0;
var index2 = 1;
function doAjax() {
	$.ajaxSetup({
		async: false
		});
	$.getJSON('http://169.237.123.4/cows/includes/ajax.php', function(data) {
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
doAjax();
setInterval(eventUpdate, 1000*15);
setInterval(doAjax, 1000*15*60);