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
                let cell = getCellObject(i, j);
                showCellValue(cell, gameData.layout[i][j]);
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
    if(gameData.state == 'gameover'){
        //document.title = 'Game Over';
        setSmileyState('sad');
    }
    else if(gameData.state == 'victory'){
        //document.title = 'Victory';
        setSmileyState('happy');
    }

    setFlagCounter(gameData.flags);
}

function modifyCellTag(cell, newClass)
{
    cell.removeAttribute('class');
    cell.classList.add(newClass);
    cell.setAttribute('test-value', newClass);
}

function showCellValue(cell, cellValue)
{
    cell.removeAttribute('class');
    let cellClass = translateCellValueToClass(cellValue);
    cell.classList.add(cellClass);
    let testValue = cellValue.toString();
    if(testValue == '-1') 
        testValue = 'mine';
    cell.setAttribute('test-value', testValue);
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
            const cell = getCellObject(i, j);
            showCellValue(cell, -1);
        }
    }
}