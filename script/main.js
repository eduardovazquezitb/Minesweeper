let gameData = {};

window.addEventListener('DOMContentLoaded', () => {
    let URLParameters = getURLParameters();
    gameData = loadURLParameters(URLParameters, gameData);
    createDOMTable(gameData.height, gameData.width);
    countBombs(gameData);
    connectOnClickEvents(gameData);
    updateUI(gameData);
});

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