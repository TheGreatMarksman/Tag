var CHAR_DIAMETER = 20;
var SCREEN_WIDTH = 1000;
var SCREEN_HEIGHT = 500;
var MOVE_DISTANCE = 10;

var start = false;
var game = document.getElementById("game");
var character = document.getElementById("character");
var opponent = document.getElementById("opponent");
var busy = false;
const walls = [];
var sightLine;
var charLeft = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
var charTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
var enemLeft = parseInt(window.getComputedStyle(opponent).getPropertyValue("left"));
var enemTop = parseInt(window.getComputedStyle(opponent).getPropertyValue("top"));
var moveTimer;
var enemTimer;
var enemBlocked = false;
var enemMoveCounter = 0;
var prevEnemMoveCounter = 0;
var time = 0;
const wallHuntInfo = {
    stepNumber: 0,
    originalX: 0,
    originalY: 0, 
    wallLeft: 0,
    wallTop: 0,
    wallWidth: 0,
    wallHeight: 0,
    wallsCircled: [],
    targetNumber: 0
    //wallsAvailable: []
};


alert("Start the game by pressing any button. Use WASD to move. Try to avoid the blue ball.");
function startGame(){
    makeWalls();
    makeSightLine();
    enemTimer = setInterval(enemFindChar, 60);
}

function endGame(){
    clearInterval(enemTimer);
    character.remove();
    alert("Game Over");
}

document.addEventListener("keydown", event => {
    if(start == false){
        start = true;
        startGame();
    }
    if(event.key === "a"){keyDown("left");}
    if(event.key === "d"){keyDown("right");}
    if(event.key === "w"){keyDown("up");}
    if(event.key === "s"){keyDown("down");}
});

document.addEventListener("keyup", event => {
    if(event.key === "a"){
        clearInterval(moveTimer);
        busy = false;
    }else if(event.key === "d"){
        clearInterval(moveTimer);
        busy = false;
    }else if(event.key === "w"){
        clearInterval(moveTimer);
        busy = false;
    }else if(event.key === "s"){
        clearInterval(moveTimer);
        busy = false;
    }
});



function keyDown(direction){
    if(direction == "left" && busy == false){
        moveTimer = setInterval(moveCharLeft, 40);
        busy = true;
    }else if(direction == "right" && busy == false){
        moveTimer = setInterval(moveCharRight, 40);
        busy = true;
    }else if(direction == "up" && busy == false){
        moveTimer = setInterval(moveCharUp, 40);
        busy = true;
    }else if(direction == "down" && busy == false){
        moveTimer = setInterval(moveCharDown, 40);
        busy = true;
    }
}

function moveCharLeft(){
    charLeft -= MOVE_DISTANCE;
    if(charLeft > -MOVE_DISTANCE && !blocked(charLeft, charTop)){
        character.style.left = charLeft + "px";
    }else{ charLeft += MOVE_DISTANCE; }
}

function moveCharRight(){
    charLeft += MOVE_DISTANCE;
    if(charLeft+CHAR_DIAMETER < SCREEN_WIDTH+MOVE_DISTANCE && !blocked(charLeft, charTop)){
        character.style.left = charLeft + "px";
    }else{ charLeft -= MOVE_DISTANCE; }
}

function moveCharUp(){
    charTop -= MOVE_DISTANCE;
    if(charTop > -10 && !blocked(charLeft, charTop)){
        character.style.top = charTop + "px";
    }else { charTop += MOVE_DISTANCE;}
}

function moveCharDown(){
    charTop += MOVE_DISTANCE;
    if(charTop+CHAR_DIAMETER < SCREEN_HEIGHT+MOVE_DISTANCE && !blocked(charLeft, charTop)){
        character.style.top = charTop + "px";
    }else{ charTop -= MOVE_DISTANCE; }
}

function makeWalls(){
    for(var i = 0; i < 4; i++){
        var block = document.createElement("div");
        block.setAttribute("class", "wall");
        block.setAttribute("id", "wall");
        game.appendChild(block);
        walls.push(block);
        //console.log(walls[i]);
        if(i == 0){
            block.style.width = 250 + "px";
            block.style.height = 60 + "px";
            block.style.left = SCREEN_WIDTH/2 - 130 + "px";
            block.style.top =  SCREEN_HEIGHT/2 - 30 + "px";
        }else if(i == 1){
            block.style.width = 150 + "px";
            block.style.height = 60 + "px";
            block.style.left = 50 + "px";
            block.style.top = 50 + "px";
        }else if(i == 2){
            block.style.width = 60 + "px";
            block.style.height = 150 + "px";
            block.style.left = 800 + "px";
            block.style.top = 50 + "px";
            //walls[3].style.marginTop = -150 + "px";
        }else if(i == 3){
            block.style.width = 60 + "px";
            block.style.height = 60 + "px";
            block.style.left = 820 + "px";
            block.style.top = 400  + "px";
            block.style.marginTop = -150 + "px";
        }
    }
}

function blocked(left, top){
    for(var i = 0; i < walls.length; i++){
        var wallLeft = pxToInt(walls[i].style.left);
        var wallTop = pxToInt(walls[i].style.top);
        var wallWidth = pxToInt(walls[i].style.width);
        var wallHeight = pxToInt(walls[i].style.height);

        var leftOfRightWall = (left <= wallLeft+wallWidth-10);
        var rightOfLeftWall = (left+CHAR_DIAMETER >= wallLeft+10);
        var belowTopWall = (top <= wallTop+wallHeight-10);
        var aboveBottomWall = (top+CHAR_DIAMETER >= wallTop+10);

        if(leftOfRightWall && rightOfLeftWall && belowTopWall && aboveBottomWall){
            return true;
            
        }
    }
    return false;
}

function pxToInt(numberString){
    return numberString.substr(0, numberString.length-2) * 1;
}

function moveEnemLeft(){
    enemLeft -= MOVE_DISTANCE;
    if(enemLeft > -MOVE_DISTANCE && !blocked(enemLeft, enemTop)){
        opponent.style.left = enemLeft + "px";
        enemMoveCounter ++;
    }else{
        enemLeft += MOVE_DISTANCE;
        enemBlocked = true;
    }
}

function moveEnemRight(){
    enemLeft += MOVE_DISTANCE;
    if(enemLeft+CHAR_DIAMETER < SCREEN_WIDTH+MOVE_DISTANCE && !blocked(enemLeft, enemTop)){
        opponent.style.left = enemLeft + "px";
        enemMoveCounter ++;
    }else{
        enemLeft -= MOVE_DISTANCE;
        enemBlocked = true;
    }
}

function moveEnemUp(){
    enemTop -= MOVE_DISTANCE;
    if(enemTop > -MOVE_DISTANCE && !blocked(enemLeft, enemTop)){
        opponent.style.top = enemTop + "px";
        enemMoveCounter ++;
    }else{
        enemTop += MOVE_DISTANCE;
        enemBlocked = true;
    }
}

function moveEnemDown(){
    enemTop += 10;
    if(enemTop+CHAR_DIAMETER < SCREEN_HEIGHT+MOVE_DISTANCE && !blocked(enemLeft, enemTop)){
        opponent.style.top = enemTop + "px";
        enemMoveCounter ++;
    }else{
        enemTop -= MOVE_DISTANCE;
        enemBlocked = true;
    }
}

function enemInFront(){
    if(charLeft + CHAR_DIAMETER < enemLeft){
        return true;
    }
    return false;
}

function enemBehind(){
    if(charLeft > enemLeft + CHAR_DIAMETER){
        return true;
    }
    return false;
}

function enemBelow(){
    if(charTop < enemTop){
        return true;
    }
    return false;
}

function enemAbove(){
    if(charTop > enemTop){
        return true;
    }
    return false;
}

function enemHittingChar(){
    var hittingLeftSide = enemLeft+CHAR_DIAMETER >= charLeft;
    var hittingRightSide = enemLeft <= charLeft+CHAR_DIAMETER;
    var hittingTopSide = enemTop+CHAR_DIAMETER >= charTop;
    var hittingBottomSide = enemTop <= charTop+CHAR_DIAMETER;
    if(hittingLeftSide && hittingRightSide && hittingTopSide && hittingBottomSide) return true;
}

function enemFindChar(){
    recordEnemMove();
    if(enemHittingChar()) endGame();
    if(charVisible()){
        //console.log("charVisible");
        if(wallHuntInfo.stepNumber != 0) wallHuntInfo.stepNumber = 0;
        if(enemInFront()) moveEnemLeft();
        if(enemBehind()) moveEnemRight();
        if(enemBelow()) moveEnemUp();
        if(enemAbove()) moveEnemDown();
    }else{
        //wallHunt();
        hunt();
    }
    if(enemMoveCounter == prevEnemMoveCounter){
        hunt();
    }
}

function recordEnemMove(){
    time ++;
    if(time >= 10){
        prevEnemMoveCounter = enemMoveCounter;
        if(enemMoveCounter > 100){
            enemMoveCounter = 0;
            prevEnemMoveCounter = 0;
        }
        time = 0;
    }
}

function charVisible(){
    var oppositeSide = charTop-enemTop;
    var adjacentSide = charLeft-enemLeft;
    var hypotenuse = Math.sqrt(Math.pow(oppositeSide, 2) + Math.pow(adjacentSide, 2));
    sightLine.style.height = hypotenuse + "px";
    var radiansAngle = Math.atan(oppositeSide/adjacentSide);
    var degreesAngle = radiansAngle * (180/Math.PI);
    if(charLeft+CHAR_DIAMETER/2 > enemLeft+CHAR_DIAMETER/2) degreesAngle = (90) - degreesAngle;
    if(charLeft+CHAR_DIAMETER/2 < enemLeft+CHAR_DIAMETER/2) degreesAngle = (270) - degreesAngle;
    if(charLeft+CHAR_DIAMETER/2 == enemLeft+CHAR_DIAMETER/2){
        if(enemBelow()) degreesAngle = 180;
        if(enemAbove()) degreesAngle = 0;
    }
    document.querySelector(".sightLine").style.transform = 'rotate(' + -degreesAngle + 'deg)';
    sightLine.style.top = (enemTop) + (CHAR_DIAMETER/2) + "px";
    sightLine.style.left = (enemLeft) + (CHAR_DIAMETER/2) - (0) + "px";
    if(!sightLineBlocked(radiansAngle)){
        sightLine.style.backgroundColor = "green";
        return true;
    }
    sightLine.style.backgroundColor = "red";
}

function makeSightLine(){
    sightLine = document.createElement("div");
    sightLine.setAttribute("class", "sightLine");
    sightLine.setAttribute("id", "sightLine");
    game.appendChild(sightLine);
}

function sightLineBlocked(angle){
    var x = 0;
    var y = 0;
    // left right top down
    for(var i = 0; i < walls.length; i++){
        var left = pxToInt(walls[i].style.left);
        var top = pxToInt(walls[i].style.top);
        var width = pxToInt(walls[i].style.width);
        var height = pxToInt(walls[i].style.height);
        for(var j = 0; j < 4; j++){
            if(j == 0){
                x = left - (enemLeft + CHAR_DIAMETER/2);
                if(x > 0 && charLeft + CHAR_DIAMETER/2 > left && left > enemLeft + CHAR_DIAMETER/2){
                    y = x * Math.tan(angle);
                    y += enemTop + CHAR_DIAMETER/2;
                    if(y >= top && y <= top+height){
                        return true;
                    }
                }
            }else if(j == 1){
                x = (left + width) - (enemLeft + CHAR_DIAMETER/2);
                if(x < 0 && charLeft + CHAR_DIAMETER/2 < left + width && left + width < enemLeft + CHAR_DIAMETER/2){
                    y = x * Math.tan(angle);
                    y += enemTop + CHAR_DIAMETER/2;
                    if(y >= top && y <= top+height){
                        return true;
                    }
                }
            }else if(j == 2){
                y = top - (enemTop + CHAR_DIAMETER/2);
                if(y > 0 && charTop + CHAR_DIAMETER/2 > top && top > enemTop + CHAR_DIAMETER/2){
                    x = y / Math.tan(angle);
                    x += enemLeft + CHAR_DIAMETER/2;
                    if(x >= left && x <= left+width){
                        return true;
                    }
                }
            } else if(j == 3){
                y = (top+height) - (enemTop + CHAR_DIAMETER/2);
                if(y < 0 && charTop + CHAR_DIAMETER/2 <top + height && top + height < enemTop + CHAR_DIAMETER/2){
                    x = y / Math.tan(angle);
                    x += enemLeft + CHAR_DIAMETER/2;
                    if(x >= left && x <= left+width){
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function hunt(){
    console.log("hunting");
    if(blocked(enemLeft-10, enemTop)){
        moveEnemDown();
    }else if(blocked(enemLeft+10, enemTop)){
        moveEnemUp();
    }else if(blocked(enemLeft, enemTop-10)){
        moveEnemLeft();
    }else if(blocked(enemLeft, enemTop+10)){
        moveEnemRight();
    }else{
        if(enemLeft+CHAR_DIAMETER/2 < SCREEN_WIDTH/2) moveEnemUp();
        if(enemLeft+CHAR_DIAMETER/2 > SCREEN_WIDTH/2) moveEnemDown();
        if(enemTop+CHAR_DIAMETER/2 < SCREEN_HEIGHT/2) moveEnemRight();
        if(enemTop+CHAR_DIAMETER/2 > SCREEN_HEIGHT/2) moveEnemLeft();
        
        /*
        if(enemLeft+CHAR_DIAMETER/2 <= SCREEN_WIDTH/2 && enemTop+CHAR_DIAMETER/2 <= SCREEN_HEIGHT/2){
            moveEnemRight();
        */
    }
}

function circleScreen(){
    if(enemLeft != 0 && enemLeft+CHAR_DIAMETER != SCREEN_WIDTH && enemTop != 0 && enemTop+CHAR_DIAMETER != SCREEN_HEIGHT){
        if(enemLeft+CHAR_DIAMETER/2 < 500) moveEnemLeft();
        if(enemLeft+CHAR_DIAMETER/2 > 500) moveEnemRight();
        if(enemTop+CHAR_DIAMETER/2 < 250) moveEnemTop();
        if(enemTop+CHAR_DIAMETER/2 > 250) moveEnemDown();
    }else{
        if(enemLeft == 0) moveEnemUp();
        if(enemLeft+CHAR_DIAMETER == SCREEN_WIDTH) moveEnemDown();
        if(enemTop == 0) moveEnemRight();
        if(enemTop+CHAR_DIAMETER == SCREEN_HEIGHT) moveEnemLeft();
    }
}

function wallHunt(){
    if(wallHuntInfo.stepNumber == 0){
        console.log(0);
        const wallsAvailable = [];
        for(var i = 0; i < walls.length; i++){
            wallsAvailable.push(i);
        }
        for(var i = 0; i < wallHuntInfo.wallsCircled.length; i++){
            for(var j = 0; j < wallsAvailable.length; j++){
                if(wallHuntInfo.wallsCircled[i] == wallsAvailable[j]) wallsAvailable.splice(j, 1);
            }
        }
        //console.log(wallsAvailable);
        //console.log(wallHuntInfo.wallsCircled);
        wallHuntInfo.targetNumber = findClosestWall("enemy", wallsAvailable);
        console.log("Target: " + wallHuntInfo.targetNumber);

        wallHuntInfo.wallLeft = pxToInt(walls[wallHuntInfo.targetNumber].style.left);
        wallHuntInfo.wallTop = pxToInt(walls[wallHuntInfo.targetNumber].style.top);
        wallHuntInfo.wallWidth = pxToInt(walls[wallHuntInfo.targetNumber].style.width);
        wallHuntInfo.wallHeight = pxToInt(walls[wallHuntInfo.targetNumber].style.height);
        wallHuntInfo.stepNumber ++;

    }else if(wallHuntInfo.stepNumber == 1){
        console.log(1);
        var leftOfWall = enemLeft+CHAR_DIAMETER < wallHuntInfo.wallLeft;
        var rightOfWall = enemLeft > wallHuntInfo.wallLeft + wallHuntInfo.wallWidth;
        var aboveWall = enemTop+CHAR_DIAMETER < wallHuntInfo.wallTop;
        var belowWall = enemTop > wallHuntInfo.wallTop + wallHuntInfo.wallHeight;
        //var aboveWall = enemTop < wallHuntInfo.wallTop;
        //var belowWall = enemTop > wallHuntInfo.wallTop;
        const wallNumbers = [];
        for(var i = 0; i < walls.length; i++){
            wallNumbers.push(i);
            //console.log("wallNumbers: " + i);
        }
        if(leftOfWall && !blocked(enemLeft+10, enemTop)){ 
            moveEnemRight();
            console.log("right in stage 1");
        }else if(rightOfWall && !blocked(enemLeft-10, enemTop)){
            moveEnemLeft();
            console.log("left in stage 1");
        }else if(aboveWall && !blocked(enemLeft, enemTop-10)){
            moveEnemDown();
        }else if(belowWall && !blocked(enemLeft, enemTop+10)){
            moveEnemUp();
        }else if(wallHuntInfo.targetNumber == findClosestWall("enemy", wallNumbers)){ // blocked
            console.log("Closest: " +  findClosestWall("enemy", wallNumbers));
            wallHuntInfo.originalX = enemLeft+CHAR_DIAMETER/2;
            wallHuntInfo.originalY = enemTop+CHAR_DIAMETER/2;
            wallHuntInfo.stepNumber ++;
        }
    }else if(wallHuntInfo.stepNumber == 2){
        console.log(2);
        if(blocked(enemLeft-10, enemTop)){
            moveEnemDown();
        }else if(blocked(enemLeft+10, enemTop)){
            moveEnemUp();
        }else if(blocked(enemLeft, enemTop-10)){
            moveEnemLeft();
            console.log("first left in stage 2");
        }else if(blocked(enemLeft, enemTop+10)){
            moveEnemRight();
        }else{
            var leftCorner = enemLeft+CHAR_DIAMETER <= wallHuntInfo.wallLeft;
            var rightCorner = enemLeft >= wallHuntInfo.wallLeft+wallHuntInfo.wallWidth;
            var topCorner = enemTop+CHAR_DIAMETER <= wallHuntInfo.wallTop;
            var bottomCorner = enemTop >= wallHuntInfo.wallTop+wallHuntInfo.wallHeight;
            if(leftCorner && topCorner){
                moveEnemRight();
            }else if(rightCorner && topCorner){
                moveEnemDown();
            }else if(rightCorner && bottomCorner){
                moveEnemLeft();
                console.log("second left in stage 2");
            }else if(leftCorner && bottomCorner){
                moveEnemUp();
            }
        }
        //console.log("walls: " + walls.length);
        if(enemLeft+CHAR_DIAMETER/2 == wallHuntInfo.originalX && enemTop+CHAR_DIAMETER/2 == wallHuntInfo.originalY){
            wallHuntInfo.stepNumber = 0;
            wallHuntInfo.wallLeft = 0;
            wallHuntInfo.wallTop = 0;
            wallHuntInfo.wallWidth = 0;
            wallHuntInfo.wallHeight = 0;
            wallHuntInfo.originalX = 0;
            wallHuntInfo.originalY = 0;

            wallHuntInfo.wallsCircled.push(wallHuntInfo.targetNumber);
            if(wallHuntInfo.wallsCircled.length == walls.length){
                wallHuntInfo.wallsCircled = [];
                console.log("Impossible!");
            }
            /*
            wallHuntInfo.wallsCircled.push(wallHuntInfo.target);
            if(wallHuntInfo.wallsCircled.length == walls.length){
                wallHuntInfo.wallsCircled = [];
                console.log("Impossible!");
            }
            */
            console.log("finished");
        }
    }
}

function findClosestWall(guy, wallsAvailable){
    var content = 0;
    var wallNumber = -1;
    var prevDistance = 99999;
    for(var i = 0; i < wallsAvailable.length; i++){
        content = wallsAvailable[i];
        var distance = 0;
        var wallLeft = pxToInt(walls[content].style.left);
        var wallTop = pxToInt(walls[content].style.top);
        var wallWidth = pxToInt(walls[content].style.width);
        var wallHeight = pxToInt(walls[content].style.height);
        var xDistance = (enemLeft+CHAR_DIAMETER/2) - (wallLeft+wallWidth/2);
        var yDistance = (enemTop+CHAR_DIAMETER/2) - (wallTop+wallHeight/2);
        distance = Math.sqrt(xDistance*xDistance + yDistance*yDistance);
        //console.log(distance);
        if(distance < prevDistance){
            wallNumber = content;
            prevDistance = distance;
        }
    }
    //console.log("wallNumber: " + wallNumber);
    return wallNumber;
}


