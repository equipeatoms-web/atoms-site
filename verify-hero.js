import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const screenshotDir = './screenshots';
if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('📍 Acessando http://localhost:8081...');
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('✅ Página carregada');

    // Aguardar elementos críticos
    await page.waitForSelector('h1', { timeout: 5000 }).catch(() => console.warn('⚠️ h1 não encontrado'));
    await page.waitForSelector('input[placeholder*="principal"]', { timeout: 5000 }).catch(() => console.warn('⚠️ Prompt input não encontrado'));

    // Verificar se Spline está no DOM
    const splineFrames = await page.$$('iframe[title*="Spline"]');
    console.log(`🎬 Spline iframes encontrados: ${splineFrames.length}`);

    // Verificar Spotlight SVG
    const spotlightSvg = await page.$('svg[class*="spotlight"]');
    if (spotlightSvg) {
      const fill = await spotlightSvg.evaluate(el => {
        const ellipse = el.querySelector('ellipse');
        return ellipse ? ellipse.getAttribute('fill') : 'não encontrado';
      });
      console.log(`✨ Spotlight fill: ${fill}`);
    } else {
      console.warn('⚠️ Spotlight SVG não encontrado');
    }

    // Screenshot da seção hero
    await page.screenshot({ path: path.join(screenshotDir, 'hero-full.png'), fullPage: false });
    console.log('📸 Screenshot: hero-full.png');

    // Scroll para verificar animações
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(screenshotDir, 'hero-scrolled.png') });
    console.log('📸 Screenshot após scroll: hero-scrolled.png');

    // Testar input
    await page.click('input[placeholder*="principal"]');
    await page.type('input[placeholder*="principal"]', 'Teste de digitação');
    await page.screenshot({ path: path.join(screenshotDir, 'hero-input.png') });
    console.log('📸 Screenshot com input: hero-input.png');

    console.log('\n✅ Verificação concluída com sucesso!');
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
