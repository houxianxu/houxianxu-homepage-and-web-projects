$(document).ready(function() {
	// 定义全局变量
	var CELL_WIDTH = 25,
		CELL_HEIGHT = 25,
		BOARD_ROWS = 20,
		BOARD_COLS = 16;
	var blocks,
		board,
		currentBlock,
		isPlaying,
		paused,
		score,
		gameTimer;

	var speed =500;
	var colors = ["red", "black", "blue" , "brown", "green", "yellow", "purple"];
	var tetrisCanvas = $('canvas')[0]; // 选定canvas，当时用$('canvas'), debug了好久才发现

	// 定义board类
	function Board(cellWidth, cellHeight, boardRows, boardCols) {
		this.cellWidth = cellWidth;
		this.cellHeight = cellHeight;
		this.boardRows = boardRows;
		this.boardCols = boardCols;
		// 这个游戏需要用到所绘制的方块，通过给每个方块填充不同的颜色来得到不同的形状
		// 在board中，用一个二维数组 ROWS * COLS 记录方块的状态 --> 是否被填充
		this.itemStatus = [];
		for (var i = 0; i < this.boardRows; i++) {
			var tempRow = []
			for(var j = 0; j < this.boardCols; j++) {
				tempRow.push(0);  // 0 -> 没填充 >0 表示填充
			}
			this.itemStatus.push(tempRow);
		}

		// 获取HTML5中canvas绘图API，并绘制格
		this.tetrisCtx = tetrisCanvas.getContext('2d');		
	}

	// 绘制表格
	Board.prototype.createCanvas = function () {
		
		tetrisCanvas.width = this.boardCols * this.cellWidth;
		tetrisCanvas.height = this.boardRows * this.cellHeight;

		// 绘制行
		for (var i = 1; i < tetrisCanvas.height; i++) {
			this.tetrisCtx.moveTo(0, i * this.cellHeight);
			this.tetrisCtx.lineTo(tetrisCanvas.width, i * this.cellHeight);
		}
		// 绘制列
		for (var i = 1; i < tetrisCanvas.width; i++) {
			this.tetrisCtx.moveTo(i * this.cellWidth, 0);
			this.tetrisCtx.lineTo(i * this.cellWidth, tetrisCanvas.height);
		}
		
		this.tetrisCtx.lineWidth = 0.5;
		this.tetrisCtx.stroke();
	}; 

	// 判断是否有满行的
	Board.prototype.lineFull = function() {
		for (var i = 0; i < this.boardRows; i++) {
			var full = true;
			for (var j = 0; j < this.boardCols; j++) {
				if (this.itemStatus[i][j] == 0) {
					full = false;
					break;
				}
			}

			// 第i行填满
			if (full) {
				// 得分 100
				score += 100;
				$("#score").text(score);

				// 将第 i 行以行的所有方块下移一行
				for (m = i; m > 0; m--) {
					for (n = 0; n < this.boardCols; n++) {
						this.itemStatus[m][n] = this.itemStatus[m - 1][n];
					}
				}
				// 全部重新绘制方块
				board.drawAllBlocks();
			}	
		}
	};

	// 根据 status 绘制所有的方块
	Board.prototype.drawAllBlocks = function() {
		for (i = 0; i < board.boardRows; i++) {
			for (j = 0; j < board.boardCols; j++) {
				if (board.itemStatus[i][j] != 0) {
					board.tetrisCtx.fillStyle = board.itemStatus[i][j];
				} else {
					// 绘制白色
					board.tetrisCtx.fillStyle = "white";
				}
				board.tetrisCtx.fillRect(j * board.cellWidth + 1, i * board.cellHeight + 1, board.cellWidth -1 , board.cellHeight - 1);

			}
		}
	};

	function Blocks(board) {
		// 定义游戏中所用到的方块组合(4个小方块)，起始位置在canvas最上面的中间位置。
		// 第一种组合 "Z"
		var block1 = [
			{ x: board.boardCols / 2 - 1 , y: 0, color: colors[0] },
	  		{ x: board.boardCols / 2, y: 0, color: colors[0] },
	  		{ x: board.boardCols / 2, y: 1, color: colors[0] },
	 		{ x: board.boardCols / 2 + 1, y: 1, color: colors[0] }
		];

		// 第二种 反"Z"
		var block2 = [
			{ x: board.boardCols / 2 + 1 , y: 0, color: colors[1] },
			{ x: board.boardCols / 2, y: 0, color: colors[1] },
			{ x: board.boardCols / 2, y: 1, color: colors[1] },
			{ x: board.boardCols / 2 - 1, y: 1, color: colors[1]}
		];
	    // 第三种 "7"
		var block3 = [
			{ x: board.boardCols / 2 , y: 0, color: colors[2] },
			{ x: board.boardCols / 2 + 1, y: 0, color: colors[2] },
			{ x: board.boardCols / 2 + 1, y: 1, color: colors[2] },
			{ x: board.boardCols / 2 + 1, y: 2, color: colors[2]}		
		];

		// 第四种 反"7"
		var block4 = [
			{ x: board.boardCols / 2, y: 0, color: colors[3] },
			{ x: board.boardCols / 2, y: 1, color: colors[3] },
			{ x: board.boardCols / 2, y: 2, color: colors[3] },
			{ x: board.boardCols / 2 + 1, y: 0, color: colors[3]}
		];

		// 第五种 "田"
		var block5 = [
			{ x: board.boardCols / 2, y: 0, color: colors[4] },
			{ x: board.boardCols / 2, y: 1, color: colors[4] },
			{ x: board.boardCols / 2 + 1, y: 0, color: colors[4]},
			{ x: board.boardCols / 2 + 1, y: 1, color: colors[4]}
		];
		
		// 第六种 "|"
		var block6 = [
			{ x: board.boardCols / 2, y: 0, color: colors[5] },
			{ x: board.boardCols / 2, y: 1, color: colors[5] },
			{ x: board.boardCols / 2, y: 2, color: colors[5] },
			{ x: board.boardCols / 2, y: 3, color: colors[5]}
		];

		// 第七种 类"山"
		var block7 =[
			{ x: board.boardCols / 2, y: 0, color: colors[6] },
			{ x: board.boardCols / 2, y: 1, color: colors[6] },
			{ x: board.boardCols / 2 -1 , y: 1, color: colors[6] },
			{ x: board.boardCols / 2 + 1, y: 1, color: colors[6]}
		];

		this.allBlocks = [block1, block2, block3, block4, block5, block6, block7];

		this.getRandomBlock = function() {
			var rand = Math.floor(Math.random() * this.allBlocks.length);
			return this.allBlocks[rand];
		};
	}

	// 定义方块类
	function Block(board, blocks) {
		this.board = board;
		this.blocks = blocks;	
	 	this.block = this.blocks.getRandomBlock();
	 }

	// 在board上显示block
	Block.prototype.drawBlock = function () {
		for (var i = 0; i < this.block.length; i++) {
				var currentPiece = this.block[i];
				this.board.tetrisCtx.fillStyle = currentPiece.color;
				this.board.tetrisCtx.fillRect((currentPiece.x) * this.board.cellWidth + 1, currentPiece.y * this.board.cellHeight + 1, this.board.cellWidth - 1, this.board.cellHeight - 1);
		}
	};

	// handler 使方块各下移动
	
	Block.prototype.moveDown = function () {
		var canDown = true;
		// 判断是否能下落
	
		for (var i = 0; i < this.block.length; i++) {

			// 是否到底部
			if (this.block[i].y >= this.board.boardRows - 1) {
				canDown = false;
				break;
			}

			// 是否下面有方块
			if (this.board.itemStatus[this.block[i].y + 1][this.block[i].x] != 0) {
				canDown = false;
				break;
			}
		}

		// 否则能落下
		if (canDown) {
			// 将原来的方块变为白色
			for (var i = 0; i < this.block.length; i++) {
				var currentPiece = this.block[i];
				this.board.tetrisCtx.fillStyle = "white";
				this.board.tetrisCtx.fillRect(currentPiece.x * this.board.cellWidth + 1, currentPiece.y * this.board.cellHeight + 1, this.board.cellWidth - 1, this.board.cellHeight - 1);
			}

			// 将每个方块的y加1
			for (var i = 0; i < this.block.length; i++) {
				var currentPiece = this.block[i];
				currentPiece.y += 1;
			}

			// 下移后加上颜色
			for (var i = 0; i < this.block.length; i++) {
				var currentPiece = this.block[i];
				this.board.tetrisCtx.fillStyle = currentPiece.color;
				this.board.tetrisCtx.fillRect(currentPiece.x * this.board.cellWidth + 1, currentPiece.y * this.board.cellHeight + 1, this.board.cellWidth - 1, this.board.cellHeight - 1);
			}
		}
		// 不能下落
		else {
			// clearInterval(gameTimer);
			// 将每个方块的状态进行记录
			for (var i = 0; i < this.block.length; i++) {
				var currentPiece = this.block[i];
				if (currentPiece.y < 2) {
					clearInterval(gameTimer);
					alert("Game over! \n\nHave a wonderful day!");
					isPlaying = false;
					return; // 跳出函数					
				}
				
			// 改变状态
				this.board.itemStatus[currentPiece.y][currentPiece.x] = currentPiece.color;
			}
			this.board.lineFull();
			blocks = new Blocks(board);
			currentBlock = new Block(board, blocks);
			currentBlock.drawBlock();

		}
	};
	// handler 向左移
	Block.prototype.moveLeft = function() {
		var canLeft = true;
		// 判断是否能左移
	
		for (var i = 0; i < this.block.length; i++) {

			// 是否到最左边
			if (this.block[i].x <= 0) {
				canLeft = false;
				break;
			}

			// 是否左边有方块
			if (this.board.itemStatus[this.block[i].y][this.block[i].x - 1] != 0) {
				canLeft = false;
				break;
			}
		}

		// 否则能落下
		if (canLeft) {
			// 将原来的方块变为白色
			for (var i = 0; i < this.block.length; i++) {
				var currentPiece = this.block[i];
				this.board.tetrisCtx.fillStyle = "white";
				this.board.tetrisCtx.fillRect(currentPiece.x * this.board.cellWidth + 1, currentPiece.y * this.board.cellHeight + 1, this.board.cellWidth - 1, this.board.cellHeight - 1);
			}

			// 将每个方块的x-1
			for (var i = 0; i < this.block.length; i++) {
				var currentPiece = this.block[i];
				currentPiece.x -= 1;
			}

			// 下移后加上颜色
			for (var i = 0; i < this.block.length; i++) {
				var currentPiece = this.block[i];
				this.board.tetrisCtx.fillStyle = currentPiece.color;
				this.board.tetrisCtx.fillRect(currentPiece.x * this.board.cellWidth + 1, currentPiece.y * this.board.cellHeight + 1, this.board.cellWidth - 1, this.board.cellHeight - 1);
			}
		}
		// 不能左移
		else {
			return;
		}
	};
	// handler 向右移
	Block.prototype.moveRight = function() {
		var canRight = true;
		// 判断是否能右移
	
		for (var i = 0; i < this.block.length; i++) {

			// 是否到最右边
			if (this.block[i].x >= this.board.boardCols - 1) {
				canRight = false;
				break;
			}

			// 是否右边有方块
			if (this.board.itemStatus[this.block[i].y][this.block[i].x + 1] != 0) {
				canRight = false;
				break;
			}
		}

		// 否则能落下
		if (canRight) {
			// 将原来的方块变为白色
			for (var i = 0; i < this.block.length; i++) {
				var currentPiece = this.block[i];
				this.board.tetrisCtx.fillStyle = "white";
				this.board.tetrisCtx.fillRect(currentPiece.x * this.board.cellWidth + 1, currentPiece.y * this.board.cellHeight + 1, this.board.cellWidth - 1, this.board.cellHeight - 1);
			}

			// 将每个方块的 x+1
			for (var i = 0; i < this.block.length; i++) {
				var currentPiece = this.block[i];
				currentPiece.x += 1;
			}

			// 下移后加上颜色
			for (var i = 0; i < this.block.length; i++) {
				var currentPiece = this.block[i];
				this.board.tetrisCtx.fillStyle = currentPiece.color;
				this.board.tetrisCtx.fillRect(currentPiece.x * this.board.cellWidth + 1, currentPiece.y * this.board.cellHeight + 1, this.board.cellWidth - 1, this.board.cellHeight - 1);
			}
		}
		// 不能左移
		else {
			return;
		}
	};

	Block.prototype.rotateBlock = function() {
			canRotate = true;

			// 需要旋转90度来得到新的方块
			for (var i = 0; i < this.block.length; i++) {
				var oriX = this.block[i].x,
					oriY = this.block[i].y;
				// 以第二个方块为中心旋转
				var rotatePiece = this.block[2]
				if (i != 2) {
					// 新的坐标
					var newX = rotatePiece.x + oriY - rotatePiece.y,
						newY = rotatePiece.y + rotatePiece.x - oriX;

					// 判断新的坐标是否合理， 是否在board里
					// 超出右边 或 左边
					if (newX < 0 || newY > (this.board.boardCols - 1)) {
						canRotate = false;
						break;
					}
					// 新的位置已有方块
					if (this.board.itemStatus[newY][newX] != 0) {
						canRotate = false;
						break;
					}
				}
			}

			// 如果能旋转
			if (canRotate) {
				// 将原来的方块变为白色
				for (var i = 0; i < this.block.length; i++) {
					var currentPiece = this.block[i];
					this.board.tetrisCtx.fillStyle = "white";
					this.board.tetrisCtx.fillRect(currentPiece.x * this.board.cellWidth + 1, currentPiece.y * this.board.cellHeight + 1, this.board.cellWidth - 1, this.board.cellHeight - 1);
				}
				// 变换坐标
				for (var i = 0; i < this.block.length; i++) {
					var oriX = this.block[i].x,
						oriY = this.block[i].y;
					// 以第二个方块为中心旋转
					var rotatePiece = this.block[2]
					if (i != 2) {
						// 新的坐标
						this.block[i].x = rotatePiece.x + oriY - rotatePiece.y;
						this.block[i].y = rotatePiece.y + rotatePiece.x - oriX;
					}
				}

				// 旋转后加上颜色 新坐标
				for (var i = 0; i < this.block.length; i++) {
					var currentPiece = this.block[i];
					this.board.tetrisCtx.fillStyle = currentPiece.color;
					this.board.tetrisCtx.fillRect(currentPiece.x * this.board.cellWidth + 1, currentPiece.y * this.board.cellHeight + 1, this.board.cellWidth - 1, this.board.cellHeight - 1);
				}
			}
	};


	var listenHandler = function () {
		$("#pause").click(function() {
			if (! paused) {
				clearInterval(gameTimer);
				paused = true;
			} else {
				gameTimer = setInterval(function () {currentBlock.moveDown();}, speed);
				paused = false;
			}
		});

		$("#restart").click(function () {
			clearInterval(gameTimer);
			startGame();
			
			
		});

		$("#speedUp").click(function() {
			speed *= 0.8;

			// 显示速度增加
			currentSpeed = parseInt($("#currentSpeed").text());
			currentSpeed += 1;
			$("#currentSpeed").text(currentSpeed);

			clearInterval(gameTimer);
			gameTimer = setInterval(function () {currentBlock.moveDown();}, speed);
		});
	};

	var startGame = function () {
		board = new Board(CELL_WIDTH, CELL_HEIGHT, BOARD_ROWS, BOARD_COLS);
		board.createCanvas();
		isPlaying = true;
		score = 0;
		speed = 500;
		$("#currentSpeed").text(0);
		blocks = new Blocks(board);
		currentBlock = new Block(board, blocks);
		currentBlock.drawBlock();
		gameTimer = setInterval(function () {currentBlock.moveDown();}, speed);
		paused = false;
		
	};
	
	// startGame();
	window.onkeydown = function (evt) {
		if (isPlaying) {
			if (evt.keyCode == 37) {
				currentBlock.moveLeft();
			}
			if (evt.keyCode == 40) {
				currentBlock.moveDown();
			}
			if (evt.keyCode == 39) {
				currentBlock.moveRight();
			}
			if (evt.keyCode == 38) {
				currentBlock.rotateBlock();
			}
		}
	}

	windowLoad = function() {
		listenHandler();
		clearInterval(gameTimer);
		startGame();
	};

	windowLoad();
	// console.log(board.itemStatus);
});
