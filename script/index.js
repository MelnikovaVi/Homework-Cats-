import { PetCard } from './petCard.js';
import { Popup } from './classPopup.js';
import { api } from './api.js';
import { PopupImg } from './classPopupImg.js';
import { CardDetail } from './cardDetail.js';

// Клиентский код

const cardsPlace = document.querySelector(".cards"); // Место куда выводим котов определяется один раз

/* 
1) Создаем экземпляр класса попапа - открытие формы для добавления котиков;
2) Ищем кнопку, открывающую попап, по id;
3) На эту кнопку вешаем обработчик открытия попапа;
4) Устанавливаем обработчик закрытия попапа;
5) Ищем форму накоторую нужно повесить submit;
6) Вешаем submit на форму. !Важно вешать submit на форму, а  не клик на кнопку
*/

// Форма заполнения карточки кота
const popupAddCat = new Popup("popup-add-cats");
const btnOpenForm = document.querySelector("#addCat");
btnOpenForm.addEventListener("click", () => popupAddCat.open());
popupAddCat.setEventListener();
const formCatAdd = document.querySelector("#popup-form-cat");
formCatAdd.addEventListener("submit", addFormEnter);

// Форма авторизации
const formAddAutoriz = document.querySelector("#popup-form-autorization");
const popupAutorization = new Popup("popup-autorization");
const btnOpenAutorization = document.querySelector("#autorization");
btnOpenAutorization.addEventListener("click", () => popupAutorization.open());
popupAutorization.setEventListener();
formAddAutoriz.addEventListener("submit", addFormEnterAutoriz);


const popupCardDetail = new Popup("popup-card-detail");
popupCardDetail.setEventListener();

const popupShowImg = new PopupImg("popup-show-img");
popupShowImg.setEventListener();

const catCardDetail = new CardDetail('#card-detail-template', editCard, changeLike, catDelete)
const catCardDetailElem = catCardDetail.getElement()

// функция сбора данных: принимает инпуты, проходит по ним и наполняет объект formData по ключам - name, этих инпутов те значения которые в этих инпутах находятся
function collectDataFromForm(elements) {
  const formData = {};
  elements.forEach((input) => {
    if (input.type === "submit") return;
    if (input.type !== "checkbox") {
      formData[input.name] = input.value;
    }
    if (input.type === "checkbox") {
      formData[input.name] = input.checked;
    }
  });
  return formData;
}

// функция действия по сабмиту на formCatAdd
function addFormEnter(e) {
  e.preventDefault();
  // переменная берущая псевдомассив из формы, приводим к массиву спред опратором
  const elementsFormCat = [...formCatAdd.elements];
  const dataFromForm = collectDataFromForm(elementsFormCat);
  api.addNewCat(dataFromForm).then(() => {
    createCat(dataFromForm);
    updateLS(dataFromForm, { type: "NEW_CAT_ADD" });
    popupAddCat.close();
  });
}

// функция действия по сабмиту на formCatAdd
function addFormEnterAutoriz(e) {
  e.preventDefault();
  const elementsFormAutoriz = [...formAddAutoriz.elements];
  const dataFromFormAutoriz = collectDataFromForm(elementsFormAutoriz);
  Cookies.set("email", `email=${dataFromFormAutoriz.email}`);
  Cookies.set("name", `name=${dataFromFormAutoriz.nickname}`);
  btnOpenForm.classList.remove("visually-hidden");
  popupAutorization.close();
}


// функция создания карточки
function createCat(dataCreateCat) {
  const petCard = new PetCard(dataCreateCat, "#card-template", showCardDetail, showImg, changeLike);
  cardsPlace.append(petCard.getElement());
}

//Функция на время обновления локального хранилища
function refresh(minutes) {
  const refreshTime = new Date(new Date().getTime() + minutes * 60000);
  localStorage.setItem("localStorageRefresh", refreshTime);
  return refresh;
}

// Запрос за данными происходит если в локальном хранилище нет данных
// функция проверки локального хранилища
function checkLocalStorage() {
  const fromLocalStorage = JSON.parse(localStorage.getItem("cats")); // достает данные из хранилища (cats - это ключ)
  
  if (fromLocalStorage && fromLocalStorage.length) {
    // если есть данные хранилища fromLocalStorage и fromLocalData.length не 0 , то
    fromLocalStorage.forEach(function (catData) {
      createCat(catData);
    });
  } else {
    api.getAllCats().then(({ data }) => {
      data.forEach(function (catData) {
        createCat(catData);
      });

      updateLS(update, { type: "ALL_CATS" });
      //   localStorage.setItem("cats", JSON.stringify(data)); // когда сервер ответил положительно записать то что вернул сервер
      refresh(10);
    });
  }
}
checkLocalStorage();

//По нажатию на имя кота открывает попап
function showCardDetail (petCard) {
  catCardDetail.setData(petCard)
  popupCardDetail.setContent(catCardDetailElem)
  popupCardDetail.open()
}

function showImg (petInfoFromDB) {
  popupShowImg.open(petInfoFromDB)
}

// Удаление карточки кота в детальной информации
function catDelete (petCard) {
  api.deleteCatById(petCard.getId())
    .then (() => {
      petCard.deleteCard()
      updateLS(petCard.getData(), {type: 'DELETE_CAT'})
      popupCardDetail.close()
    })
}

//
function editCard (petCard, data) {
  const {name, age, description, id} = data;
  api.updateCatById(id, {name, age, description})
  .then(()=> {
    petCard.setData(data);
    petCard.updateView(data, {type:'EDIT_CAT'});
    updateLS()
  })
}

function changeLike (data, petCard) {
  const {id, favourite} = data;
  api.updateCatById(id, {favourite})
  .then(()=> {
    if(petCard) {
      petCard.setData(data);
      petCard.updateView();
      updateLS(data, {type:'EDIT_CAT'});
      console.log('Лайк изменен');
    }
  })
}

const isAutorizEmail = Cookies.get("email");
if (!isAutorizEmail) {
  popupAutorization.open();
  btnOpenForm.classList.add("visually-hidden");
}

const isAutorizNick = Cookies.get("nickname");
if (!isAutorizNick) {
  popupAutorization.open();
  btnOpenForm.classList.add("visually-hidden");
}

function updateLS(update, action) {
  const oldLS = JSON.parse(localStorage.getItem("cats"));

  switch (action.type) {
    case "NEW_CAT_ADD":
      oldLS.push(update);
      localStorage.setItem("cats", JSON.stringify(oldLS));
      return;
    case "ALL_CATS":
      localStorage.setItem("cats", JSON.stringify(update));
      setDataRefresh(MAX_LIVE_STORAGE, "catsRefresh");
      return;
    case 'EDIT_CAT':
      const updateLS = oldLS.map(cat => cat.id === data.id ? data: cat);
      localStorage.setItem("cats", JSON.stringify(updateLS));
      return;
    case "DELETE_CAT":
      const newLS = oldLS.filter((cat) => cat.id !== update.id);
      localStorage.setItem("cats", JSON.stringify(newLS));
      return;
    default:
      break;
  }
}
