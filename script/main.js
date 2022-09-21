let gameData = {
    layout: [],
    visible: [],
    height: 8,
    width: 8,
    mines: 10,
    state: 'beforeStart'
}

window.addEventListener('DOMContentLoaded', () => {
    let URLParameters = getURLParameters();
    loadURLParameters(URLParameters);
    createDOMTable(gameData.height, gameData.width);
    connectOnClickEvents(gameData);
    updateUI(gameData);
});

function loadURLParameters(URLParameters)
{
    if("x" in URLParameters)
        gameData.width = URLParameters.x;
    if("y" in URLParameters)
        gameData.height = URLParameters.y;
    if("layout" in URLParameters)
        gameData = loadCustomLayout(URLParameters.layout);
}

function loadCustomLayout(customLayout)
{
    let inputGameData = {};
    let layoutSplit = customLayout.split('-');
    inputGameData.height = layoutSplit.length;
    inputGameData.width = layoutSplit[0].length;
    inputGameData.mines = 0;
    inputGameData.state = 'beforeStart';
    inputGameData.layout = [];
    inputGameData.visible = [];
    for(let i = 0; i<inputGameData.height; i++)
    {
        let row = [];
        let visibleRow = [];
        for(let j = 0; j<inputGameData.width; j++)
        {
            let number = 0;
            if(layoutSplit[i][j] == 'x') 
            {
                number = -1;
                inputGameData.mines++;
            }
            row.push(number);
            visibleRow.push(false);
        }
        inputGameData.layout.push(row);
        inputGameData.visible.push(visibleRow);
    }
    return inputGameData;
}