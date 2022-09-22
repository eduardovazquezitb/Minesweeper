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
    inputGameData = {
        layout: [],
        visible: [],
        height: 8,
        width: 8,
        mines: 10,
        state: 'beforeStart'
    }
    if("x" in URLParameters)
        inputGameData.width = URLParameters.x;
    if("y" in URLParameters)
        inputGameData.height = URLParameters.y;
    if("layout" in URLParameters)
        inputGameData = loadCustomLayout(URLParameters.layout);
    if("mockup" in URLParameters)
        createPopUp(gameData); 
    return inputGameData;
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

function createPopUp(gameData)
{
    var popup = document.createElement('div');
    popup.classList.add('popup');
    popup.setAttribute('id', 'popup');

    var paragraph = document.createElement('p');
    paragraph.innerText = 'mockup data';
    
    var textarea = document.createElement('textarea');
    textarea.setAttribute('id','layout-data');
    textarea.setAttribute('rows', 7);
    
    var button = document.createElement('button');
    button.setAttribute('id', 'mockup-button')
    button.innerText = 'submit layout';
    button.onclick = submitLayout.bind(button, gameData);

    popup.appendChild(paragraph);
    popup.appendChild(textarea);
    popup.appendChild(button);

    document.body.appendChild(popup);
}
