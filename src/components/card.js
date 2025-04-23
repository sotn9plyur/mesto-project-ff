import { 
  deleteCard as apiDeleteCard,
  likeCard as apiLikeCard,
  unlikeCard as apiUnlikeCard 
} from '../scripts/api.js';

export function createCard(cardData, userId, handleCardClick, handleLikeClick, handleDeleteClick) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeCounter = cardElement.querySelector('.card-like-counter');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCounter.textContent = cardData.likes.length;

  if (cardData.likes.some(like => like._id === userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  if (cardData.owner._id !== userId) {
    deleteButton.style.display = 'none';
  }

  cardImage.addEventListener('click', () => handleCardClick(cardData.name, cardData.link));
  likeButton.addEventListener('click', () => handleLikeClick(likeButton, cardData._id, likeCounter));
  deleteButton.addEventListener('click', () => handleDeleteClick(cardElement, cardData._id));

  return cardElement;
}

export function handleLike(likeButton, cardId, likeCounter) {
  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  const likePromise = isLiked ? apiUnlikeCard(cardId) : apiLikeCard(cardId);

  return likePromise
    .then(updatedCard => {
      likeButton.classList.toggle('card__like-button_is-active');
      likeCounter.textContent = updatedCard.likes.length;
      return updatedCard;
    })
    .catch(err => {
      console.error('Ошибка:', err);
      throw err;
    });
}

export function handleDelete(cardElement, cardId) {
  return apiDeleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch(err => {
      console.error('Ошибка:', err);
      throw err;
    });
}