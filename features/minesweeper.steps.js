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

Given('the user loads the custom layout {string}', async (string) => {
    await page.goto(url + '?layout=' + string);
});

       
When('the user reveals the cell {string}', async (string) => {
    let cellId = getCellId(string);
    await page.click('id=' + cellId);
});

Then('the user has lost the game', async () => {
    await expect(page).toHaveTitle('Game Over');
});
