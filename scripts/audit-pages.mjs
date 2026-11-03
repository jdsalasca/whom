import { chromium } from 'playwright-core'

const executablePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const base = 'http://127.0.0.1:4173'
const routes = [
  { path: '/expediente/el-corral', name: 'el-corral' },
  { path: '/expediente/semana', name: 'semana' },
  { path: '/expediente/caracol-tv', name: 'caracol-tv' },
  { path: '/registro', name: 'registro' },
  { path: '/mapa', name: 'mapa' },
  { path: '/metodo', name: 'metodo' },
  { path: '/buscar?q=caracol', name: 'buscar-caracol' },
]
const widths = [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
]

const browser = await chromium.launch({ executablePath, headless: true })
const results = []

for (const route of routes) {
  for (const { width, height } of widths) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
    const errors = []
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
    page.on('pageerror', (error) => errors.push(String(error)))
    await page.goto(`${base}${route.path}`, { waitUntil: 'networkidle' })
    const metrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      scrollHeight: document.documentElement.scrollHeight,
      title: document.title,
      h1: document.querySelector('h1')?.textContent?.trim() ?? '',
    }))
    await page.screenshot({
      path: `evidence/${route.name}-${width}.png`,
      fullPage: true,
    })
    results.push({ route: route.path, width, metrics, errors })
    await page.close()
  }
}

await browser.close()
console.log(JSON.stringify(results, null, 2))
