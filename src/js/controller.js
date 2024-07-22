import * as model from './model.js';
import { FETCH_URL } from './config.js';

import paginationview from './views/paginationview.js';
import searchView from './views/searchView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeview from './views/recipeview.js';
import resultsView from './views/resultsView.js';
import bookmarksview from './views/bookmarksview.js';
import addRecipeview from './views/addRecipeview.js';
import { View } from './views/View.js';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeview.renderSpinner();
    resultsView.update(model.gerSearchResultspage());
    bookmarksview.update(model.state.bookmarks);
    //await needed as promise returned otherwise code will continue execution
    await model.loadRecipe(id);
    recipeview.render(model.state.recipe);
    console.log(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeview.renderError();
  }
};

const controlSearch = async function () {
  try {
    const query = searchView.getQuery();
    resultsView.renderSpinner();
    if (!query) return;
    await model.loadSearchResults(query);
    //for (let i = 0; i < model.state.search.results.length / 10; i++) {
    // resultsView.render(model.state.search.results.slice(0, 10));
    //}
    resultsView.render(model.gerSearchResultspage(1));
    paginationview.render(model.state.search);
  } catch (err) {
    console.log(err);
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.gerSearchResultspage(goToPage));
  paginationview.render(model.state.search);
};
const controlsevings = function (servings) {
  model.loadServingresults(servings);
  recipeview.update(model.state.recipe);
};
const controlBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  console.log(model.state.recipe);
  recipeview.update(model.state.recipe);

  bookmarksview.render(model.state.bookmarks);
};

const controlBookmarkprev = function () {
  bookmarksview.render(model.state.bookmarks);
};

const conntrolAddRecipe = async function (newrecipe) {
  try {
    addRecipeview.renderSpinner();

    await model.uploadRecipe(newrecipe);
    recipeview.render(model.state.recipe);

    addRecipeview.renderError();
    bookmarksview.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(function () {
      addRecipeview.toggleWindow();
    }, 2500);
  } catch (err) {
    console.error('❤️❤️', err);
    addRecipeview.renderError(err.message);
  }
};
const init = function () {
  bookmarksview.addHandlerRender(controlBookmarkprev);
  recipeview.addHandlerRender(controlRecipe);

  recipeview.addHandlerserving(controlsevings);
  recipeview.addHandlerAddBookmark(controlBookmark);
  searchView.addHandlerSearch(controlSearch);
  paginationview._addhandlerclick(controlPagination);
  addRecipeview.addHandlerUpload(conntrolAddRecipe);
};
init();
