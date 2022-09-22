function createDOMTable(height, width)
{
    var table = document.getElementById('table');
    for(let i = 0; i<height; i++)
    {
        var row = document.createElement('tr');
        row.setAttribute('id', 'row-'+i);
        for(let j = 0; j<width; j++)
        {
            var cell = document.createElement('td');
            let cellId = 'cell-' +i+ '-' +j;
            cell.setAttribute('id', cellId);
            cell.setAttribute('test-value', 'hidden');
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

function revealCell(position, gameData)
{
    let cellId = 'cell-' +position.y+ '-' +position.x;
    let cell = document.getElementById(cellId);
    let cellClass = '';
    switch(gameData.layout[position.y][position.x])
    {
        case -1:
            cellClass = 'mine';
            break;
        case 0:
            cellClass = 'zero';
            break;
        case 1:
            cellClass = 'one';
            break;
        case 2:
            cellClass = 'two';
            break;
        case 3:
            cellClass = 'three';
            break;
        case 4:
            cellClass = 'four';
            break;
        case 5:
            cellClass = 'five';
            break;
        case 6:
            cellClass = 'six';
            break;
        case 7:
            cellClass = 'seven';
            break;
        case 8:
            cellClass = 'eight';
            break;
    }
    cell.classList.add(cellClass);
    let testValue = gameData.layout[position.y][position.x].toString();
    if(testValue == '-1') testValue = 'mine';
    cell.setAttribute('test-value', testValue);
    gameData.visible[position.y][position.x] = true;
    updateUI(gameData);
    cell.onclick = function () {};

    if(cellClass == 'zero')
    {
        let neighbours = getAdjacentCells(position.y, position.x, gameData)
        for(let k = 0; k<neighbours.length; k++)
        {
            let neighbourId = 'cell-' +neighbours[k].row+ '-' +neighbours[k].column;
            let neighbour = document.getElementById(neighbourId);
            neighbour.click();
        }
    }
}

function connectOnClickEvents(gameData)
{
    for(let i = 0; i<gameData.height; i++) for(let j =0; j<gameData.width; j++)
    {
        let cellId = 'cell-' +i+ '-' +j;
        let cell = document.getElementById(cellId);
        let position = {'x':j, 'y':i};
        cell.onclick = revealCell.bind(cell, position, gameData);
    }
}

function submitLayout(gameData)
{
    var textarea = document.getElementById('layout-data');
    const regEx = new RegExp('\n', "g");
    gameData = loadCustomLayout(textarea.value.replace(regEx,'-'));
    document.getElementById('popup').remove();
    EmptyTable();
    createDOMTable(gameData.height, gameData.width);
    countBombs(gameData);
    connectOnClickEvents(gameData);
    updateUI(gameData);
}

function EmptyTable()
{
    document.getElementById('table').remove();
    var table = document.createElement('table');
    table.setAttribute('id', 'table');
    table.classList.add('minesweeper');
    document.body.appendChild(table);
}