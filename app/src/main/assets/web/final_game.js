const BLACK = 1;
const WHITE = 2;

let gamestate;          //0-63: field, 64: blackId, 65: whiteId, 66: turn counter, 67: pass counter
let currentPlayer;
let playerColor;
let opponentColor;

const WHITE_ID = 64;
const BLACK_ID = 65;

const TURN_COUNTER = 66;
const PASS_COUNTER = 67;



function startCheckersGame(gamest) {
launch_snackbar("In the game");
gamestate = gamest;
/*=========variabile globale=========================*/


var square_class = document.getElementsByClassName("square1");
var white_checker_class = document.getElementsByClassName("white_checker");
var black_checker_class = document.getElementsByClassName("black_checker");
var table = document.getElementById("table1");
var score = document.getElementById("score");
var black_background = document.getElementById("black_background");

var windowHeight = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;  ;
var windowWidth =  window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;
var moveLength = 60 ;
var moveDeviation = 10;
var Dimension = 1;
var selectedPiece,selectedPieceindex;
var upRight,upLeft,downLeft,downRight;  // toate variantele posibile de mers pt o  dama
var contor = 0 , gameOver = 0;
var bigScreen = 1;

var block = [];
var w_checker = [];
var b_checker = [];
var the_checker ;
var oneMove;
var anotherMove;
var mustAttack = false;
var multiplier = 1 // 2 daca face saritura 1 in caz contrat

var tableLimit,reverse_tableLimit ,  moveUpLeft,moveUpRight, moveDownLeft,moveDownRight , tableLimitLeft, tableLimitRight;

/*================================*/
	getDimension();
	if(windowWidth > 480){
		moveLength = 60;
		moveDeviation = 10;
	}
	else{
		moveLength = 40;
		moveDeviation = 6;
	}

/*================declararea claselor=========*/

var square_p = function(square,index){
	this.id = square;
	this.ocupied = false;
	this.pieceId = undefined;
	this.id.onclick = function() {
		makeMove(index);
	}
}

var checker = function(piece,color,square) {
	this.id = piece;
	this.color = color;
	this.king = false;
	this.ocupied_square = square;
	this.alive = true;
	this.attack = false;
	if(square%8){
		this.coordX= square%8;
		this.coordY = Math.floor(square/8) + 1 ;
	}
	else{
		this.coordX = 8;
		this.coordY = square/8 ;
	}
	this.id.onclick = function  () {
		showMoves(piece);
	}
}

checker.prototype.setCoord = function(X,Y){
	var x = (this.coordX - 1  ) * moveLength + moveDeviation;
	var y = (this.coordY - 1 ) * moveLength  + moveDeviation;
	this.id.style.top = y + 'px';
	this.id.style.left = x + 'px';
}

checker.prototype.changeCoord = function(X,Y){
	this.coordY +=Y;
	this.coordX += X;
}

checker.prototype.checkIfKing = function () {
	if(this.coordY == 8 && !this.king &&this.color == "white"){
		this.king = true;
		this.id.style.border = "4px solid #FFFF00";
	}
	if(this.coordY == 1 && !this.king &&this.color == "black"){
		this.king = true;
		this.id.style.border = "4px solid #FFFF00";
	}
}

/*===============Initializarea campurilor de joc =================================*/
launch_snackbar("2222222222222222")
var white_counter = 0;
var black_counter = 0;
for (var i = 1; i <=64; i++){
    launch_snackbar("i = " + i);
	block[i] =new square_p(square_class[i],i);
	launch_snackbar("square " + i + " created");
	if (gamest[i-1] != 0 ){

        if(gamest[i - 1] == -1){
            block[i].ocupied = true;
            launch_snackbar("in black if " + i);
            black_counter = black_counter + 1;

            b_checker[black_counter] = new checker(black_checker_class[black_counter], "black", i );
            b_checker[black_counter].setCoord(0,0);
            block[i].pieceId =b_checker[black_counter];

        } else if(gamest[i - 1] == 1){
            block[i].ocupied = true;
            launch_snackbar("in white if " + i);
            white_counter = white_counter + 1;
            launch_snackbar("111");

            launch_snackbar("222");
            w_checker[white_counter] = new checker(white_checker_class[white_counter], "white", i );
            launch_snackbar("333");
            w_checker[white_counter].setCoord(0,0);
            block[i].pieceId =w_checker[white_counter];

        }else {
            return 0;
        }
	}
}
// launch_snackbar("white counter " + white_counter + " black counter " + black_counter);
launch_snackbar("You are " + playerColor + ", turn " + gamestate[TURN_COUNTER]);
for(var i = white_counter + 1; i <= 12; i++){
    launch_snackbar("in white");
    w_checker[white_counter] = new checker(white_checker_class[white_counter], "white", i );
    w_checker[white_counter].setCoord(0,0);
    w_checker[white_counter].alive = false;
    w_checker[white_counter].id.style.display  = "none";
}

for(var i = black_counter + 1; i <= 12; i++){
    launch_snackbar("in black");
    b_checker[black_counter] = new checker(black_checker_class[black_counter], "black", i );
    b_checker[black_counter].setCoord(0,0);
    b_checker[black_counter].alive = false;
    b_checker[black_counter].id.style.display  = "none";
}
launch_snackbar("gooood")
/*========================================================*/


if(is_player_white(myId)){
    the_checker = w_checker;
	playerColor = "white";
}else{
    the_checker = b_checker;
	playerColor = "black";
}

function showMoves (piece) {

    if(!is_my_turn(myId)){
        launch_snackbar("Now is not your turn.");
        return false;
    }
	launch_snackbar("white " + is_player_white(myId));
	launch_snackbar("turn " + gamestate[TURN_COUNTER]);
	var match = false;
	mustAttack = false;
	if(selectedPiece){
			erase_roads(selectedPiece);
	}
	selectedPiece = piece;
	var i,j; // retine indicele damei
	for ( j = 1; j <= 12; j++){
		if(the_checker[j].id == piece){
			i = j;
			selectedPieceindex = j;
			match = true;
		}
	}

	if(oneMove && !attackMoves(oneMove)){
//		changeTurns(oneMove);
		oneMove = undefined;
		return false;
	}
	if(oneMove && oneMove != the_checker[i] ){
		return false;
	}

	if(!match) {
	 return 0 ; // daca nu a fost gasit nicio potrivire ; se intampla cand de exemplu rosu muta iar tu apasi pe negru
	}

	/*===acum in functie de culoarea lor setez marginile si miscarile damei===*/
	if(the_checker[i].color =="white"){
		tableLimit = 8;
		tableLimitRight = 1;
		tableLimitLeft = 8;
		moveUpRight = 7;
		moveUpLeft = 9;
		moveDownRight = - 9;
		moveDownLeft = -7;
	}
	else{
		tableLimit = 1;
		tableLimitRight = 8;
		tableLimitLeft = 1;
		moveUpRight = -7;
		moveUpLeft = -9;
		moveDownRight = 9;
		moveDownLeft = 7;
	}
 	/*===========VERIFIC DACA POT ATACA====*/


		attackMoves(the_checker[i]); // verifica daca am vreo miscare de atac


	/*========DACA NU POT ATACA VERIFIC DACA POT MERGE======*/

 	if(!mustAttack){
 	  downLeft = checkMove( the_checker[i] , tableLimit , tableLimitRight , moveUpRight , downLeft);
		downRight = checkMove( the_checker[i] , tableLimit , tableLimitLeft , moveUpLeft , downRight);
		if(the_checker[i].king){
			upLeft = checkMove( the_checker[i] , reverse_tableLimit , tableLimitRight , moveDownRight , upLeft);
			upRight = checkMove( the_checker[i], reverse_tableLimit , tableLimitLeft , moveDownLeft, upRight)
		}
	}
	if(downLeft || downRight || upLeft || upRight){
			return true;
		}
	return false;

}

function is_my_turn(myId){

    if(myId == gamestate[WHITE_ID] && gamestate[TURN_COUNTER] % 2 == 0){
        return true;
    } else if (myId == gamestate[BLACK_ID] && gamestate[TURN_COUNTER] % 2 == 1){
        return true;
    } else{
        return false;
    }
}

function is_player_white(myId){
    if(myId == gamestate[WHITE_ID]){
        return true;
    } else{
        return false;
    }
}


function erase_roads(piece){
	if(downRight) block[downRight].id.style.background = "#BA7A3A";
	if(downLeft) block[downLeft].id.style.background = "#BA7A3A";
	if(upRight) block[upRight].id.style.background = "#BA7A3A";
	if(upLeft) block[upLeft].id.style.background = "#BA7A3A";
}

/*=============MUTAREA PIESEI======*/

function makeMove (index) {
	var isMove = false;
	if(!selectedPiece) // daca jocu de abea a inceput si nu a fost selectata nicio piesa
		return false;
	if(index != upLeft && index != upRight && index != downLeft && index != downRight){
		erase_roads(0);
		selectedPiece = undefined;
		return false;
	}

 /* =========perspectiva e a jucatorului care muta ======*/
	if(the_checker[1].color=="white"){
		cpy_downRight = upRight;
		cpy_downLeft = upLeft;
		cpy_upLeft = downLeft;
		cpy_upRight = downRight;
	}
	else{
		cpy_downRight = upLeft;
		cpy_downLeft = upRight;
		cpy_upLeft = downRight;
		cpy_upRight = downLeft;
	}

	if(mustAttack)  // ca sa stiu daca sar doar un rand sau 2
		multiplier = 2;
	else
		multiplier = 1;


	if(index == cpy_upRight){
		isMove = true;
		if(the_checker[1].color=="white"){
			// muta piesa
			executeMove( multiplier * 1, multiplier * 1, multiplier * 9 );
			//elimina piesa daca a fost executata o saritura
			if(mustAttack) eliminateCheck(index - 9);
		}
		else{
			executeMove( multiplier * 1, multiplier * -1, multiplier * -7);
			if(mustAttack) eliminateCheck( index + 7 );
		}
		update_gamestate();
	}

	if(index == cpy_upLeft){

		isMove = true;
		if(the_checker[1].color=="white"){
			executeMove( multiplier * -1, multiplier * 1, multiplier * 7);
			if(mustAttack)	eliminateCheck(index - 7 );
		}
		else{
			executeMove( multiplier * -1, multiplier * -1, multiplier * -9);
			if (mustAttack) eliminateCheck( index + 9 );
		}
		update_gamestate();
	}

	if(the_checker[selectedPieceindex].king){

		if(index == cpy_downRight){
			isMove = true;
			if(the_checker[1].color=="white"){
				executeMove( multiplier * 1, multiplier * -1, multiplier * -7);
				if(mustAttack) eliminateCheck ( index  + 7) ;
			}
			else{
				executeMove( multiplier * 1, multiplier * 1, multiplier * 9);
				if(mustAttack) eliminateCheck ( index  - 9) ;
			}
			update_gamestate();
		}

		if(index == cpy_downLeft){
			isMove = true;
			if(the_checker[1].color=="white"){
				executeMove( multiplier * -1, multiplier * -1, multiplier * -9);
				if(mustAttack) eliminateCheck ( index  + 9) ;

			}
			else{
				executeMove( multiplier * -1, multiplier * 1, multiplier * 7);
				if(mustAttack) eliminateCheck ( index  - 7) ;
			}
			update_gamestate();
		}
	}

	erase_roads(0);
	the_checker[selectedPieceindex].checkIfKing();

	if (isMove) {

			anotherMove = undefined;
		 if(mustAttack) {
			 	anotherMove = attackMoves(the_checker[selectedPieceindex]);
		 }
		if (anotherMove){
			oneMove = the_checker[selectedPieceindex];
			showMoves(oneMove);
		}
		else{
			oneMove = undefined;
//		 	changeTurns(the_checker[1]);
//		 	gameOver = checkIfLost();
//		 	if(gameOver) { setTimeout( declareWinner(),3000 ); return false};
//		 	gameOver = checkForMoves();
//		 	if(gameOver) { setTimeout( declareWinner() ,3000) ; return false};
		}
	}


}

function update_gamestate(){

	for (var i = 1; i <= 64; i++){
		if (block[i].ocupied){
			if(block[i].pieceId.color == "black"){
				gamestate[i-1] = -1;
			} else if(block[i].pieceId.color == "white"){
				gamestate[i-1] = 1;
			}
		}else{
			gamestate[i-1] = 0;
		}
	}
	gamestate[TURN_COUNTER]++;
	sendGameState();
}

	function sendGameState() {
		post_new_gamestate("checkers", gamestate);
	}

function executeMove (X,Y,nSquare){
	// schimb coordonate piesei mutate
	the_checker[selectedPieceindex].changeCoord(X,Y);
	the_checker[selectedPieceindex].setCoord(0,0);
	// eliberez campul pe care il ocupa piesa si il ocup pe cel pe care il va ocupa
	block[the_checker[selectedPieceindex].ocupied_square].ocupied = false;
	//alert (the_checker[selectedPieceindex].ocupied_square);
	block[the_checker[selectedPieceindex].ocupied_square + nSquare].ocupied = true;
	block[the_checker[selectedPieceindex].ocupied_square + nSquare].pieceId = 	block[the_checker[selectedPieceindex].ocupied_square ].pieceId;
	block[the_checker[selectedPieceindex].ocupied_square ].pieceId = undefined;
	the_checker[selectedPieceindex].ocupied_square += nSquare;

}

function checkMove(Apiece,tLimit,tLimit_Side,moveDirection,theDirection){
	if(Apiece.coordY != tLimit){
		if(Apiece.coordX != tLimit_Side && !block[ Apiece.ocupied_square + moveDirection ].ocupied){
			block[ Apiece.ocupied_square + moveDirection ].id.style.background = "#704923";
			theDirection = Apiece.ocupied_square + moveDirection;
		}
	else
			theDirection = undefined;
	}
	else
		theDirection = undefined;
	return theDirection;
}



function  checkAttack( check , X, Y , negX , negY, squareMove, direction){
	if(check.coordX * negX >= 	X * negX && check.coordY *negY <= Y * negY && block[check.ocupied_square + squareMove ].ocupied && block[check.ocupied_square + squareMove].pieceId.color != check.color && !block[check.ocupied_square + squareMove * 2 ].ocupied){
		mustAttack = true;
		direction = check.ocupied_square +  squareMove*2 ;
		block[direction].id.style.background = "#704923";
		return direction ;
	}
	else
		direction =  undefined;
		return direction;
}

function eliminateCheck(indexx){
	if(indexx < 1 || indexx > 64)
		return  0;

	var x =block[ indexx ].pieceId ;
	x.alive =false;
	block[ indexx ].ocupied = false;
	x.id.style.display  = "none";
}


function attackMoves(ckc){

 		upRight = undefined;
 		upLeft = undefined;
 		downRight = undefined;
 		downLeft = undefined;

 	if(ckc.king ){
 		if(ckc.color == "white"){
			upRight = checkAttack( ckc , 6, 3 , -1 , -1 , -7, upRight );
			upLeft = checkAttack( ckc, 3 , 3 , 1 , -1 , -9 , upLeft );
		}
		else{
	 		downLeft = checkAttack( ckc , 3, 6, 1 , 1 , 7 , downLeft );
			downRight = checkAttack( ckc , 6 , 6 , -1, 1 ,9 , downRight );
		}
	}
	if(ckc.color == "white"){
	 	downLeft = checkAttack( ckc , 3, 6, 1 , 1 , 7 , downLeft );
		downRight = checkAttack( ckc , 6 , 6 , -1, 1 ,9 , downRight );
	}
	else{
		upRight = checkAttack( ckc , 6, 3 , -1 , -1 , -7, upRight );
		upLeft = checkAttack( ckc, 3 , 3 , 1 , -1 , -9 , upLeft );
	}

 	if(ckc.color== "black" && (upRight || upLeft || downLeft || downRight ) ) {
	 	var p = upLeft;
	 	upLeft = downLeft;
	 	downLeft = p;

	 	p = upRight;
	 	upRight = downRight;
	 	downRight = p;

	 	p = downLeft ;
	 	downLeft = downRight;
	 	downRight = p;

	 	p = upRight ;
	 	upRight = upLeft;
	 	upLeft = p;
 	}
 	if(upLeft != undefined || upRight != undefined || downRight != undefined || downLeft != undefined){
 		return true;

 	}
 	return false;
}

function changeTurns(ckc){
		if(ckc.color=="white")
	the_checker = b_checker;
else
	the_checker = w_checker;
 }

function checkIfLost(){
	var i;
	for(i = 1 ; i <= 12; i++)
		if(the_checker[i].alive)
			return false;
	return true;
}

function  checkForMoves(){
	var i ;
	for(i = 1 ; i <= 12; i++)
		if(the_checker[i].alive && showMoves(the_checker[i].id)){
			erase_roads(0);
			return false;
		}
	return true;
}

function declareWinner(){

	black_background.style.display = "inline";
	score.style.display = "block";
0
if(the_checker[1].color == "white")
	score.innerHTML = "Black wins";
else
	score.innerHTML = "Red wins";
}




function getDimension (){
	contor ++;
 windowHeight = window.innerHeight
	|| document.documentElement.clientHeight
	|| document.body.clientHeight;  ;
 windowWidth =  window.innerWidth
	|| document.documentElement.clientWidth
	|| document.body.clientWidth;
}




document.getElementsByTagName("BODY")[0].onresize = function(){

	getDimension();
	var cpy_bigScreen = bigScreen ;

if(windowWidth < 650){
		moveLength = 50;
		moveDeviation = 6;
		if(bigScreen == 1) bigScreen = -1;
	}
if(windowWidth > 650){
		moveLength = 80;
		moveDeviation = 10;
		if(bigScreen == -1) bigScreen = 1;
	}

	if(bigScreen !=cpy_bigScreen){
	for(var i = 1; i <= 12; i++){
		b_checker[i].setCoord(0,0);
		w_checker[i].setCoord(0,0);
	}
	}
}






}
function init_gamestate(playerId, opponentId){
   launch_snackbar("11111");
   const board = [
       [1, 0, 1, 0, 1, 0, 1, 0],     // row 0 (white checkers)
       [0, 1, 0, 1, 0, 1, 0, 1],     // row 1 (white checkers)
       [1, 0, 1, 0, 1, 0, 1, 0],     // row 2 (white checkers)
       [0, 0, 0, 0, 0, 0, 0, 0],     // row 3 (empty squares)
       [0, 0, 0, 0, 0, 0, 0, 0],     // row 4 (empty squares)
       [0, -1, 0, -1, 0, -1, 0, -1], // row 5 (black checkers)
       [-1, 0, -1, 0, -1, 0, -1, 0], // row 6 (black checkers)
       [0, -1, 0, -1, 0, -1, 0, -1]  // row 7 (black checkers)
   ];
   launch_snackbar("222222");
   // Flatten the board array into a single-dimensional array
   let flatBoard = board.flat();
   launch_snackbar("333333333");
   // Create the final array with size 70
   let gamestate = new Array(68).fill(0);
   launch_snackbar("88888888888888");
   // Copy the flat board into the first 64 elements
   for (let i = 0; i < 64; i++) {
       gamestate[i] = flatBoard[i];
   }
   launch_snackbar("44444444");
   gamestate[WHITE_ID] = playerId;
   gamestate[BLACK_ID] = opponentId;
   gamestate[TURN_COUNTER] = 0;      //turn counter
   gamestate[PASS_COUNTER] = 0;      //pass counter

   launch_snackbar("Game was created " + gamestate);
   return gamestate;
}

function info(){
	launch_snackbar("You are " + playerColor + ", turn " + gamestate[TURN_COUNTER]);
}