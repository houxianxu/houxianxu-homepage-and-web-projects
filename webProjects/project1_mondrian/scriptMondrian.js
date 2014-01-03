$(document).ready(function() {
	var pickColor = "white";
	var randomColor = function () {
		return '#' + Math.random().toString(16).slice(2, 8);
	}

	$('#random').click(function() {
		pickColor = randomColor();
		$(this).css('background-color', pickColor);
		console.log(pickColor);
	});

	$('.color').click(function() {
		pickColor = $(this).css('background-color');
		if (pickColor !== "white") {
			console.log(pickColor); // debug
			$('.row').css('cursor', "pointer");
		}
	});


	
	$('.row').click(function() {
		if (pickColor === "white") {
			alert("Please pick a color!")
		}

		$(this).css('background-color', pickColor);
	});

	$('button').click(function() {
		$('.row').css('background-color', "white");
		pickColor = "white";
		$('.row').css('cursor', "not-allowed");
	});


});
