import puppeteer from "puppeteer";
import fs from "fs"

const scrape = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const allBooks = [];
    let currentPage = 1;
    let maxPages = 10;

    while (currentPage <= maxPages) {

        const url = `https://books.toscrape.com/catalogue/page-${currentPage}.html`
        await page.goto(url);

        const books = await page.evaluate(() => {
            const booksElements = document.querySelectorAll('.product_pod');
            return Array.from(booksElements).map((book) => {
                const title = book.querySelector('h3 a').getAttribute('title');
                const price = book.querySelector('.price_color').textContent;
                const stock = book.querySelector('.instock.availability') ? 'In Stock' : ' Out Of Stock';
                const rating = book.querySelector('.star-rating').className.split(' ')[1];
                const link = book.querySelector('h3 a').getAttribute('href');
                return {
                    title,
                    price,
                    stock,
                    rating,
                    link
                }
            })
        });

        allBooks.push(...books);
        console.log(`Books on page ${currentPage}: `, books)
        currentPage++
    }




    fs.writeFileSync('book.json', JSON.stringify(allBooks, null, 2));

    console.log(allBooks);

    await browser.close();
};

scrape();