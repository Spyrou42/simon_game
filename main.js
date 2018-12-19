
//Options
var sounds = [0,1,2,3,4,5,6,7,8,9,10,11]; //all the sound. if you want less or more don't forget to add here.
var sequenceLength = 10;
var sequenceSpeedInterval = 600;


//Game vars
var gameFinished = false;
var gameStarted = false;
var playerCanPlay = false;

//Get all buttons
var bttns = $(".simon-button");

//Create a new empty sequence with x random sounds
var rdmSequence = [];
var rdmSounds = [];

//Create trackers
var sequenceIndex = 0; //track the last sound added
var playerSequence = []; //track the player sequences



//Wait for a button to be clicked to trigger the game
bttns.click(onButtonClick);
$(document).keypress(onKeyboardPress);


function displayAllSequence(from,to,sequence)
{
     //recursive function to display all the sequence
    if(from < to) //from < sequence.length-1
    {

        highlightButton(sequence[from]);
        AnimateButton(sequence[from]);
        SoundButton(sequence[from]);

        from++;
        setTimeout(function(){
            displayAllSequence(from,to,sequence);
        },sequenceSpeedInterval);
        
    }
    else{
        setTimeout(function(){
            playerCanPlay = true;
        },1000);
    }
   
}

function playerAction(index){
    if(gameStarted && !gameFinished)
    {
        if(playerCanPlay)
        {
            onPlay(index);
        }
    }else{
        displayReady();
    }
}
function onButtonClick(event)
{
    console.log(event.currentTarget.getAttribute("data-btn-index"));
    playerAction(event.currentTarget.getAttribute("data-btn-index")); 
}

function onKeyboardPress(event)
{
    //arrows seems to be disabled on the page
    switch(event.key)
    {
        case "ArrowLeft":
            playerAction(0);
        break;
        case "q":
            playerAction(0);
        break;
        case "4":
            playerAction(0);
        break;
        case "z":
            playerAction(2);
        break;
        case "ArrowUp":
            playerAction(2);
        break;
        case "8":
            playerAction(2);
        break;
        case "d":
            playerAction(1);
        break;
        case "ArrowRight":
            playerAction(1);
        break;
        case "6":
            playerAction(1);
        break;
    }
}

function highlightButton(index)
{
    //remove
    $(`[data-btn-index=${index}] > polygon`).removeClass("simon-highlight-" + index);

    //add
    $(`[data-btn-index=${index}] > polygon`).addClass("simon-highlight-" + index);

    //remove after 0.5s
    setTimeout(
        function(){   
            $(`[data-btn-index=${index}] > polygon`).removeClass("simon-highlight-" + index);
        },
        500
    );

}
function AnimateButton(index)
{
    //remove
    $(`[data-btn-index=${index}] > .effect`).removeClass("pulse");

    //add
    $(`[data-btn-index=${index}] > .effect`).addClass("pulse");

    //remove after 0.5s
    setTimeout(
        function(){   
            $(`[data-btn-index=${index}] > .effect`).removeClass("pulse");
        },
        500
    );
}

function SoundButton(index)
{
    audio = new Audio(getSoundFromFolder(index));
    audio.play();
}

function onPlay(bttnIndex)
{   
    AnimateButton(bttnIndex);
    SoundButton(bttnIndex);

    playerSequence.push(bttnIndex);

    //We compare that the last sound pressed is equal to our rdn sequence
    if(playerSequence[playerSequence.length-1] == rdmSequence[playerSequence.length-1])
    {
        //Correct
        //Now the player has to play all sounds to the actual sequeneIndex
        if((playerSequence.length -1) == sequenceIndex)
        {
            //The player played all the currentSequence
            //We go to the next index
            sequenceIndex++;
            //We clean the player sequence, the player has to replay it
            playerSequence = [];
            //Did the player finish the sequence ?
            if(sequenceIndex < rdmSequence.length)
            {
                //No we continue
                setTimeout(() => {
                    displayAllSequence(0,sequenceIndex+1,rdmSequence); 
                }, 2000);
                
            }
            else{
                //Yes, he win
                win();
            }
            
        }
        else{
            //we wait another input
        }
    }
    else{
        //Wrong
        lose();
    }
}

function startGame()
{
    $(".final").addClass("hide");
    rdmSequence = getFullSequence(sequenceLength,bttns.length);
    rdmSounds = getRdmSounds(bttns.length);
    playerSequence = [];

    gameStarted = true;
    gameFinished = false;

    sequenceIndex = 0;
    displayAllSequence(0,sequenceIndex+1,rdmSequence);

    // console.log(rdmSequence);
    // console.log(rdmSounds);
}

function getFullSequence(num,choiceQtity)
{
    var sequence = [];
    for(var i = 0; i < num; i++)
    {
        sequence.push(getRandom(choiceQtity));
    }

    return sequence;
}

function getRandom(max)
{
    return Math.floor(Math.random() * max);
}

function getRdmSounds(qtity)
{
    var presentSounds = Array.from(sounds); 
    var soundsChoosen = [];
    
    for(var i = 0; i < qtity; i++)
    {
        var idSelected = getRandom(presentSounds.length);
        soundsChoosen.push(presentSounds[idSelected]);
        removeFromArray(presentSounds,idSelected);
        console.log(presentSounds);
    }

    return soundsChoosen;
}

function getSoundFromFolder(id)
{

    return "sounds/sound"+ rdmSounds[id] +".wav";
}

function displayReady()
{
    $(".final").html( "<h1><span class='final-1'>Re</span><span class='final-2'>a</span><span class='final-3'>dy ?</span></h1>");
    $(".final").removeClass("hide");

    setTimeout(
        function(){
            $(".final").addClass("hide");
            startGame();
        },
        3000
    );
}

function win()
{
    console.log("WIN");
    $(".final").html( "<h1><span class='final-1'>Con</span><span class='final-2'>gra</span><span class='final-3'>t's</span></h1>");
    $(".final").removeClass("hide");
    gameFinished = true;
}

function lose()
{
    
    $(".final").html( "<h1><span class='final-1'>So</span><span class='final-2'>rr</span><span class='final-3'>y !</span></h1>");
    $(".final").removeClass("hide");
    gameFinished = true;
}

function removeFromArray(array, element) {
    const index = array.indexOf(element);
    array.splice(index, 1);
  }


