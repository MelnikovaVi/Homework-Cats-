import { wordForm, rating} from './utilit.js'

export class CardDetail {
    constructor (cardView, editCard, changeLike, catDelete)
    {
        this.cardView = cardView;
        this.editCard = editCard;
        this.changeLike = changeLike;
        this.catDelete = catDelete;
        this.data = {};
    }

    // метод наполнения объекта _data (из карточки передать в класс cardDetail)
    setData (petCard) {
        this.petCard = petCard;
        this.data = this.petCard.getData();
        
        this.catName.textContent = this.data.name;
        this.catImg.src = this.data.img_link;
        // this.catId.textContent = this.data.id;
        this.catAgeVal.textContent = this.data.age;
        this.catDescription.textContent = this.data.description;
        this.catAgeText.textContent = wordForm(this.data.age,['год', 'года', 'лет']);
        this.catRate.innerHTML = rating(this.data.rate);

        this.updateLike()
    }

    // метод получения(поиск) содержимого шаблона - приватный
    _getTemplate () {
        return document.querySelector(this.cardView).content.querySelector('.card-detail');
    }

    // метод получения элементов шаблона и клонирование - публичный
    getElement () {
        this.element = this._getTemplate().cloneNode(true);

        this.btnEdit = this.element.querySelector('.card-detail__edit');
        this.btnSave = this.element.querySelector('.card-detail__save');
        this.btnDelete = this.element.querySelector('.card-detail__delete');
        this.btnLike = this.element.querySelector('.card-detail__favourite');

        this.catImg = this.element.querySelector('.card-detail__img');
        this.catId = this.element.querySelector('.card-detail__id');
        this.catTitle = this.element.querySelector('.card-detail__title');
        this.catName = this.element.querySelector('.card-detail__name');
        this.catRate = this.element.querySelector('.card-detail__rate');
        this.catAgeVal = this.element.querySelector('.card-detail__age-val');
        this.catAgeText = this.element.querySelector('.card-detail__age-text');
        this.catDescription = this.element.querySelector('.card-detail__description');

        this.setEventListener();

        return this.element;
    }

    setEventListener() {
        this.btnDelete.addEventListener('click', () => this.catDelete(this.petCard));
        this.btnEdit.addEventListener('click', this._toggleContentEditable);
        this.btnSave.addEventListener('click', this._savedDataCat);
        this.btnLike.addEventListener('click', this.setLike);
    }

    // добавление /удаление доп класса hidden для отображения/удаления значков редактирования/сохранения
    _toggleContentEditable = () => {
    this.btnEdit.classList.toggle('card-detail__edit_hidden');
    this.btnSave.classList.toggle('card-detail__saved_hidden');
  
    this.catName.contentEditable = !this.catName.iscontentEditable;
    this.catAgeVal.contentEditable = !this.catAgeVal.iscontentEditable;
    this.catDescription.contentEditable = !this.catDescription.iscontentEditable;
    } 
  
    _savedDataCat = () => {
    this._toggleContentEditable();
    this.data.name = this.catName.textContent;
    this.data.age = Number(this.catAgeVal.textContent);
    this.data.description = this.catDescription.textContent;
    this.editCard(this.petCard, this.data)
    }

    updateLike() {
        if(this.data.favourite) {
            this.btnLike.classList.add('card-detail__favourite_active')
        } else {
            this.btnLike.classList.remove('card-detail__favourite_active')
        }
    }

    setLike = () => {
        this.data.favourite = !this.data.favourite;
        this.updateLike();
        this.changeLike(this.data, this.petCard)
    }
}