function updateUI(gameData)
{
    console.log("henlo fiend");
    console.log(gameData);
    var visibleMines = 0;
    var visibleCells = 0;
    for(let i = 0; i<gameData.height; i++) for(let j = 0; j<gameData.width; j++)
    {
        if(gameData.visible[i][j]) 
        {
            console.log('cell-'+i+'-'+j+' is VISIBLE AAAH');
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
}