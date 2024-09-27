"use server"

import puppeteer from "puppeteer";
import { addExtra } from 'puppeteer-extra'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'

const URL = "https://bitpanel.vip/login"
const puppeteerExtra = addExtra(puppeteer)

export default async function vai () {
    console.log("VAI");
    
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    await page.goto(URL);

    //login
        try {
            
            await page.waitForSelector("form[name='form']")
            await page.type("input[name='username']", "jonatangil", {delay: 200})
            await page.type("input[name='password']", "303132", {delay: 200})
            await page.keyboard.press("Enter")

        //   await resolvCapcha()

        } catch (error) {
           console.log(error);
        }
    
}

async function resolvCapcha() {


    puppeteerExtra.use(
        RecaptchaPlugin({
            provider: {
                id: '2captcha',
                token: process.env.CAPTCHA_API_KEY // Use environment variable for API key
            }
        })
    )

    // Re-initialize browser with puppeteer-extra
    const browser = await puppeteerExtra.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto(URL)

    // Wait for recaptcha to appear and solve it
    await page.waitForSelector('.g-recaptcha')
    await Promise.all([
        page.waitForNavigation(),
        page.evaluate(() => {
            (window as any).grecaptcha.execute()
        })
    ])

    console.log('Recaptcha solved')

    // After solving recaptcha, you might need to submit the form again
    await page.click('button[type="submit"]')
}