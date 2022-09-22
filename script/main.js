let gameData = {};

window.addEventListener('DOMContentLoaded', () => {
    let URLParameters = getURLParameters();
    gameData = loadURLParameters(URLParameters, gameData);
    createDOMTable(gameData.height, gameData.width);
    connectOnClickEvents(gameData);
    updateUI(gameData);
});

