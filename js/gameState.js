var gameState = {
    petName : "Fluffy",
    poopCollection:"",
    goldenPoopCollection:"",
    sickPoopCollection:"",
    cleanedPoops:0,
    madePoops:0,
    goldenPoopsDropCounter:1,
    goldenPoopWaitCounter:0,
    highScore:0,
    thePet:""
};

var gameDefaults = {
    poopBufferSize:50,
    goldenPoopBufferSize:10,
    sickPoopBufferSize:10,
    statsYOffset:25,
    statsXOffset:115,
    gameWidth:940, 
    gameHeight:640,
    offscreenX:-100,
    offscreenY:-100,
    poopDropXOffset:100,
    poopDropYOffset:30,
    minBonus:25,
    maxBonus:50,
    goldenPoopDropMin:5,
    goldenPoopDropMax:10,
    decreaseSeconds:3.5
};
