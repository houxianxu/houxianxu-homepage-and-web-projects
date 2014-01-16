$(document).ready(function() {
	// 定义全局变量
	var CELL_WIDTH = 25,
		CELL_HEIGHT = 25,
		ROWS = 20,
		COLS = 16;
	var colors = ["#fff", "#f00" , "#0f0" , "#00f", "#c60" , "#f0f" , "#0ff"];
	var currentBlock;

	var createCanvas = function	(rows, cols, cellWidth, cellHeight) {
		tetrisCanvas = $('canvas')[0]; // 选定canvas，当时用$('canvas'), debug了好久才发现
		tetrisCanvas.width = cols * cellWidth;
		tetrisCanvas.height = rows * cellHeight;
		alert(tetrisCanvas.width);

		// 获取HTML5中canvas绘图API，并绘制格
		tetrisCtx = tetrisCanvas.getContext('2d');

		// 绘制行
		for (var i = 1; i < tetrisCanvas.height; i++) {
			tetrisCtx.moveTo(0, i * cellHeight);
			tetrisCtx.lineTo(tetrisCanvas.width, i * cellHeight);
		}
		// 绘制列
		for (var i = 1; i < tetrisCanvas.width; i++) {
			tetrisCtx.moveTo(i * cellWidth, 0);
			tetrisCtx.lineTo(i * cellWidth, tetrisCanvas.height);
		}
		
		tetrisCtx.lineWidth = 0.5;
		tetrisCtx.stroke();
	};

	// 这个游戏需要用到所绘制的方块，通过给每个方块填充不同的颜色来得到不同的形状
	// 用一个二维数组 ROWS * COLS 记录方块的状态 --> 是否被填充
	var tetrisItemStatus = [];
	for (var i = 0; i < ROWS; i++) {
		var tempRow = []
		for(var j = 0; j < COLS; j++) {
			tempRow.push(0);  // 0 -> 没填充 >0 表示填充
		}
		tetrisItemStatus.push(tempRow);
	}

	// 定义游戏中所用到的方块组合(4个小方块)，起始位置在canvas最上面的中间位置。
	// 第一种组合 "Z"
	var block1 = [
		{ x: COLS / 2 - 1 , y: 0, color: colors[1] },
  		{ x: COLS / 2, y: 0, color: colors[1] },
  		{ x: COLS / 2, y: 1, color: colors[1] },
 		{ x: COLS / 2 + 1, y: 1, color: colors[1] }
	];

	// 第二种 反"Z"
	var block2 = [
		{ x: COLS / 2 + 1 , y: 0, color: colors[2] },
		{ x: COLS / 2, y: 0, color: colors[2] },
		{ x: COLS / 2, y: 1, color: colors[2] },
		{ x: COLS / 2 - 1, y: 1, color: colors[2]}
	];
    // 第三种 "7"
	var block3 = [
		{ x: COLS / 2 , y: 0, color: colors[3] },
		{ x: COLS / 2 + 1, y: 0, color: colors[3] },
		{ x: COLS / 2 + 1, y: 1, color: colors[3] },
		{ x: COLS / 2 + 1, y: 2, color: colors[3]}		
	];

	// 第四种 反"7"
	var block4 = [
		{ x: COLS / 2, y: 0, color: colors[4] },
		{ x: COLS / 2, y: 1, color: colors[4] },
		{ x: COLS / 2, y: 2, color: colors[4] },
		{ x: COLS / 2 + 1, y: 0, color: colors[4]}
	];

	// 第五种 "田"
	var block5 = [
		{ x: COLS / 2, y: 0, color: colors[5] },
		{ x: COLS / 2, y: 1, color: colors[5] },
		{ x: COLS / 2 + 1, y: 0 color: colors[5] },
		{ x: COLS / 2 + 1, y: 1, color: colors[5]}
	];
	
	// 第六种 "|"
	var block6 = [
		{ x: COLS / 2, y: 0, color: colors[6] },
		{ x: COLS / 2, y: 1, color: colors[6] },
		{ x: COLS / 2, y: 2, color: colors[6] },
		{ x: COLS / 2, y: 3, color: colors[6]}
	];

	// 第七种 类"山"
	var block7 =[
		{ x: COLS / 2, y: 0, color: colors[7] },
		{ x: COLS / 2, y: 1, color: colors[7] },
		{ x: COLS / 2 -1 , y: 1, color: colors[7] },
		{ x: COLS / 2 + 1, y: 1, color: colors[7]}
	];

	var blocks = [block1, block2, block3, block4, block5, block6, block7]

	// 创建ABlock对象，返回一个随机的block
	var initialBlock = function () {
		var rand = Math.floor(Math.random() * blocks.length),
			currentBlock = block[rand];
	};

	var moveDown = function() {
		var canDown = true;
		// 判断是否能下落
		for (var i = 0; i < currentBlock.length; i++) {

			// 是否到底部
			if (currentBlock[i].y >= ROWS - 1) {
				canDown = false;
				break;
			}

			// 是否下面有方块
			if (tetrisItemStatus[currentBlock[i].y + 1][currentBlock[i].x] != 0) {
				canDown = false;
				break;
			}
		}

		// 否则能落下
		if (canDown) {
			// 将原来的方块变为白色
			for (var i = 0; i < currentBlock.length; i++) {
				var currentPiece = currentBlock[i];
				tetrisCtx.fillStyle = "white";
				tetrisCtx.fillRect((currentPiece.x) * cellWidth, currentPiece.y * cellHeight, cellWidth, cellHeight);
			}

			// 将每个方块的y加1
			for (var i = 0; i < currentBlock.length; i++) {
				var currentPiece = currentBlock[i];
				currentPiece.y += 1;
			}

			// 下移后加上颜色
			for (var i = 0; i < currentBlock.length; i++) {
				var currentPiece = currentBlock[i];
				tetrisCtx.fillStyle = currentPiece.color;
				tetrisCtx.fillRect((currentPiece.x) * cellWidth, currentPiece.y * cellHeight, cellWidth, cellHeight);
			}
		} 
		// 不能下落
		else {
			// 看有没有可消除行
			lineFull();

			// 将每个方块的状态进行记录
			for (var i = 0; i < currentBlock.length; i++) {
				var currentPiece = currentBlock[i];
				// 游戏结束
				if (currentPiece.y <= 2) {
					alert("Game over!");
					isPlaying = false;
					clearInterval(gameTimer);
				}
				// 改变状态
				tetrisItemStatus[currentPiece.y][currentPiece.x] = currentPiece.color;
			}
		}
	};

	var lineFull = function() {
		for (var i = 0; i < ROWS; i++) {
			var full = true;
			for (j = 0; j < COLS; j++ ) {
				if (tetrisItemStatus[i][j] == 0) {
					full = false
					break;
				}
			}

			// 如果行满
			if (full) {
				// 将当前行以上的方块下移一行
				for (var m = i; m >0; m--) {
					for (var n = 0; n < COLS; n++) {
						tetrisItemStatus[m][n] = tetrisItemStatus[m - 1][n];
					}
				}
				// 重新绘制所有方块
				drawAllBlock();
			}
		}
	};


	// 根据status把canvas上的所有方块都画出来
	var drawAllBlock = function () {
		for (var i = 0; i < ROWS; i++) {
			for (var j = 0; j < COLS; j++){
				if (tetrisItemStatus[i][j] != 0) {
					tetrisCtx.fillStyle = tetrisItemStatus[i][j];
				}
				else {
					tetrisCtx.fillStyle = "white";
				}
				tetrisCtx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
			}
		}
	};


	
	createCanvas(ROWS, COLS, CELL_WIDTH, CELL_HEIGHT);
	initialBlock()

});
