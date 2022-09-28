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

Given('the user wins the game', async () => {
    await page.goto(url + '?layout=xo');
    let cellId = getCellId('1-2');
    await page.click('id=' + cellId);
});

Given('the user loses the game', async () => {
    await page.goto(url + '?layout=xo');
    let cellId = getCellId('1-1');
    await page.click('id=' + cellId);
});

Given('the user waits {string} seconds', async (string) => {
    let milliseconds = parseInt(string)*1000;
    await page.waitForTimeout(milliseconds);
});

When('the user resets the board', async () => {
    await page.click('id=smiley');
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

When('the user untags the cell {string}', async (string) => {
    let cellId = getCellId(string);
    const cell = await page.locator('id=' + cellId);
    const state = await cell.getAttribute('test-value');
    if(state == 'question')
        await page.click('id=' + cellId, { button: 'right' });
    if(state == 'flag')
    {
        await page.click('id=' + cellId, { button: 'right' });
        await page.click('id=' + cellId, { button: 'right' });
    }
});

When('the user tags all cells with {string}', async (string) => {
    const cells = await page.locator('.minesweeper td');
    const count = await cells.count()
    for (let i = 0; i < count; ++i){
        let cellId = await cells.nth(i).getAttribute('id');
        await page.click('id=' + cellId, { button: 'right' });
        if(string == 'a question mark')
            await page.click('id=' + cellId, { button: 'right' });
    }
});

Then('the user has lost the game', async () => {
    const flagCounter = await page.locator('id=smiley');
    let value = await flagCounter.getAttribute('test-value');
    expect(value).toBe('a sad face');
});

Then('the user has won the game', async () => {
    const flagCounter = await page.locator('id=smiley');
    let value = await flagCounter.getAttribute('test-value');
    expect(value).toBe('a happy face');
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

Then('all cells are hidden', async () => {
    const cells = await page.locator('.minesweeper td');
    const count = await cells.count()
    for (let i = 0; i < count; ++i){
        let cellValue = await cells.nth(i).getAttribute('test-value');
        expect(cellValue).toBe('hidden');
    }
});

Then('the remaining flags counter shows the value {string}', async (string) => {
    const flagCounter = await page.locator('id=flag-counter');
    let value = await flagCounter.innerText();
    expect(value).toBe(string);
});

Then('the smiley shows {string}', async (string) => {
    const flagCounter = await page.locator('id=smiley');
    let value = await flagCounter.getAttribute('test-value');
    expect(value).toBe(string);
});

Then('the timer shows the value {string}', async (string) => {
    const flagCounter = await page.locator('id=timer');
    let value = await flagCounter.innerText();
    expect(value).toBe(string);
});

Then('the user has neither lost or won', async () => {
    const flagCounter = await page.locator('id=smiley');
    let value = await flagCounter.getAttribute('test-value');
    expect(value).toBe('a neutral face');
});
