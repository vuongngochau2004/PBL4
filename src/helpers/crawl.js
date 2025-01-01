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
    
    // if (site.rowSelector === '.list-ty-gia .dl-grid-md-5') {
    //   const xemThemSelector = '.container .sec-tg-2 a';
    //   let previousContentLength = 0;

    //   // Lặp lại việc click \"Xem thêm\" cho đến khi nội dung không thay đổi
    //   let hasMore = true;
    //   while (hasMore) {
    //     const xemThemElement = await page.$(xemThemSelector);
    //     if (xemThemElement) {
    //       const linkText = await page.evaluate(el => el.innerText.trim(), xemThemElement);
    //       if (linkText === 'Xem thêm') {
    //         await page.waitForSelector(xemThemSelector);
    //         await page.click(xemThemSelector);
    //         console.log('Đã click vào thẻ \"Xem thêm\".');

    //         // Chờ nội dung tải thêm
    //         await new Promise(resolve => setTimeout(resolve, 1000));

    //         // Kiểm tra nếu nội dung mới xuất hiện
    //         const currentContentLength = await page.evaluate(rowSelector => {
    //           return document.querySelectorAll(rowSelector).length;
    //         }, site.rowSelector);

    //         if (currentContentLength === previousContentLength) {
    //           console.log('Không có nội dung mới, dừng lại.');
    //           hasMore = false;
    //         } else {
    //           previousContentLength = currentContentLength;
    //         }
    //       } else {
    //         console.log('Nút \"Xem thêm\" không có nội dung phù hợp.');
    //         hasMore = false;
    //       }
    //     } else {
    //       console.log('Không tìm thấy nút \"Xem thêm\".');
    //       hasMore = false;
    //     }
    //   }
    // }
    
    // Generalized data extraction logic
    let exchangeData ;
    if(!site.columnSelectorHead){
       exchangeData = await page.evaluate((rowSelector, columnSelector) => {
        const rows = Array.from(document.querySelectorAll(rowSelector));
        return rows.map(row => {
          const columns = row.querySelectorAll(columnSelector);
          return Array.from(columns, column => column.innerText.trim());
        });
      }, site.rowSelector, site.columnSelector);
    }
    else {
      exchangeData = await page.evaluate((rowSelector, columnSelector, columnSelectorHead) => {
        const rows = Array.from(document.querySelectorAll(rowSelector));
        return rows.map(row => {
            const columns = row.querySelectorAll(columnSelector);
            const columnHead = row.querySelector(columnSelectorHead);
            const columnHeadText = columnHead ? columnHead.innerText.trim() : ''; // Xử lý null
            return [columnHeadText].concat(Array.from(columns, column => column.innerText.trim()));
        });
      }, site.rowSelector, site.columnSelector, site.columnSelectorHead);    
    }

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

const scheduleScraping = async (site, crawlModel) => {
  return new Promise((resolve) => {
    // Lập lịch crawler chạy mỗi ngày lúc 21h
    cron.schedule('0 21 * * *', async () => {
      console.log(`Đang chạy crawler cho ${site.name}...`);
      try {
        await scrapeSite(site, crawlModel);
        resolve(); // Đánh dấu hoàn thành sau khi scrape xong
      } catch (error) {
        console.error(`Lỗi khi chạy crawler cho ${site.name}:`, error);
        resolve(); // Vẫn đánh dấu hoàn thành để không treo Promise
      }
    });
  });
};

const scheduleScrapingExchangeRate = (site, crawlModel) => {
  // Lập lịch crawler chạy mỗi 50 phút
  cron.schedule('*/50 * * * *', async () => {
    console.log(`Đang chạy crawler cho ${site.name}...`);
    try {
      await scrapeSite(site, crawlModel);
    } catch (error) {
      console.error(`Lỗi khi chạy crawler cho ${site.name}:`, error);
    }
  });
};


module.exports = {
  scrapeSite,
  scheduleScraping,
  scheduleScrapingExchangeRate
}
