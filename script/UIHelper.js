function initUI(gameData)
{
    if(gameData.state == 'victory'){
        document.title = 'Victory';
        setSmileyState('happy');
    }
    else{
        document.title = 'Minesweeper';
        setSmileyState('neutral');
    }
    
    setFlagCounter(gameData.mines.toString());
    setTimer(gameData.timer);
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
        document.title = 'Game Over';
        setSmileyState('sad');
    }
    else if(gameData.state == 'victory'){
        document.title = 'Victory';
        setSmileyState('happy');
    }
}

function modifyCellTag(cell)
{
    let classes = ["hidden", "flag", "question"];
    let cellClassIndex = -1;
    for(let i =0 ; cellClassIndex == -1 && i<3; i++)
        if(cell.classList.contains(classes[i]))
            cellClassIndex = i;
    cellClassIndex = (cellClassIndex+1)%3;

    cell.removeAttribute('class');
    cell.classList.add(classes[cellClassIndex]);
    cell.setAttribute('test-value', classes[cellClassIndex]);
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
        if(gameData.layout[i][j] == -1 && !gameData.visible[i][j]){
            const cell = getCellObject(i, j);
            showCellValue(cell, -1);
        }
    }
}