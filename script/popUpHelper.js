function createPopUp(gameData)
{
    var popup = document.createElement('div');
    popup.classList.add('popup');
    popup.setAttribute('id', 'popup');

    var paragraph = document.createElement('p');
    paragraph.innerText = 'mock data';
    
    var textarea = document.createElement('textarea');
    textarea.setAttribute('id','layout-data');
    textarea.setAttribute('rows', 7);
    
    var button = document.createElement('button');
    button.setAttribute('id', 'mockdata-button')
    button.innerText = 'submit layout';
    button.onclick = submitLayout.bind(button, gameData);

    popup.appendChild(paragraph);
    popup.appendChild(textarea);
    popup.appendChild(button);

    document.body.appendChild(popup);
}

function submitLayout(gameData)
{
    var textarea = getLayoutFromPopup();
    const regEx = new RegExp('\n', "g");
    gameData = loadCustomLayout(textarea.replace(regEx,'-'));
    getPopupDOMObject().remove();
    InitGame(gameData);
}
