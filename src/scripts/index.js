import "../pages/index.css";
import { createCard, handleLike, handleDelete } from "../components/card.js";
import { openPopup, closePopup, handleOverlayClick } from "../components/modal.js";
import { enableValidation, clearValidation } from './validation.js';
import { 
  getUserInfo, 
  getInitialCards, 
  updateProfile, 
  addNewCard, 
  deleteCard, 
  likeCard, 
  unlikeCard,
  updateAvatar
} from './api.js';

// DOM элементы
const elements = {
  // Основные элементы
  cardsContainer: document.querySelector(".places__list"),
  addButton: document.querySelector(".profile__add-button"),
  profileEditButton: document.querySelector(".profile__edit-button"),
  
  // Элементы профиля
  profileTitle: document.querySelector(".profile__title"),
  profileDescription: document.querySelector(".profile__description"),
  profileImage: document.querySelector('.profile__image'),
  avatarEditButton: document.querySelector('.profile__image-avatar-edit'),
  
  // Попапы
  popupTypeEdit: document.querySelector(".popup_type_edit"),
  popupTypeNewCard: document.querySelector(".popup_type_new-card"),
  popupTypeImage: document.querySelector(".popup_type_image"),
  avatarPopup: document.querySelector('.popup_type_avatar'),
  
  // Формы
  formEditProfile: document.forms["edit-profile"],
  formNewPlace: document.forms["new-place"],
  avatarForm: document.forms['avatar-form'],
  
  // Поля ввода
  nameInput: document.querySelector(".popup__input_type_name"),
  jobInput: document.querySelector(".popup__input_type_description"),
  cardNameInput: document.querySelector(".popup__input_type_card-name"),
  cardLinkInput: document.querySelector(".popup__input_type_url"),
  avatarUrlInput: document.querySelector(".popup__input_type_url"),
  
  // Элементы попапа изображения
  popupImage: document.querySelector(".popup__image"),
  popupCaption: document.querySelector(".popup__caption")
};

// Настройки валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

let userId;

// Инициализация приложения
function initApp() {
  setupEventListeners();
  enableValidation(validationConfig);
  loadInitialData();
}

// Загрузка начальных данных
function loadInitialData() {
  Promise.all([getUserInfo(), getInitialCards()])
    .then(([userData, cards]) => {
      userId = userData._id;
      updateProfileInfo(userData);
      renderInitialCards(cards);
    })
    .catch(console.error);
}

// Обновление информации профиля
function updateProfileInfo(userData) {
  elements.profileTitle.textContent = userData.name;
  elements.profileDescription.textContent = userData.about;
  elements.profileImage.style.backgroundImage = `url(${userData.avatar})`;
}

// Отрисовка начальных карточек
function renderInitialCards(cards) {
  cards.forEach(card => {
    renderCard(card);
  });
}

// Отрисовка одной карточки
function renderCard(cardData) {
  const cardElement = createCard(
    cardData, 
    userId, 
    handleCardClick, 
    handleLikeClick, 
    handleDeleteClick
  );
  elements.cardsContainer.append(cardElement);
}

// Установка обработчиков событий
function setupEventListeners() {
  // Закрытие попапов
  document.querySelectorAll(".popup__close").forEach(button => {
    button.addEventListener("click", () => {
      const popup = button.closest(".popup");
      closePopup(popup);
    });
  });

  // Клик по оверлею
  document.querySelectorAll(".popup").forEach(popup => {
    popup.addEventListener("mousedown", handleOverlayClick);
  });

  // Открытие попапа редактирования профиля
  elements.profileEditButton.addEventListener("click", () => {
    elements.nameInput.value = elements.profileTitle.textContent;
    elements.jobInput.value = elements.profileDescription.textContent;
    clearValidation(elements.formEditProfile, validationConfig);
    openPopup(elements.popupTypeEdit);
  });

  // Открытие попапа добавления карточки
  elements.addButton.addEventListener("click", () => {
    clearValidation(elements.formNewPlace, validationConfig);
    openPopup(elements.popupTypeNewCard);
  });

  // Открытие попапа аватара
  elements.profileImage.addEventListener("click", () => {
    clearValidation(elements.avatarForm, validationConfig);
    openPopup(elements.avatarPopup);
  });

  // Отправка форм
  elements.formEditProfile.addEventListener("submit", handleEditProfileSubmit);
  elements.formNewPlace.addEventListener("submit", handleAddCardSubmit);
  elements.avatarForm.addEventListener("submit", handleAvatarSubmit);
}

// Обработчик клика по карточке
function handleCardClick(name, link) {
  elements.popupImage.src = link;
  elements.popupImage.alt = name;
  elements.popupCaption.textContent = name;
  openPopup(elements.popupTypeImage);
}

// Обработчик лайка карточки
function handleLikeClick(likeButton, cardId, likeCounter) {
  return handleLike(likeButton, cardId, likeCounter);
}

// Обработчик удаления карточки
function handleDeleteClick(cardElement, cardId) {
  return handleDelete(cardElement, cardId);
}

// Обработчик формы редактирования профиля
function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  
  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';

  updateProfile(elements.nameInput.value, elements.jobInput.value)
    .then(updateProfileInfo)
    .then(() => closePopup(elements.popupTypeEdit))
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = initialText;
    });
}

// Обработчик формы добавления карточки
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  
  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;
  submitButton.textContent = 'Создание...';

  addNewCard(elements.cardNameInput.value, elements.cardLinkInput.value)
    .then(renderCard)
    .then(() => {
      elements.formNewPlace.reset();
      closePopup(elements.popupTypeNewCard);
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = initialText;
    });
}

// Обработчик формы аватара
function handleAvatarSubmit(evt) {
  evt.preventDefault();
  
  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';

  updateAvatar(elements.avatarUrlInput.value)
    .then(userData => {
      elements.profileImage.style.backgroundImage = `url(${userData.avatar})`;
      elements.avatarForm.reset();
      closePopup(elements.avatarPopup);
    })
    .catch(console.error)
    .finally(() => {
      submitButton.textContent = initialText;
    });
}

// Запуск приложения
initApp();