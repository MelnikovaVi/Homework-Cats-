import { Popup } from "./classPopup.js";

export class PopupImg extends Popup {
    constructor(className) {
     super (className)
    }
    
    open(petInfoFromDB) {
        const imagePopup = this.popup.querySelector('.popup__show-img');
        imagePopup.src = petInfoFromDB.img_link;
        // super означает что мы используем метод open из класса Popup
        super.open()

    }
  }