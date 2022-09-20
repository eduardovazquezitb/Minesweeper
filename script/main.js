let layout = [];
let maxHeight = 8;
let maxWidth = 8;
let totalMines = 10;

window.addEventListener('DOMContentLoaded', () => {
    let URLParameters = getURLParameters();
    loadURLParameters(URLParameters);
    createDOMTable(maxHeight, maxWidth);
    connectOnClickEvents(maxHeight, maxWidth, layout);
});

function loadURLParameters(URLParameters)
{
    if("x" in URLParameters)
        maxWidth = URLParameters.x;
    if("y" in URLParameters)
        maxHeight = URLParameters.y;
    if("layout" in URLParameters)
        layout = loadCustomLayout(URLParameters.layout);
}

function loadCustomLayout(customLayout)
{
    let layoutSplit = customLayout.split('-');
    maxHeight = layoutSplit.length;
    maxWidth = layoutSplit[0].length;
    totalMines = 0;
    let matrix = [];
    for(let i = 0; i<maxHeight; i++)
    {
        let row = [];
        for(let j = 0; j<maxWidth; j++)
        {
            let number = 0;
            if(layoutSplit[i][j] == 'x') 
            {
                number = -1;
                totalMines++;
            }
            row.push(number);
        }
        matrix.push(row);
    }
    return matrix;
}