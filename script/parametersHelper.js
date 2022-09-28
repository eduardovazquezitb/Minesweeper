function getURLParameters()
{
    var pageURL = window.location.search.substring(1);
    var URLVariables = pageURL.split('&');
    var parameters = {};
    for (var i = 0; i < URLVariables.length; i++) 
    {
        let keyValue = URLVariables[i].split('=');
        parameters[keyValue[0]]=keyValue[1];
    }
    return parameters;
}

function loadURLParameters(URLParameters, gameData)
{
    gameData = {
        layout: [],
        visible: [],
        height: 8,
        width: 8,
        mines: 10,
        flags: 10,
        timer: 0,
        state: 'beforeStart'
    }

    if("x" in URLParameters)
        gameData.width = URLParameters.x;
    if("y" in URLParameters)
        gameData.height = URLParameters.y;
    if("mines" in URLParameters){
        gameData.mines = URLParameters.mines;
        gameData.flags = URLParameters.flags;
    }

    if("layout" in URLParameters)
        gameData = loadCustomLayout(URLParameters.layout);
    else
        gameData = loadDefaultLayout(gameData);
    
    if("mockup" in URLParameters)
        createPopUp(gameData); 

    return gameData;
}

function loadCustomLayout(customLayout)
{
    let inputGameData = {};
    let layoutSplit = customLayout.split('-');
    inputGameData.height = layoutSplit.length;
    inputGameData.width = layoutSplit[0].length;
    inputGameData.mines = 0;
    inputGameData.timer = 0;
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
            visibleRow.push("hidden");
        }
        inputGameData.layout.push(row);
        inputGameData.visible.push(visibleRow);
    }
    inputGameData.flags = inputGameData.mines;
    return inputGameData;
}

function loadDefaultLayout(gameData)
{
    if(gameData.mines > gameData.width * gameData.height)
        gameData.mines = gameData.width * gameData.height;

    gameData.layout = new Array(gameData.height).fill(0).map(() => new Array(gameData.width).fill(0));
    gameData.visible = new Array(gameData.height).fill(0).map(() => new Array(gameData.width).fill("hidden"));

    for(let i = 0; i < gameData.mines; i++)
    {
        position = getMineFreePosition(gameData.layout, gameData.height, gameData.width);
        gameData.layout[position.row][position.column] = -1;
    }
    return gameData;
}

function getMineFreePosition(layout, height, width)
{
    let row, column;
    do{
        row = Math.floor(Math.random()*height);
        column = Math.floor(Math.random()*width);
    } while(layout[row][column] == -1);
    return {"row":row, "column":column};
}