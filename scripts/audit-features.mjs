import { chromium } from 'playwright-core'
import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

const executablePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const base = 'http://127.0.0.1:4173'
const browser = await chromium.launch({ executablePath, headless: true })
const results = []

const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
await page.goto(`${base}/arbol`, { waitUntil: 'networkidle' })
results.push({
  route: '/arbol',
  title: await page.title(),
  roots: await page.locator('.root-chip').count(),
  nodes: await page.locator('.tree-node').count(),
  scrollWidth: await page.evaluate(() => document.documentElement.scrollWidth),
})
await page.screenshot({ path: 'evidence/arbol-1440.png', fullPage: true })

await page.goto(`${base}/expediente/el-corral`, { waitUntil: 'networkidle' })
results.push({
  route: '/expediente/el-corral',
  tree: await page.locator('.tree').count(),
  nodes: await page.locator('.tree-node').count(),
  scrollWidth: await page.evaluate(() => document.documentElement.scrollWidth),
})
await page.screenshot({ path: 'evidence/el-corral-tree-1440.png', fullPage: true })

const downloadPromise = page.waitForEvent('download')
await page.getByRole('button', { name: /descargar pdf/i }).click()
const download = await downloadPromise
const pdfPath = resolve('evidence', download.suggestedFilename())
await download.saveAs(pdfPath)
results.push({
  action: 'entity-pdf',
  filename: download.suggestedFilename(),
  bytes: existsSync(pdfPath) ? statSync(pdfPath).size : 0,
})

await page.goto(`${base}/registro`, { waitUntil: 'networkidle' })
const registryDownload = page.waitForEvent('download')
await page.getByRole('button', { name: /descargar pdf de esta vista/i }).click()
const registryFile = await registryDownload
const registryPath = resolve('evidence', registryFile.suggestedFilename())
await registryFile.saveAs(registryPath)
results.push({
  action: 'registry-pdf',
  filename: registryFile.suggestedFilename(),
  bytes: existsSync(registryPath) ? statSync(registryPath).size : 0,
})

await page.setViewportSize({ width: 390, height: 844 })
await page.goto(`${base}/arbol`, { waitUntil: 'networkidle' })
results.push({
  route: '/arbol-mobile',
  scrollWidth: await page.evaluate(() => document.documentElement.scrollWidth),
  innerWidth: await page.evaluate(() => window.innerWidth),
})
await page.screenshot({ path: 'evidence/arbol-390.png', fullPage: true })

await page.goto(`${base}/`, { waitUntil: 'networkidle' })
results.push({
  route: '/',
  firstGroups: await page.locator('.group-card h3').allTextContents(),
  scrollWidth: await page.evaluate(() => document.documentElement.scrollWidth),
})
await page.screenshot({ path: 'evidence/home-groups-390.png', fullPage: true })

await browser.close()
console.log(JSON.stringify(results, null, 2))
