var gameCharacterr_position_x;
var gameCharacterr_position_y;
var floorPosition_y;
var scrollPosition;
var gameCharacterr_worldd_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var cloudss;
var mounts;
var treess;
var canyonss;
var collectabless_treasures;

var gamescore;
var flag_pole;
var livess;
var platformss;

var enemiess;

let snowflakess = []

//Multimedia
var jumpingSound;
var collectabless_treasuresound;
var fallingSound;
var backgroundsound;
var movingsound;



function preload()
{
    soundFormats('mp3','wav');
    //load your sounds here
    jumpingSound = loadSound('jump.wav');
    jumpingSound.setVolume(0.1);

    collectabless_treasuresound = loadSound('collectables_bell.wav');
    collectabless_treasuresound.setVolume(0.8);

    fallingSound = loadSound('falling.wav')
    fallingSound.setVolume(0.1);

    backgroundsound = loadSound('background_music.wav')

    movingsound = loadSound('moving_music.wav')
    movingsound.setVolume(0.7);
}


function setup()
{
    createCanvas(1024, 576);

    floorPosition_y = height * 3/4;    
    livess = 3;

    startGame();
    gamescore = 0;

    if(!backgroundsound.isPlaying())
    {backgroundmusic();}
}


function startGame()
{
    gameCharacterr_position_x = width/2;
    gameCharacterr_position_y = floorPosition_y;

    // Variable to control the background scrolling.
    scrollPosition = 0;

    // Variable to store the real Positionition of the gameChar in the game worldd. Needed for collision detection.

    gameCharacterr_worldd_x = gameCharacterr_position_x - scrollPosition;

    // Boolean variables to control the movement of the game character.

    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;

    // Initialise arrays of scenery objects.

    cloudss = [{Position_x: -300, Position_y: 130, size: 80},
              {Position_x: 95, Position_y: 100 , size: 80},
              {Position_x: 507, Position_y: 130, size: 80},
              {Position_x: 920, Position_y: 85, size: 80},
              {Position_x: 1350, Position_y: 130, size: 80}];

    mounts = [{Position_x: -300, Position_y: 200},
              {Position_x: 100, Position_y: 200},
              {Position_x: 510, Position_y: 200},
              {Position_x: 920, Position_y: 200},
              {Position_x: 1350, Position_y: 200}];

    treess = [-200,100,480,950,1200, 1500, 1800];

    canyonss = [{Position_x: 140, Position_y:433, width: 100, height: 150},
               {Position_x: 550, Position_y:433, width: 100, height: 150},
               {Position_x: 790, Position_y:433, width: 100, height: 150}];

    collectabless_treasures = [{Position_x: 40, Position_y: 417, size: 23, isFound: false},
                    {Position_x: 460, Position_y: 417, size: 23, isFound: false},
                    {Position_x: 1150, Position_y: 360, size: 23, isFound: false},
                    {Position_x: 1300, Position_y: 417, size: 23, isFound: false}];

    gamescore = 0;

    flag_pole = {isReached: false, Position_x: 1650};

    platformss = [];
    platformss.push(createplatformss(200, floorPosition_y-70, 105),
                   createplatformss(750, floorPosition_y-70, 105));

    enemiess = [];

    enemiess.push(new Enemy(50, floorPosition_y-10, 100),
                 new Enemy(650,floorPosition_y-10, 100),
                 new Enemy(900,floorPosition_y-10, 100),
                 new Enemy(1050,floorPosition_y-10, 100));
}

function checkPlayerDie()
{
    if(gameCharacterr_position_y >height)
    {
        livess --;
        if(livess > 0)
        {
            startGame();    
        }
    }
}

s = 200;
function heart(x, y, size) {
    beginShape();
    vertex(x, y);
    bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
    bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
    endShape(CLOSE);
}

function draw()
{
    background(100, 195, 255); // fill the sky blue

    noStroke();
    fill(0,155,0);
    rect(0, floorPosition_y, width, height/4); // draw some green ground

    //Scrolling
    push();
    translate(scrollPosition,0);

    // Draw cloudss. 
    drawcloudss()

    // Draw mounts.
    drawmounts()

    // Draw trees.
    drawTrees()

    //Draw snowflakess
    fill(240);
    t = frameCount/5000;

    // create a random number of snowflakess each frame
    for (let i = 0; i < random(1,5); i++) {
        snowflakess.push(new snowflake()); // append snowflake object
    }

    // loop through snowflakess with a for..of loop
    for (let flake of snowflakess) {
        flake.update(t); // update snowflake Positionition
        flake.display(); // draw snowflake
    }

    //Draw platformss
    for(var i=0; i<platformss.length; i++)
    {
        platformss[i].draw();
    }


    // Draw canyonss.
    for(var i = 0; i <canyonss.length; i++)
    {
        drawCanyon(canyonss, i);
        checkCanyon(canyonss[i], i);
    }
    // Draw collectables_treasure items.
    for(var i = 0; i < collectabless_treasures.length; i++)
    {
        if(collectabless_treasures[i].isFound == false)
        {    
            drawcollectables_treasure(collectabless_treasures[i]);
            checkcollectables_treasure(collectabless_treasures[i]);

        }
    }


    renderflag_pole();

    //enemiess check contact
    for(var i=0; i< enemiess.length; i++)
    {
        enemiess[i].draw();

        var isContact = enemiess[i].checkContact(gameCharacterr_worldd_x, gameCharacterr_position_y)

        if(isContact)
        {
            if(livess > 0)
            {
                livess -= 1;
                startGame()
                break;
            }
        }
    }



    pop();
    // Draw game character.
    drawGameChar();

    fill(255 );
    noStroke();
    text("Coins Collected:", 50, 20);
    for(var i = 0; i < gamescore; i++)
    {

        stroke(255,240,20);
        strokeWeight(4);
        fill(245,195,0);
        ellipse((30 * i)+180, 15, 15, 15);
        noStroke();
        fill(230,250,20);
        textSize(10);
        text('$', (30 * i)+177.5, 10.5, 15, 15);

    }
    textSize(16);

    //Game Over
    if(livess<1)
    {
        //        fill(0);
        //        rect(0,0,width,height);
        fill(220,20,60);
        textAlign(CENTER)
        textSize(40);
        text("Game Over!", width/2, height/2);


    }

    //You win
    if(flag_pole.isReached)
    {
        //        fill(0);
        //        rect(0,0,width,height);
        fill(210,185,30);
        textAlign(CENTER)
        textSize(40);
        text("You Win!", width/2, height/2);



    }
    // Logic to make the game character move or the background scroll.
    if(isLeft)
    {
        if(gameCharacterr_position_x > width * 0.2)
        {
            gameCharacterr_position_x -= 5;
        }
        else
        {
            scrollPosition += 5;
        }
    }

    if(isRight)
    {
        if(gameCharacterr_position_x < width * 0.8)
        {
            gameCharacterr_position_x  += 5;   
        }
        else
        {
            scrollPosition -= 5; // negative for moving against the background
        }
    }


    // Logic to make the game character rise and fall.
    //platform check contact
    if(gameCharacterr_position_y <= floorPosition_y)
    {
        var isContact = false;
        for(var i=0; i<platformss.length; i++)
        {
            if(platformss[i].checkContact(gameCharacterr_worldd_x, gameCharacterr_position_y) == true)
            {
                isContact = true;
                break;
            }
        }
        if(isContact == false)
        {
            gameCharacterr_position_y += 2;
            isFalling = true; 
        }
    }
    else
    {
        isFalling = false;
    }

    if(flag_pole.isReached == false)
    {
        checkflag_pole();
    }

    // Update real Positionition of gameChar for collision detection.
    gameCharacterr_worldd_x = gameCharacterr_position_x - scrollPosition;

    checkPlayerDie();
    drawLifeTokens();


    function drawLifeTokens()
    { 
        for (x = 0; x < width; x += s) {
            for (y = 0; y < height; y += s) {
                for(var i = 0; i < livess; i++)
                {
                    fill(255, 0, 0);
                    heart((30*i)+60, 30, 20);
                }
            }
        }
    }
}

// Key control functions

function keyPressed(){

    if(keyCode == 65)
    {
        console.log("left arrow");
        isLeft = true;
        movingsound.play();
    }
    else if(keyCode == 68)
    {
        console.log("right arrow");
        isRight = true;
        movingsound.play();
    }
    else if(keyCode == 87 &&(gameCharacterr_position_y <= 440 && gameCharacterr_position_y > 430))
    {
        console.log("spacebar")
        gameCharacterr_position_y -= 130;
        isFalling = true;
        jumpingSound.play();
    }
}

function keyReleased()
{
    if(keyCode == 65)
    {
        console.log("left arrow");
        isLeft = false;
    }
    else if(keyCode == 68)
    {
        console.log("right arrow");
        isRight = false;
    }
}


// Function to draw the game character.

function drawGameChar()
{
    //the game character
    if(isLeft && isFalling)
    {
        // jumping-left code
        fill(229,194,154)
        ellipse(gameCharacterr_position_x,gameCharacterr_position_y-55,40,40);
        fill(186,132,135)   
        stroke(229,194,154);
        strokeWeight(7);
        line(gameCharacterr_position_x -7, gameCharacterr_position_y - 3, gameCharacterr_position_x + 7, gameCharacterr_position_y - 23); 
        line(gameCharacterr_position_x - 15 , gameCharacterr_position_y - 3, gameCharacterr_position_x, gameCharacterr_position_y - 23); 
        strokeWeight(0);
        rect(gameCharacterr_position_x - 7, gameCharacterr_position_y - 50, 20, 29, 3);
        strokeWeight(5)
        line(gameCharacterr_position_x +10, gameCharacterr_position_y - 47, gameCharacterr_position_x - 10, gameCharacterr_position_y - 33);
        line(gameCharacterr_position_x -7, gameCharacterr_position_y  - 47, gameCharacterr_position_x -17, gameCharacterr_position_y - 38)
        strokeWeight(1);
        fill(0);
        stroke(0);
        ellipse(gameCharacterr_position_x - 5, gameCharacterr_position_y -59, 3, 6);
    }

    if(isRight && isFalling)
    {
        //jumping-right code
        noStroke()
        fill(229,194,154)
        ellipse(gameCharacterr_position_x,gameCharacterr_position_y-55,40,40);
        fill(186,132,135)
        stroke(229,194,154);
        strokeWeight(7);
        line(gameCharacterr_position_x + 5, gameCharacterr_position_y - 3, gameCharacterr_position_x - 8, gameCharacterr_position_y - 23); 
        line(gameCharacterr_position_x + 10 , gameCharacterr_position_y - 3, gameCharacterr_position_x - 2, gameCharacterr_position_y - 23); 
        strokeWeight(5);
        strokeWeight(0);    
        rect(gameCharacterr_position_x - 15, gameCharacterr_position_y - 50, 20, 29, 3);
        strokeWeight(5)
        line(gameCharacterr_position_x -11, gameCharacterr_position_y - 47, gameCharacterr_position_x + 10, gameCharacterr_position_y - 33);
        line(gameCharacterr_position_x + 5, gameCharacterr_position_y  - 47, gameCharacterr_position_x +  17, gameCharacterr_position_y - 38)
        strokeWeight(1);
        fill(0);
        stroke(0);
        ellipse(gameCharacterr_position_x + 4, gameCharacterr_position_y -59, 3, 6);
    }

    if(isLeft)
    {
        //walking left code
        fill(229,194,154)
        ellipse(gameCharacterr_position_x,gameCharacterr_position_y-55,40,40);
        fill(186,132,135)
        stroke(229,194,154);
        strokeWeight(7);
        line(gameCharacterr_position_x - 12, gameCharacterr_position_y, gameCharacterr_position_x - 8, gameCharacterr_position_y - 23); 
        line(gameCharacterr_position_x + 1 , gameCharacterr_position_y, gameCharacterr_position_x - 2, gameCharacterr_position_y - 23); 
        strokeWeight(0);    
        rect(gameCharacterr_position_x - 15, gameCharacterr_position_y - 50, 20, 29, 3);
        strokeWeight(5);
        line(gameCharacterr_position_x + 2, gameCharacterr_position_y - 47, gameCharacterr_position_x - 20, gameCharacterr_position_y - 28);
        strokeWeight(1);
        fill(0);
        stroke(0);
        ellipse(gameCharacterr_position_x - 13, gameCharacterr_position_y -59, 3, 6);
    }

    if(isRight)
    {
        //walking right code
        fill(229,194,154)
        ellipse(gameCharacterr_position_x,gameCharacterr_position_y-55,40,40);
        fill(186,132,135)
        stroke(229,194,154);
        strokeWeight(7);
        line(gameCharacterr_position_x - 12, gameCharacterr_position_y, gameCharacterr_position_x - 8, gameCharacterr_position_y - 23); 
        line(gameCharacterr_position_x + 5 , gameCharacterr_position_y, gameCharacterr_position_x - 2, gameCharacterr_position_y - 23); 
        strokeWeight(0);    
        rect(gameCharacterr_position_x - 15, gameCharacterr_position_y - 50, 20, 29, 3);
        strokeWeight(5)
        line(gameCharacterr_position_x -10, gameCharacterr_position_y - 47, gameCharacterr_position_x + 10, gameCharacterr_position_y - 28);
        strokeWeight(1);
        fill(0);
        stroke(0);
        ellipse(gameCharacterr_position_x + 4, gameCharacterr_position_y -59, 3, 6);
    }

    if(isFalling || isPlummeting)
    {
        //jumping facing forwards code
        noStroke();
        fill(229,194,154);
        ellipse(gameCharacterr_position_x,gameCharacterr_position_y-55,40,40); 
        stroke(229,194,154);
        strokeWeight(7);
        line(gameCharacterr_position_x -9, gameCharacterr_position_y, gameCharacterr_position_x - 4, gameCharacterr_position_y - 23);
        line(gameCharacterr_position_x +10, gameCharacterr_position_y, gameCharacterr_position_x +5, gameCharacterr_position_y - 23);
        strokeWeight(0);
        fill(186,132,135);
        rect(gameCharacterr_position_x - 12, gameCharacterr_position_y - 50, 25, 27, 3);
        strokeWeight(5);
        line(gameCharacterr_position_x -11, gameCharacterr_position_y - 47, gameCharacterr_position_x - 20, gameCharacterr_position_y - 28);
        line(gameCharacterr_position_x  + 11, gameCharacterr_position_y  - 47, gameCharacterr_position_x +  20, gameCharacterr_position_y - 28);
        strokeWeight(1);
        fill(0);
        stroke(0);
        ellipse(gameCharacterr_position_x -5, gameCharacterr_position_y -59, 3, 6);
        ellipse(gameCharacterr_position_x + 4, gameCharacterr_position_y -59, 3, 6);
    }

    else
    {

        //standing front facing code
        stroke(229,194,154);
        strokeWeight(7);
        line(gameCharacterr_position_x - 4, gameCharacterr_position_y, gameCharacterr_position_x - 4, gameCharacterr_position_y - 23); 
        line(gameCharacterr_position_x + 5, gameCharacterr_position_y, gameCharacterr_position_x +5, gameCharacterr_position_y - 23);
        strokeWeight(0);
        fill(186,132,135);
        rect(gameCharacterr_position_x - 12, gameCharacterr_position_y - 50, 25, 29, 3);
        fill(229,194,154)
        ellipse(gameCharacterr_position_x,gameCharacterr_position_y-55,40,40);
        strokeWeight(5) 
        line(gameCharacterr_position_x -11, gameCharacterr_position_y - 47, gameCharacterr_position_x - 15, gameCharacterr_position_y - 23);
        line(gameCharacterr_position_x  + 11, gameCharacterr_position_y  - 47, gameCharacterr_position_x +  15, gameCharacterr_position_y - 23)
        strokeWeight(1)
        fill(0);
        stroke(0);
        ellipse(gameCharacterr_position_x -5, gameCharacterr_position_y -59, 3, 6);
        ellipse(gameCharacterr_position_x + 4, gameCharacterr_position_y -59, 3, 6);
    }  
}



// Function to draw cloud objects.
function drawcloudss()
{
    for(var i = 0; i < cloudss.length; i++)
    {
        fill(255,255,255);
        ellipse(cloudss[i].Position_x, cloudss[i].Position_y, cloudss[i].size);
        ellipse(cloudss[i].Position_x-30, cloudss[i].Position_y, cloudss[i].size-20);
        ellipse(cloudss[i].Position_x-60, cloudss[i].Position_y, cloudss[i].size-50);
        ellipse(cloudss[i].Position_x+30, cloudss[i].Position_y, cloudss[i].size-20);
        ellipse(cloudss[i].Position_x+60, cloudss[i].Position_y, cloudss[i].size-50);
    }
}

// Function to draw mounts objects.
function drawmounts()
{
    for(i =0; i < mounts.length; i++)
    {
        fill(119,136,153);
        triangle(mounts[i].Position_x, mounts[i].Position_y, 
                 mounts[i].Position_x-175, mounts[i].Position_y+233,
                 mounts[i].Position_x+175, mounts[i].Position_y+233); 

        fill(255);
        triangle(mounts[i].Position_x, mounts[i].Position_y,
                 mounts[i].Position_x-50, mounts[i].Position_y+65,
                 mounts[i].Position_x+50, mounts[i].Position_y+65);
    }
}

// Function to draw trees objects.
function drawTrees()
{
    for(i=0; i<treess.length; i++)
    {
        fill(150,120,60);
        rect(treess[i], floorPosition_y-70, 30, 70);

        //branch 
        fill(34,139,34);
        triangle(treess[i]+15, floorPosition_y-140,
                 treess[i]-20,floorPosition_y-90,
                 treess[i]+50, floorPosition_y-90);
        triangle(treess[i]+15,floorPosition_y-130,
                 treess[i]-20,floorPosition_y-60,
                 treess[i]+50,floorPosition_y-60);
    }
}


// Function to draw canyon objects.

function drawCanyon(t_canyon, k)
{
    //canyon 1
    if(k==0)
    {
        fill(139,89,49);
        rect(t_canyon[k].Position_x,433, t_canyon[k].width,canyonss[k].height);
        fill(0,255,255);
        quad(t_canyon[k].Position_x+10, 493, t_canyon[k].Position_x+10, 575,t_canyon[k].Position_x+90, 575, t_canyon[k].Position_x+90, 493);
        fill(119,136,153)
        quad(t_canyon[k].Position_x+10, 433, t_canyon[k].Position_x+10, 493,t_canyon[k].Position_x+90, 493, t_canyon[k].Position_x+90, 433);
    }

    //canyon 2
    else if(k==1)
    {
        fill(139,89,49);
        rect(t_canyon[k].Position_x,433,t_canyon[k].width,canyonss[k].height);
        fill(169,169,169);
        triangle(t_canyon[k].Position_x,443,t_canyon[k].Position_x,463,t_canyon[k].Position_x+30,453);
        triangle(t_canyon[k].Position_x,493,t_canyon[k].Position_x,513,t_canyon[k].Position_x+30,503);
        triangle(t_canyon[k].Position_x,543,t_canyon[k].Position_x,563,t_canyon[k].Position_x+30,553);
        triangle(t_canyon[k].Position_x+100,443,t_canyon[k].Position_x+100,463,t_canyon[k].Position_x+70,453);
        triangle(t_canyon[k].Position_x+100,493,t_canyon[k].Position_x+100,513,t_canyon[k].Position_x+70,503);
        triangle(t_canyon[k].Position_x+100,543,t_canyon[k].Position_x+100,563,t_canyon[k].Position_x+70,553);
    }

    //canyon 3
    if (k == 0) {

        var newPositionX = t_canyon[k].Position_x + 650;

        fill(139, 89, 49);
        rect(newPositionX, 433, t_canyon[k].width, canyonss[k].height);
        fill(0, 255, 255);
        quad(newPositionX + 10, 493, newPositionX + 10, 575, newPositionX + 90, 575, newPositionX + 90, 493);
        fill(119, 136, 153);
        quad(newPositionX + 10, 433, newPositionX + 10, 493, newPositionX + 90, 493, newPositionX + 90, 433);
    }

}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if((gameCharacterr_worldd_x> t_canyon.Position_x ) && (gameCharacterr_worldd_x < t_canyon.Position_x  + t_canyon.width && gameCharacterr_position_y >= 430))
    {
        isPlummeting = true;
        if(isPlummeting == true)
        {
            gameCharacterr_position_y += 20;
        }
        fallingSound.play();
        if(livess < 0)
        {
            fallingSound.pause();
        }

    }
    else if(gameCharacterr_position_y < t_canyon.Position_y)
    {
        isPlummeting = false;
    }
}

// Function to draw collectables_treasure objects.

function drawcollectables_treasure(t_collectables_treasure)
{
    stroke(255,240,20);
    strokeWeight(4);
    fill(245,195,0);
    ellipse(t_collectables_treasure.Position_x,t_collectables_treasure.Position_y,t_collectables_treasure.size);
    noStroke();
    fill(230,250,20);
    textAlign(CENTER)
    textSize(15);
    text('$', t_collectables_treasure.Position_x-3.5, t_collectables_treasure.Position_y+4.5, t_collectables_treasure.size/2);
}

// Function to check character has collected an item.

function checkcollectables_treasure(t_collectables_treasure)
{
    if(dist(gameCharacterr_worldd_x, gameCharacterr_position_y,t_collectables_treasure.Position_x,t_collectables_treasure.Position_y)<20){
        t_collectables_treasure.isFound = true;
        gamescore += 1;
        collectabless_treasuresound.play();
    }
}

function renderflag_pole()
{
    push();
    strokeWeight(5);
    stroke(200);
    line(flag_pole.Position_x, floorPosition_y-2, flag_pole.Position_x, floorPosition_y-200);
    noStroke();
    if(flag_pole.isReached)
    {
        triangle(flag_pole.Position_x+3, floorPosition_y-150, flag_pole.Position_x+3, floorPosition_y-201, flag_pole.Position_x+30, floorPosition_y-175);
    }
    else
    {
        triangle(flag_pole.Position_x+3, floorPosition_y, flag_pole.Position_x+3, floorPosition_y-50, flag_pole.Position_x+30, floorPosition_y-25);
    }
    pop();
}

function checkflag_pole()
{
    var d = abs(gameCharacterr_worldd_x - flag_pole.Position_x);

    if(d < 15)
    {
        flag_pole.isReached = true;        
    }


} 

// Function to create static platformss
function createplatformss(x, y, length) {
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function () {
            fill(150, 54, 34);
            rect(this.x, this.y, this.length, 20);
            fill(255);
            ellipse(this.x + 15, this.y, 30, 10);
            ellipse(this.x + 40, this.y, 30, 10);
            ellipse(this.x + 65, this.y, 30, 10);
            ellipse(this.x + 90, this.y, 30, 10);
        },
        checkContact: function (gc_x, gc_y) {
            if (gc_x > this.x && gc_x < this.x + this.length) {
                var d = this.y - gc_y;
                if (d >= 0 && d < 5) {
                    return true;
                }
            }
            return false;
        },
    };
    return p;
}


function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;

    this.currentX = x;
    this.inc = 1;

    this.update = function()
    {
        this.currentX += this.inc;

        if(this.currentX >= this.x + this.range)
        {
            this.inc =-1;
        }
        else if(this.currentX < this.x)
        {
            this.inc = 1;
        }
    }
    this.draw = function()
    {
        this.update();

        fill(80);  
        push();
        translate(this.currentX,this.y);
        rotate(radians(frameCount));
        star(0, 0, 10, 20, 11);
        pop();
        fill(255,0,0);
        ellipse(this.currentX, this.y, 16, 16);

    }

    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y)

        if(d < 30)
        {
            return true;
        }
        return false;
    }
}


function snowflake() {
    // initialize coordinates
    this.PositionX = random(-100, 0);
    this.PositionY = random(-100, 0);
    this.initialangle = random(0, 2 * PI);
    this.size = random(2, 5);


    // radius of snowflake spiral
    // chosen so the snowflakess are uniformly spread out in area
    this.radius = sqrt(random(pow(width / 2, 2)));
    this.update = function(time) {
        // x Positionition follows a circle
        let w = 3; // angular speed
        angleMode(RADIANS);
        let angle = w * time + this.initialangle;
        this.PositionX = width / 2 + this.radius * sin(angle)*4;

        // different size snowflakess fall at slightly different y speeds
        this.PositionY += pow(this.size, 0.5);

        // delete snowflake if past end of screen
        if (this.PositionY > height) {
            let index = snowflakess.indexOf(this);
            snowflakess.splice(index, 1);
        }
    };

    this.display = function() {
        ellipse(this.PositionX, this.PositionY, this.size);

    };
}

function star(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radius2;
        let sy = y + sin(a) * radius2;
        vertex(sx, sy);
        sx = x + cos(a + halfAngle) * radius1;
        sy = y + sin(a + halfAngle) * radius1;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}

function backgroundmusic()
{
    backgroundsound.play();
    backgroundsound.loop();
    backgroundsound.setVolume(0.01);
}
