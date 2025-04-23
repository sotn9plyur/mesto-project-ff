// validation.js

// Функция показа ошибки
function showInputError(formElement, inputElement, errorMessage, config) {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    if (!errorElement) return;
    
    inputElement.classList.add(config.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
  }
  
  // Функция скрытия ошибки
  function hideInputError(formElement, inputElement, config) {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    if (!errorElement) return;
    
    inputElement.classList.remove(config.inputErrorClass);
    errorElement.textContent = '';
    errorElement.classList.remove(config.errorClass);
  }
  
  // Функция проверки валидности поля
  function checkInputValidity(formElement, inputElement, config) {
    if (inputElement.validity.patternMismatch) {
      inputElement.setCustomValidity(inputElement.dataset.errorMessage || 'Некорректный формат');
    } else {
      inputElement.setCustomValidity("");
    }
  
    if (!inputElement.validity.valid) {
      showInputError(formElement, inputElement, inputElement.validationMessage, config);
    } else {
      hideInputError(formElement, inputElement, config);
    }
  }
  
  // Функция проверки невалидных полей
  function hasInvalidInput(inputList) {
    return inputList.some(inputElement => !inputElement.validity.valid);
  }
  
  // Функция изменения состояния кнопки
  function toggleButtonState(inputList, buttonElement, config) {
    if (hasInvalidInput(inputList)) {
      disableButton(buttonElement, config);
    } else {
      enableButton(buttonElement, config);
    }
  }
  
  // Включение кнопки
  function enableButton(buttonElement, config) {
    buttonElement.disabled = false;
    buttonElement.classList.remove(config.inactiveButtonClass);
  }
  
  // Отключение кнопки
  function disableButton(buttonElement, config) {
    buttonElement.disabled = true;
    buttonElement.classList.add(config.inactiveButtonClass);
  }
  
  // Установка обработчиков событий
  function setEventListeners(formElement, config) {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);
  
    toggleButtonState(inputList, buttonElement, config);
  
    inputList.forEach(inputElement => {
      inputElement.addEventListener('input', () => {
        checkInputValidity(formElement, inputElement, config);
        toggleButtonState(inputList, buttonElement, config);
      });
    });
  }
  
  // Включение валидации всех форм
  export function enableValidation(config) {
    const formList = Array.from(document.querySelectorAll(config.formSelector));
    formList.forEach(formElement => {
      setEventListeners(formElement, config);
    });
  }
  
  // Очистка ошибок валидации
  export function clearValidation(formElement, config) {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);
  
    inputList.forEach(inputElement => {
      hideInputError(formElement, inputElement, config);
      inputElement.setCustomValidity("");
    });
  
    if (buttonElement) {
      disableButton(buttonElement, config);
    }
  }