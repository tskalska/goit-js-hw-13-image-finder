import './sass/main.scss';
// import {fetchPictures} from './fetchPictures';
import formtEl from './tamplates/inputEl.hbs';
import picturecard from './tamplates/picturecard.hbs';
import InfiniteScroll from 'infinite-scroll';
import { alert, defaultModules } from '@pnotify/core';
// import PNotify styl
import'@pnotify/core/dist/PNotify.css';
import'@pnotify/core/dist/BrightTheme.css';
import'@pnotify/core/dist/Material.css';
import'material-design-icons/iconfont/material-icons.css';


const bodyEl = document.querySelector("body");
bodyEl.insertAdjacentHTML('afterbegin', formtEl());
const container = document.querySelector(".pictures_section--container");
const buttonEl = document.querySelector(".buttonEl");
const inputEl = document.querySelector(".inputEl");
const viewMorButtonEL = document.querySelector(".view-more-button")

const infScroll = new InfiniteScroll( '.container', {
  path() {
    const cardsOnPage = 12;
    return `https://pixabay.com/api/?key=22111577-4bd8860a42557448db0edd034&q=${inputEl.value.trim()}&image_type=photo&page=${this.pageIndex}&per_page=${cardsOnPage}`;
  },
  button: '.view-more-button',
  // using button, disable loading on scroll 
  scrollThreshold: false,
  status: '.page-load-status',
  history: false,
  responseBody: 'json',
});

buttonEl.addEventListener('click', () => {
  container.innerHTML = '';
  if (inputEl.value.trim() !==''){
    return infScroll.loadNextPage()
  }
  else {
    return alert({
      text: "No request",
      type: 'info',
    });
  }
});


infScroll.on('load', function(response) {
  if (response.total === 0 || response.total<=12){
    viewMorButtonEL.style.visibility = "hidden";
    return alert({
      text: "There are no images for your request.",
      type: 'info',
    });
  }
  else {
    container.insertAdjacentHTML('beforeend',
      picturecard({pictureDate: response.hits})
    )
    viewMorButtonEL.style.visibility = "visible";
  }
})
