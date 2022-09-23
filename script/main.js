let gameData = {};

window.addEventListener('DOMContentLoaded', () => {
    let URLParameters = getURLParameters();
    gameData = loadURLParameters(URLParameters, gameData);
    InitGame(gameData);
});

function InitGame(currentGameData)
{
    EmptyTable();
    createDOMTable(currentGameData.height, currentGameData.width);
    countBombs(currentGameData);
    connectOnClickEvents(currentGameData);
    updateUI(currentGameData);
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

function revealCell(position, gameData)
{
    let cell = getCellObject(position.row, position.column);
    let cellValue = gameData.layout[position.row][position.column];
    showCellValue(cell, cellValue);
    gameData.visible[position.row][position.column] = true;
    updateUI(gameData);
    cell.onclick = function () {};
    if(cellValue == 0)
        revealNeighbourCells(position, gameData);
}

function revealNeighbourCells(position, gameData)
{
    let neighbours = getAdjacentCells(position.row, position.column, gameData)
    for(let k = 0; k<neighbours.length; k++)
    {
        let neighbour = getCellObject(neighbours[k].row, neighbours[k].column);
        neighbour.click();
    }
}