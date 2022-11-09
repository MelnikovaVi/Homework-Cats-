
// функция склонения возраста
export function wordForm (n, text_forms) {  
    n = Math.abs(n) % 100; 
    let n1 = n % 10;
    if (n > 10 && n < 20) { return text_forms[2]; }
    if (n1 > 1 && n1 < 5) { return text_forms[1]; }
    if (n1 == 1) { return text_forms[0]; }
    return text_forms[2];
}

// функция генератор рейтинга
const MAX_RATE_CAT = 10;

export function rating (rate) {
    const rating = [];
    for (let i = 0; i < MAX_RATE_CAT; i++) {
        if (i < rate && rate % 1 === 0) {
            rating.push('<i class="fa-solid fa-star"></i>')
        } else if (i < Math.floor(rate) && rate % 1 !==0) {
            rating.push('<i class="fa-solid fa-star"></i>')
        } else if (i === Math.floor(rate) && rate % 1 !== 0) {
            rating.push('<i class="fa-solid fa-star-half"></i>')
        } else {
            rating.push('<i class="fa-regular fa-star"></i>')
        }
    }
    return rating.join('');
}

