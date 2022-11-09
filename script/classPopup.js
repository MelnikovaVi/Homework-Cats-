// Класс модального окна

export class Popup {
    constructor(className) {
      this.className = className;
      this.popup = document.querySelector(`.${className}`);
      this._exitToEscape = this._exitToEscape.bind(this)
    }
    
    open() {
      this.popup.classList.add('popup_active');
      document.addEventListener('keyup', this._exitToEscape)
    }
  
    close() {
      this.popup.classList.remove('popup_active');
      document.removeEventListener('keyup', this._exitToEscape)
    }
  
    // устанавливает автоматические обработчики закрытия на кнопку и мимо формы
    setEventListener () {
        this.popup.addEventListener('click', (event) => {
            if(event.target.classList.contains(this.className) || event.target.closest('.popup__close')) {
                this.close()
            }
        })
    }

    // закрытие на Esc
    _exitToEscape (event) {
        if (event.key === 'Escape') {
            this.close()
        }
    }

    // метод вставки/подмены информации в форму (для попапа с детальной информацией по каждому коту) 
    setContent (contentNode) {
      const content = this.popup.querySelector('.popup__container');
      content.innerHTML = '';
      content.append(contentNode)
    }
  }