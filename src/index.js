import './sass/main.scss';

import InfiniteScroll from 'infinite-scroll';
import { alert } from '@pnotify/core';
import formtEl from './tamplates/inputEl.hbs';
import picturecard from './tamplates/picturecard.hbs';
// import PNotify styl
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/Material.css';
import 'material-design-icons/iconfont/material-icons.css';

const bodyEl = document.querySelector('body');
bodyEl.insertAdjacentHTML('afterbegin', formtEl());
const container = document.querySelector('.pictures_section--container');
const buttonEl = document.querySelector('.buttonEl');
const inputEl = document.querySelector('.inputEl');
const viewMorButtonEL = document.querySelector('.view-more-button');

const infScroll = new InfiniteScroll('.container', {
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

buttonEl.addEventListener('click', async () => {
  container.innerHTML = '';
  if (inputEl.value.trim() !== '') {
    const response = await fetch(`https://pixabay.com/api/?key=22111577-4bd8860a42557448db0edd034&q=${inputEl.value.trim()}&image_type=photo&page=1&per_page=12`);

    const data = await response.json();
    renderImgCards(data);
  } else {
    viewMorButtonEL.style.visibility = 'hidden';
    return alert({
      text: 'No request',
      type: 'info',
    });
  }
});

infScroll.on('load', function (response) {
  container.insertAdjacentHTML('beforeend',
    picturecard({ pictureDate: response.hits }));
  viewMorButtonEL.style.visibility = 'visible';

  if (this.pageIndex > 1) {
    container.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }
});

function renderImgCards(data) {
  if (data.total === 0) {
    viewMorButtonEL.style.visibility = 'hidden';
    return alert({
      text: 'There are no images for your request.',
      type: 'info',
    });
  }
  if (data.total <= 12) {
    viewMorButtonEL.style.visibility = 'hidden';
    container.insertAdjacentHTML('beforeend',
    picturecard({ pictureDate: data.hits }));
  }

  container.insertAdjacentHTML('beforeend', picturecard({ pictureDate: data.hits }));
  viewMorButtonEL.style.visibility = 'visible';
  infScroll.pageIndex += 1;
}
