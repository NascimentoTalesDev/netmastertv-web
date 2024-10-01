"use server"

import puppeteer from "puppeteer";
import fs from 'fs';
import path from 'path';

const dir = path.join(__dirname, 'authentication');
const cookiesPath = path.join(dir, 'cookies.json');

const URL = "https://bitpanel.vip/login"

export default async function vai() {
    console.log("VAI");

    const browser = await puppeteer.launch({ headless: "shell", userDataDir: dir, ignoreDefaultArgs: ['--disable-extensions'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 800 });

    // Load cookies if they exist
    if (fs.existsSync(cookiesPath)) {
        const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf8'));
        await page.setCookie(...cookies);
    }

    await page.goto(URL);

    // Check if we're already logged in
    const isLoggedIn = await page.evaluate(() => {
        // Replace this with actual logic to check if user is logged in
        return !document.querySelector('.form');
    });

    if (!isLoggedIn) {
        try {
            const formContent = await page.waitForSelector('.form');

            await defaultDelay()

            if (formContent) {
                await page.type("input[name='username']", "jonatangil", { delay: 200 })
                await page.type("input[name='password']", "303132", { delay: 200 })
                await page.keyboard.press("Enter")

                // Wait for navigation after login
                await page.waitForNavigation();

                // Save cookies after successful login
                const cookies = await page.cookies();
                fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        console.log("Already logged in");
    }

    // Navigate to the list page
    await page.goto(`${URL}/list`);

    // Wait for and click the test button
    await page.waitForSelector('.nav-menu', { visible: true });
    await page.click('a[href="/list"]');

    await page.waitForSelector('.btn-test', { visible: true });
    await page.click('.btn-test');

    await page.waitForSelector('.v-card__text', { visible: true });
    const generateRandomNumber = (): string => {
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    };

    // Use the generated number
    await page.type("input[id='input-132']", generateRandomNumber(), { delay: 100 });
    await page.waitForSelector("input[id='input-135']", { visible: true });
    await page.click("input[id='input-135']");


    // Wait for the list item to be visible
    await page.waitForSelector('.v-list-item__title', { visible: true });

    // Find the specific list item and click it
    const listItems = await page.$$('.v-list-item__title');
    for (const item of listItems) {
        const text = await item.evaluate(el => el.textContent);
        if (text === "Full HD + H265 + HD + SD + VOD + Adulto") {
            await item.click();
            break;
        }
    }

    // Wait for the "Criar" button to be visible and click it
    await page.waitForSelector('.v-card__actions', { visible: true });
    // Wait for the second button to be visible and click it
    const buttons = await page.$$('.v-card__actions button');
    if (buttons.length >= 2) {
        await buttons[1].click();
    } else {
        console.log("Second button not found");
    }
    // Add a delay after clicking to allow for any potential page updates
    await defaultDelay();
    await defaultDelay();

    await page.waitForSelector(".swal2-modal", { visible: true });
    await page.click(".swal2-confirm");
    
    await page.waitForSelector(".user-infor", { visible: true });
    // Get all list items
    const userInfoListItems = await page.$$('.user-infor li');

    // Check if we have at least 4 items (since we need index 3)
    if (userInfoListItems.length >= 5) {
        // Extract text content from items at index 0, 1, and 3
        const user = await userInfoListItems[0].evaluate(el => el.textContent);
        const password = await userInfoListItems[1].evaluate(el => el.textContent);
        const expiration = await userInfoListItems[4].evaluate(el => el.textContent);
        const link = `http://play.stmlist.vip`
        await browser.close();
        return [        
                user,
                password,
                expiration,
                link
            ]
        
    } else {
        console.log('Not enough list items found');
    }

    // Add a delay to ensure the data is captured
}

const defaultDelay = async (time: number = 2000): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, time));
};