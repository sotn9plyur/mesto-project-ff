export function createCard(
  cardData,
  handleCardClick,
  handleLike,
  handleDelete
) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  cardTitle.textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;

  cardImage.addEventListener("click", () =>
    handleCardClick(cardData.name, cardData.link)
  );
  likeButton.addEventListener("click", handleLike);
  deleteButton.addEventListener("click", () => handleDelete(cardElement));

  return cardElement;
}

export function handleLike(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}

export function handleDelete(cardElement) {
  cardElement.remove();
}
