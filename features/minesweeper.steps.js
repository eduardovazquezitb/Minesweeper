const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

const url = 'http://127.0.0.1:5500/';

function getCellId(string)
{
    let stringSplit = string.split('-');
    let y = parseInt(stringSplit[0]) - 1;
    let x = parseInt(stringSplit[1]) - 1;
    return 'cell-' + y + '-' + x;
}

async function readDimensions()
{
    const rows = await page.locator('.minesweeper tr');
    const height = await rows.count();
    const firstRow = await rows.nth(0);
    const cellsInFirstRow = await firstRow.locator('td');
    const width = await cellsInFirstRow.count();
    return {"height":height, "width": width};
}

function translateTestValueToMapRepresentation(value)
{
    switch(value){
        case "hidden":
            return '·';
        case "mine":
            return 'x';
        case "flag":
            return '!';
        case "question":
            return '?';
        default:
            return value;
    }
}

function translateStringToTestValue(value)
{
    switch(value){
        case "nothing":
            return 'hidden';
        case "a flag":
            return 'flag';
        case "a question mark":
            return 'question';
        default:
            return value;
    }
}

async function readDisplay()
{
    const dimensions = await readDimensions();
    let display = "";
    for(let i = 0; i<dimensions.height; i++)
    {
        for(let j = 0; j<dimensions.width; j++)
        {
            const cellij = await page.locator('id=cell-' + i + '-' + j);
            let value = await cellij.getAttribute('test-value');
            display += translateTestValueToMapRepresentation(value);
        }
        if(i!=dimensions.height-1) 
            display+='-';
    }
    return display;
}

Given('the user loads the default layout', async () => {
   await page.goto(url);
});

Given('the user loads the custom layout {string}', async (string) => {
    await page.goto(url + '?layout=' + string);
});

Given('the user loads the custom layout', async (docString) => {
    await page.goto(url + '?mockup');
    await page.locator('id=layout-data').fill(docString);
    await page.click('id=mockup-button');
});
       
When('the user reveals the cell {string}', async (string) => {
    let cellId = getCellId(string);
    await page.click('id=' + cellId);
});

When('the user tags the cell {string} with {string}', async (string, string2) => {
    let cellId = getCellId(string);
    await page.click('id=' + cellId, { button: 'right' });
    if(string2 == 'a question mark')
        await page.click('id=' + cellId, { button: 'right' });
});

Then('the user has lost the game', async () => {
    await expect(page).toHaveTitle('Game Over');
});

Then('the user has won the game', async () => {
    await expect(page).toHaveTitle('Victory');
});

Then('the display shows the layout', async (docString) => {
    let display = await readDisplay();
    const regEx = new RegExp('-', "g");
    display = display.replace(regEx, '\n');
    expect(display).toBe(docString);
});

Then('the display shows the layout {string}', async (string) => {
    let display = await readDisplay();
    expect(display).toBe(string);
});

Then('the cell {string} shows {string}', async (string, string2) => {

    let cellId = getCellId(string);
    const cell = await page.locator('id=' + cellId);
    let value = await cell.getAttribute('test-value');
    expect(value).toBe(translateStringToTestValue(string2));
});

