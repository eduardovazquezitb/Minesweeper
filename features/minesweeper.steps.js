const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
var anova1  = require( '@stdlib/stats\-anova1');

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

function countMines(display)
{
    let mines = 0;
    for(let i =0; i< display.length; i++)
        if(display[i] == 'x')
            mines++;
    return mines;
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

Given('the user loads the default layout with all cells visible {string} times', async (string) => {
    this.displays = [];
    let numberOfTries = parseInt(string);
    for(let i =0; i< numberOfTries; i++){
        await page.goto(url + '?visible');
        let display = await readDisplay();
        this.displays.push(display);
    }
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

When('the user {string} clicks the cell {string}', async (string, string2) => {
    let cellId = getCellId(string2);
    const cell = await page.locator('id=' + cellId);
    const box = await cell.boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2, {button: string});
});

When('the user presses the smiley', async () => {
    const cell = await page.locator('id=smiley');
    const box = await cell.boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
});

When('the user counts how many mines are there', async () => {
    this.mines = [];
    for(let i =0; i< this.displays.length; i++)
    {
        let mineCount = countMines(this.displays[i]);
        this.mines.push(mineCount);
    }
});

When('the user counts the frequency of each cell having a mine', async () => {
    this.isBomb = [];
    this.cellId = [];
    for(let i =0 ; i<this.displays.length; i++)
    {   
        const regEx = new RegExp('-', "g");
        let display = this.displays[i].replace(regEx,'');
        for(let j=0; j< display.length; j++)
        {
            this.cellId.push(j);
            if(display[j] == 'x')
                this.isBomb.push(1.0);
            else   
                this.isBomb.push(0.0);
        }
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
    const smiley = await page.locator('id=smiley');
    let value = await smiley.getAttribute('test-value');
    expect(value).toBe(string);
});

Then('the timer shows the value {string}', async (string) => {
    const timer = await page.locator('id=timer');
    let value = await timer.innerText();
    expect(value).toBe(string);
});

Then('the user has neither lost or won', async () => {
    const smiley = await page.locator('id=smiley');
    let value = await smiley.getAttribute('test-value');
    expect(value).toBe('a neutral face');
});

Then('the cell {string} is revealed', async (string) => {
    let cellId = getCellId(string);
    const cell = await page.locator('id=' + cellId);
    let value = await cell.getAttribute('test-value');
    expect(value).not.toMatch(/hidden|flag|question/);
});

Then('the default board resets', async () => {
    const cells = await page.locator('.minesweeper td');
    const count = await cells.count()
    for (let i = 0; i < count; ++i){
        let cellValue = await cells.nth(i).getAttribute('test-value');
        expect(cellValue).toBe('hidden');
    }
    const flagCounter = await page.locator('id=flag-counter');
    let flagValue = await flagCounter.innerText();
    expect(flagValue).toBe('10');
    const timer = await page.locator('id=timer');
    let timerValue = await timer.innerText();
    expect(timerValue).toBe('0');
    const smiley = await page.locator('id=smiley');
    let smileyValue = await smiley.getAttribute('test-value');
    expect(smileyValue).toBe('a neutral face');
});

Then('there is always {string} mines on the field', async (string) => {
    let min = this.mines[0], max = this.mines[0];
    for(let i = 1; i< this.mines.length; i++)
    {
        if(this.mines[i] < min)
            min = this.mines[i];
        if(this.mines[i] > max)
            max = this.mines[i];
    }
    expect(min + '-' + max).toBe(string + '-' + string);
});

Then('no significant differences are found', async () => {
    let anova = anova1( this.isBomb, this.cellId );
    let anovaSplit = anova.print().split('\n');
    let lastLine = anovaSplit[anovaSplit.length-1];
    let resultat = lastLine.substring(0,lastLine.indexOf(':'));

    expect(anova).toBe('patata');
});
