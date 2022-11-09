// GET https://sb-cats.herokuapp.com/api/show - отобразить всех котиков
// GET https://sb-cats.herokuapp.com/api/ids - отобразить все возможные айди котиков
// GET https://sb-cats.herokuapp.com/api/show/:id  - отобразить конкретного котика
// POST https://sb-cats.herokuapp.com/api/add - добавить котика
// PUT https://sb-cats.herokuapp.com/api/update/:id - изменить информацию о котике
// DELETE  https://sb-cats.herokuapp.com/api/:id - удалить котика из базы данных
// http://sb-cats.herokuapp.com/api/2/<name>/delete/<id кота>

const CONFIG_API = {
    url: 'https://sb-cats.herokuapp.com/api/2/mlnkvvi',
    headers: {
        'Content-type': 'application/json'
    }
}

class Api {
    constructor(config){
        this._url = config.url;
        this._headers = config.headers;
    }
    
    //получаем всех котов из БД
    getAllCats(){
        return fetch(`${this._url}/show`, {
            method: 'GET'
        }).then(this._onResponse)
    }
        
    //добавление нового кота
    addNewCat(data){
        return fetch(`${this._url}/add`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: this._headers
        }).then(this._onResponse)
    }

    // для обновления кота
    updateCatById(idCat, data){
        return fetch(`${this._url}/update/${idCat}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: this._headers
        }).then(this._onResponse)
    }

    // получить кота по id
    getCatById(idCat){
        return fetch(`${this._url}/show/${idCat}`, {
            method: 'GET',
        }).then(this._onResponse)
    }

    // удалить кота по id
    deleteCatById(idCat){
        return fetch(`${this._url}/delete/${idCat}`, {
            method: 'DELETE',
        }).then(this._onResponse)
    }

    // метод для первого обращения к then, чтобы код не повторялся (добавили в функции getAllCats и addNewCat)
    _onResponse(res){
        return res.ok ? res.json() : Promise.reject({...res, message: "Ошибка на стороне сервера"})
    }
}

export const api = new Api(CONFIG_API);




//после того как написали приватный метод _onResponse перезаписываем более универсально и нижний код мне не нужен
        // .then((res)=>{
            //     return res.ok ? res.json() : Promise.reject({...res, message: "Ошибка на стороне сервера"})
            // }) // если ответ ок то вернуть файл json, или отклоненный промис
            // .then((data)=>{ // получение данных
            //     // сюда в data попадет res.json()
            //     console.log(data);
            // })
            // json - метод, который предоставляет fetch на объекте response (этот метод асинхронный) и вернет данные в формате json
            // у класса Promise есть статичные методы, например reject - он создает и возвращает промис сразу отклоненным