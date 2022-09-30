function initUI(gameData)
{
    if(gameData.state == 'victory'){
        //document.title = 'Victory';
        setSmileyState('happy');
    }
    else{
        document.title = 'Minesweeper';
        setSmileyState('neutral');
    }
    
    setFlagCounter(gameData.flags.toString());
    setTimer(gameData.timer);

    if(gameData.cheating){
        for(let i =0; i<gameData.height; i++)
            for(let j=0; j<gameData.width; j++){
                showCellValue(i, j, gameData.layout[i][j]);
            }
    }
}

function updateTimer(gameData)
{
    if(gameData.state == 'midgame'){
        gameData.timer++;
        setTimer(gameData.timer);
    }
}

function updateUI(gameData)
{
    if(gameData.state == 'gameover')
        setSmileyState('sad');
    else if(gameData.state == 'victory')
        setSmileyState('happy');

    setFlagCounter(gameData.flags);
}

function translateCellValueToClass(cellValue)
{
    let className = ['mine', 'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
    return className[cellValue+1];
}

function revealAllMines(gameData)
{
    for(let i =0; i<gameData.height; i++) for(let j=0; j<gameData.width; j++){
        if(gameData.layout[i][j] == -1 && gameData.visible[i][j] != "visible"){
            showCellValue(i, j, -1);
        }
    }
}