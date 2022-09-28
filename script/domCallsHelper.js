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
            cell.classList.add('hidden');
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

function EmptyTable()
{
    document.getElementById('table').remove();
    var table = document.createElement('table');
    table.setAttribute('id', 'table');
    document.getElementById('minesweeper').appendChild(table);
}

function connectOnClickEvents(gameData)
{
    for(let i = 0; i<gameData.height; i++) for(let j =0; j<gameData.width; j++)
    {
        let cell = getCellObject(i, j);
        let position = {'row':i, 'column':j};
        cell.onclick = revealCell.bind(cell, position, gameData);
        cell.oncontextmenu = function(event) {event.preventDefault(); tagCell(position, gameData);}
    }

    const smiley = getSmileyObject();
    smiley.onclick = resetGame.bind(smiley, gameData);
}

function disableOnContextMenu()
{
    let minesweeper = document.getElementById('minesweeper');
    minesweeper.oncontextmenu = function () { return false; };
}

function getCellObject(row, column)
{
    let cellId = 'cell-' + row + '-' + column;
    return document.getElementById(cellId);
}

function getLayoutFromPopup()
{
    return document.getElementById('layout-data').value;
}

function getPopupDOMObject()
{
    return document.getElementById('popup');
}

function setFlagCounter(string)
{
    document.getElementById('flag-counter').innerText = string;
}

function setSmileyState(string)
{
    const smiley = document.getElementById('smiley');
    if(!smiley.classList.contains(string)){
        smiley.removeAttribute('class');
        smiley.classList.add(string);
        let sentence = 'a ' + string + ' face';
        smiley.setAttribute('test-value', sentence);
    }
}

function getSmileyObject()
{
    return document.getElementById('smiley');
}

function setTimer(number)
{
    document.getElementById('timer').innerText = number.toString();
}