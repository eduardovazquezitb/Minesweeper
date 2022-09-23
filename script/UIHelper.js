function updateUI(gameData)
{
    var visibleMines = 0;
    var visibleCells = 0;
    for(let i = 0; i<gameData.height; i++) for(let j = 0; j<gameData.width; j++)
    {
        if(gameData.visible[i][j]) 
        {
            visibleCells++;
            if(gameData.layout[i][j] == -1)
                visibleMines++;
        }
    }
        
    if(visibleMines > 0)
    {
        document.title = 'Game Over';
        gameData.state = 'GameOver';
    }
    else if(visibleCells == gameData.width * gameData.height - gameData.mines)
    {
        document.title = 'Victory';
        gameData.state = 'Victory';
    }
    else
    {
        document.title = 'Minesweeper';
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