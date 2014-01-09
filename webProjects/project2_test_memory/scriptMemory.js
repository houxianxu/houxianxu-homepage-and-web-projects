$(document).ready(function() {
	// globals for user interface
	var level = 1;
	var updateNum;
	console.log("jlhohlfjdsljfsl;");
	// define event handlers


	// the timer handler
	var timer = function() {
		var countClockTimer = function () {
			var time_count = $("#time_count b"),
			timeRemain = Number(time_count.text());

			if (timeRemain <= 0) {
				clearInterval(countClock); // 停止计时
				$("#current_num").css("color", "#ffffff");
			} else{
				timeRemain -= 1;
				time_count.text(timeRemain);
			}
		};
		// 倒计时
		var	countClock = setInterval(function() {countClockTimer()} , 1000);
		
	};


	//  指定长度的随机数
	var randomNum = function (n) {
		//  生成 0-9 之间的随机数
		var oneRandomNum = function () {
			return Math.floor(Math.random() * 10);
		};
		var res = "";
		while (n > 0) {
			res += oneRandomNum();
			n--;
		}
		return res;
	};

	var updateCurrentNum = function () {
		var numDigital = level + 4;
		updateNum = randomNum(numDigital);
		$("#current_num").text(updateNum);
	};

	var updateLevel = function () {
		level += 1;
		$("#level").text("Level: " + level);
	};

	$(".start_btn").click(function () {
		$(".start_page").css("display", "none");
		updateCurrentNum();
		timer();

	});

	var preventDefault = function (event) {
		if (typeof event.target !== "undefined") {
			return event.target;
		} else {
			return event.srcElement;
		}
	};

	$(".enter").click(function (event) {
		event.preventDefault();

		var inputNum = $(".text").val();
		if (inputNum === updateNum) {
			updateLevel();
			updateCurrentNum();
			$("#time_count b").text("5");
			timer();
			$(".text").val("");
				
		} else {
			alert("the number you put is not right!");
			$("#container").css("display", "none");
			$(".game_over").css("display", "block");
		}

	});

});
