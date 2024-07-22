import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';
import { loadSearchResults } from '../model';
import View from './View';

class Recipeview extends View {
  _parentElement = document.querySelector('.recipe');
  _messagefail = 'there is some problem with the data';
  _messagesuccess = 'everything fime';
  _gay = document.querySelector('.recipe__info-buttons');

  addHandlerRender(call) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, call));
  }

  renderSuccess(message = this._messagesuccess) {
    this.clear();
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}.svg#icon-alert-triangle"></use>
              </svg>
            </div>
            <p${message}</p>
          </div>`;
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  addHandlerserving(call) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--tiny');
      if (!btn) return;
      const updateTo = +btn.dataset.updateTo;
      if (updateTo > 0) call(updateTo);
    });
  }

  addHandlerAddBookmark(call) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      call();
    });
  }

  _generateMarkup() {
    return `
        <figure class="recipe__fig">
          <img src="${this._data.image}" alt="Tomato" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}.svg#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}.svg#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings - 1
              }"
              >
                <svg>
                  <use href="${icons}.svg#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings + 1
              }">
                <svg>
                  <use href="${icons}.svg#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? 'fill' : ''
    }"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${this._data.ingredients
              .map(this._generateMarkupIngredient)
              .join('')}
      

          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="src/img/icons${icons}.svg#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;
  }

  _generateMarkupIngredient(item) {
    return `
    <li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="${icons}.svg#icon-check"></use>
      </svg>
      <div class="recipe__quantity">${new Fraction(
        item.quantity
      ).toString()}</div>
      <div class="recipe__description">
        <span class="recipe__unit">${item.unit}</span>
        ${item.description}
      </div>
    </li>`;
  }
}

export default new Recipeview();
