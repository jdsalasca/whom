import { chromium } from 'playwright-core'
import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

const executablePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const base = 'https://whom-colombia.eridu.top'
const browser = await chromium.launch({ executablePath, headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
const errors = []
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text())
})
page.on('pageerror', (error) => errors.push(String(error)))

await page.goto(`${base}/`, { waitUntil: 'networkidle' })
await page.screenshot({ path: 'evidence/live-home-1440.png', fullPage: true })

await page.goto(`${base}/arbol?raiz=gilinski&foco=el-corral`, { waitUntil: 'networkidle' })
const treeInfo = {
  nodes: await page.locator('.tree-node').count(),
  title: await page.title(),
  h1: await page.locator('h1').innerText(),
}
await page.screenshot({ path: 'evidence/live-arbol-1440.png', fullPage: true })

await page.goto(`${base}/expediente/el-corral`, { waitUntil: 'networkidle' })
const pdfPromise = page.waitForEvent('download', { timeout: 60000 })
await page.getByRole('button', { name: /descargar pdf/i }).click()
const pdf = await pdfPromise
const pdfPath = resolve('evidence', `live-${pdf.suggestedFilename()}`)
await pdf.saveAs(pdfPath)

await page.setViewportSize({ width: 390, height: 844 })
await page.goto(`${base}/arbol?raiz=gilinski&foco=el-corral`, { waitUntil: 'networkidle' })
await page.screenshot({ path: 'evidence/live-arbol-390.png', fullPage: true })
const mobileInfo = {
  scrollWidth: await page.evaluate(() => document.documentElement.scrollWidth),
  innerWidth: await page.evaluate(() => window.innerWidth),
}

await browser.close()
console.log(
  JSON.stringify(
    {
      treeInfo,
      mobileInfo,
      pdf: { filename: pdf.suggestedFilename(), bytes: existsSync(pdfPath) ? statSync(pdfPath).size : 0 },
      errors,
    },
    null,
    2,
  ),
)
