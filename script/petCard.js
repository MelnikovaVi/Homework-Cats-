// класс создающий карточки для отображения котов

export class PetCard {
    constructor (petInfoFromDB, cardView, showCardDetail, showImg, changeLike) {
        this.petInfoFromDB = petInfoFromDB;
        this.showCardDetail = showCardDetail;
        this.showImg = showImg;
        this.cardView = cardView;
        this.changeLike = changeLike;
    }
    
    // метод получения(поиск) содержимого шаблона - приватный
    _getTemplate () {
        return document.querySelector(this.cardView).content.querySelector('.card');
    }

    // метод получения элементов шаблона и клонирование - публичный
    getElement () {
        this.element = this._getTemplate().cloneNode(true);

        // для Текущего элемента 1) ищем разметку шаблона из index.html и 2) сопоставляем с данными из БД (например, в index.html в #card-template - card__image сопоставляется с img_link в animals, а card__name с name и тд.)
        
        this.cardPetName = this.element.querySelector('.card__name');
        this.cardPetImg =  this.element.querySelector('.card__image');
        this.cardLike =  this.element.querySelector('.card__like');
        
        this.updateView();
        this.setEventListener();
        return this.element
    }

    updateCardLike() {
        if(this.petInfoFromDB.favourite) {
            this.cardLike.classList.add('card__like_active')
        } else {
            this.cardLike.classList.remove('card__like_active')
        }
    }

    setLikeCat = () => {
        this.petInfoFromDB.favourite = !this.petInfoFromDB.favourite;
        this.updateView(this.petInfoFromDB, this)

        this.changeLike(this.petInfoFromDB)
    }

    setEventListener() {
        this.cardPetName.addEventListener('click', ()=> this.showCardDetail(this))
        this.cardPetImg.addEventListener('click', ()=> this.showImg(this.petInfoFromDB))
        this.cardLike.addEventListener('click', this.setLikeCat)
    }

    getData() {
        return this.petInfoFromDB;
    }

    getId() {
        return this.petInfoFromDB.id;
    }

    setNewData(newData) {
        return this.petInfoFromDB = newData;
    }

    deleteCard() {
        this.element.remove();
        this.element = null;
    }

    updateView() {
        this.cardPetName.textContent = this.petInfoFromDB.name;
        this.cardPetImg.src = this.petInfoFromDB.img_link;
        this.updateCardLike();
    }
}

