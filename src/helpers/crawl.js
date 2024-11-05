const puppeteer = require('puppeteer');
const cron = require('node-cron');

const scrapeSite = async (site, crawlModel) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

  try {
    await page.goto(site.url, { waitUntil: 'networkidle0', timeout: 60000 });
    // Generalized data extraction logic
    const exchangeData = await page.evaluate((rowSelector, columnSelector) => {
      const rows = Array.from(document.querySelectorAll(rowSelector));
      return rows.map(row => {
        const columns = row.querySelectorAll(columnSelector);
        return Array.from(columns, column => column.innerText.trim());
      });
    }, site.rowSelector, site.columnSelector);

    // console.log(`Data from ${site.name}:`, exchangeData);
    // Xử lí dữ liệu
    crawlModel(exchangeData);
  } catch (error) {
    console.error(`Error fetching data from ${site.name}:`, error);
    await page.screenshot({ path: `error-${site.name}.png`, fullPage: true });
  } finally {
    await browser.close();
  }
};

const scheduleScraping = (site, crawlModel) => {
  // Lập lịch crawler chạy mỗi giờ
  cron.schedule('0 18 * * *', () => {
    console.log(`Đang chạy crawler cho ${site.name}...`);
    scrapeSite(site, crawlModel);
  });
};

module.exports = {
  scrapeSite,
  scheduleScraping
}