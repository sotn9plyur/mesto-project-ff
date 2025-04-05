import "../pages/index.css";
import { initialCards } from "./cards.js";
import {
  openPopup,
  closePopup,
  handleOverlayClick,
} from "../components/modal.js";
import { createCard, handleLike, handleDelete } from "../components/card.js";

const cardsContainer = document.querySelector(".places__list");
const addButton = document.querySelector(".profile__add-button");
const profileDescription = document.querySelector(".profile__description");
const profileEditButton = document.querySelector(".profile__edit-button");

const popupTypeEdit = document.querySelector(".popup_type_edit");
const popupTypeNewCard = document.querySelector(".popup_type_new-card");
const popupTypeImage = document.querySelector(".popup_type_image");

const popupNameInput = document.querySelector(".popup__input_type_card-name");
const popupInputTypeUrl = document.querySelector(".popup__input_type_url");

const nameInput = document.querySelector(".popup__input_type_name");
const jobInput = document.querySelector(".popup__input_type_description");

const popupImage = document.querySelector(".popup__image");
const popupCaption = document.querySelector(".popup__caption");

const profileTitle = document.querySelector(".profile__title");

const formNewPlace = document.forms["new-place"];
const formEditProfile = document.forms["edit-profile"];

function handleCardClick(name, link) {
  popupImage.src = link;
  popupImage.alt = `Фотография ${name}`;
  popupCaption.textContent = name;
  openPopup(popupTypeImage);
}

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closePopup(popupTypeEdit);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const cardData = {
    name: popupNameInput.value,
    link: popupInputTypeUrl.value,
  };

  const newCard = createCard(
    cardData,
    handleCardClick,
    handleLike,
    handleDelete
  );
  cardsContainer.prepend(newCard);

  formNewPlace.reset();
  closePopup(popupTypeNewCard);
}

document.querySelectorAll(".popup__close").forEach((button) => {
  button.addEventListener("click", () => {
    const popup = button.closest(".popup");
    closePopup(popup);
  });
});

document.querySelectorAll(".popup").forEach((popup) => {
  popup.addEventListener("mousedown", handleOverlayClick);
});

initialCards.forEach((card) => {
  cardsContainer.append(
    createCard(card, handleCardClick, handleLike, handleDelete)
  );
});

profileEditButton.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openPopup(popupTypeEdit);
});

addButton.addEventListener("click", () => {
  openPopup(popupTypeNewCard);
});

formEditProfile.addEventListener("submit", handleEditProfileSubmit);
formNewPlace.addEventListener("submit", handleAddCardSubmit);

initPopupCloseHandlers();
