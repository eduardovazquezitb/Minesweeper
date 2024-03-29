let gameData = {};

window.addEventListener('DOMContentLoaded', () => {
    disableOnContextMenu();
    let URLParameters = getURLParameters();
    gameData = loadURLParameters(URLParameters, gameData);
    InitGame(gameData);
    setInterval(function() {updateTimer(gameData)}, 1000);
});

function InitGame(currentGameData)
{
    EmptyTable();
    createDOMTable(currentGameData.height, currentGameData.width);
    countBombs(currentGameData);
    connectOnClickEvents(currentGameData);
    currentGameData.state = checkGameState(currentGameData);
    initUI(currentGameData);
}

function countBombs(currentGameData)
{
    for(let i=0; i<currentGameData.height; i++)
        for(let j=0; j<currentGameData.width; j++)
        {
            if(currentGameData.layout[i][j] != -1)
            {
                let neighbours = getAdjacentCells(i, j, currentGameData);
                for(let k = 0; k<neighbours.length; k++)
                    if(currentGameData.layout[neighbours[k].row][neighbours[k].column] == -1)
                        currentGameData.layout[i][j]++;
            }
        }
}

function getAdjacentCells(row, column, currentGameData)
{
    let cells = [];
    for(let i = -1; i <= 1; i++) for(let j = -1; j <= 1; j++)
    {
        let positionNeighbour = {'row':row+i, 'column': column+j};
        if(isPositionValid(positionNeighbour, currentGameData) && (i != 0 || j != 0))
            cells.push(positionNeighbour);
    }
    return cells;
}

function isPositionValid(position, currentGameData)
{
    let isRowValid = position.row >= 0 && position.row < currentGameData.height;
    let isColumnValid = position.column >= 0 && position.column < currentGameData.width;
    return isRowValid && isColumnValid;
}

function revealCell(position, currentGameData)
{
    if(currentGameData.state == 'beforeStart')
        currentGameData.state = 'midgame';
    if(currentGameData.state == 'midgame'){
        let cellValue = currentGameData.layout[position.row][position.column];
        showCellValue(position.row, position.column, cellValue);
        if(currentGameData.visible[position.row][position.column] == "flag")
            currentGameData.flags++;
        currentGameData.visible[position.row][position.column] = "visible";
        currentGameData.state = checkGameState(currentGameData);
        updateUI(currentGameData);
        disableRevealCell(position.row, position.column);
        if(cellValue == 0)
            revealNeighbourCells(position, currentGameData);
        if(cellValue == -1)
            revealAllMines(currentGameData);
        gameData = currentGameData;
    }
}

function tagCell(position, currentGameData)
{
    let tagState = currentGameData.visible[position.row][position.column];
    if(tagState != "visible" && (currentGameData.state == 'midgame' || currentGameData.state == 'beforeStart')){

        let newTag;
        switch(tagState){
            case "hidden":
                newTag = "flag";
                currentGameData.flags--;
                break;
            case "flag":
                newTag = "question";
                currentGameData.flags++;
                break;
            case "question":
                newTag = "hidden";
                break;
        }
        currentGameData.visible[position.row][position.column] = newTag;

        modifyCellTag(position.row, position.column, newTag);
    }
    updateUI(currentGameData);
    gameData = currentGameData;
}

function revealNeighbourCells(position, currentGameData)
{
    let neighbours = getAdjacentCells(position.row, position.column, currentGameData)
    for(let k = 0; k<neighbours.length; k++)
        clickOnCell(neighbours[k].row, neighbours[k].column);
}

function checkGameState(currentGameData)
{
    var visibleMines = 0;
    var visibleCells = 0;
    for(let i = 0; i<currentGameData.height; i++) for(let j = 0; j<currentGameData.width; j++)
    {
        if(currentGameData.visible[i][j] == "visible") 
        {
            visibleCells++;
            if(currentGameData.layout[i][j] == -1)
                visibleMines++;
        }
    }
        
    if(visibleMines > 0)
        return 'gameover';
    else if(visibleCells == currentGameData.width * currentGameData.height - currentGameData.mines)
        return 'victory';
    return currentGameData.state;
}

function resetGame(currentGameData)
{
    let URLParameters = getURLParameters();
    currentGameData = loadURLParameters(URLParameters, currentGameData);
    InitGame(currentGameData);
    gameData = currentGameData;
}