import { chromium } from 'playwright-core'

const executablePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const base = 'http://127.0.0.1:4173'
const widths = [
  { width: 1440, height: 1000, name: '1440' },
  { width: 834, height: 1000, name: '834' },
  { width: 390, height: 844, name: '390' },
]

const browser = await chromium.launch({ executablePath, headless: true })
const results = []

for (const { width, height, name } of widths) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
  const errors = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => errors.push(String(error)))
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.screenshot({ path: `evidence/home-${name}-pw.png`, fullPage: true })

  const metrics = await page.evaluate(() => {
    const viewport = window.innerWidth
    const doc = document.documentElement
    const bad = [...document.querySelectorAll('body *')]
      .map((element) => {
        const rect = element.getBoundingClientRect()
        return {
          tag: element.tagName.toLowerCase(),
          className: typeof element.className === 'string' ? element.className : '',
          text: (element.textContent || '').trim().slice(0, 60),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        }
      })
      .filter((item) => item.right > viewport + 1 || item.left < -1)
      .slice(0, 25)

    return {
      viewport,
      innerWidth: window.innerWidth,
      scrollWidth: doc.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      scrollHeight: doc.scrollHeight,
      bad,
    }
  })

  results.push({ name, metrics, errors })
  await page.close()
}

await browser.close()
console.log(JSON.stringify(results, null, 2))
