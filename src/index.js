import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';
import ApiService from './api-service';

const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const apiService = new ApiService();

async function onSearch(e) {
  e.preventDefault();

  apiService.query = e.currentTarget.elements.searchQuery.value;
  refs.loadMoreBtn.classList.add('--is-hidden');

  if (apiService.query.trim() === '') {
    return Notiflix.Notify.failure(
      'Sorry, the search query should not be empty'
    );
  }
  apiService.resetPage();
  apiService.resetNumberOfLoadedImages();

  const images = await apiService.fetchImages();

  try {
    if (images.hits.length === 0) {
      refs.loadMoreBtn.classList.add('--is-hidden');
      return Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    refs.loadMoreBtn.classList.remove('--is-hidden');
    clearGallery();
    renderQueryImageCard(images.hits);

    Notiflix.Notify.info(`Hooray! We found ${images.totalHits} images.`);
  } catch (error) {
    console.error('caught error: ', error);
  }
}

// function onSearch(e) {
//   e.preventDefault();

//   apiService.query = e.currentTarget.elements.searchQuery.value;
//   refs.loadMoreBtn.classList.add('--is-hidden');
//   if (apiService.query.trim() === '') {
//     return Notiflix.Notify.failure(
//       'Sorry, the search query should not be empty'
//     );
//   }
//   apiService.resetPage();
//   apiService.resetNumberOfLoadedImages();

//   apiService.fetchImages().then(images => {
//     if (images.hits.length === 0) {
//       refs.loadMoreBtn.classList.add('--is-hidden');
//       return Notiflix.Notify.info(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     }

//     refs.loadMoreBtn.classList.remove('--is-hidden');
//     clearGallery();
//     renderQueryImageCard(images.hits);
//   });
// }

function renderQueryImageCard(arrOfImages) {
  const markup = arrOfImages
    .map(image => {
      return `<div class="photo-card">
  <a href="${image.largeImageURL}"><img width="370" heigth="270" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>${image.likes}</b>
    </p>
    <p class="info-item">
      <b>${image.views}</b>
    </p>
    <p class="info-item">
      <b>${image.comments}</b>
    </p>
    <p class="info-item">
      <b>${image.downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);

  let lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });

  // let infScroll = new InfiniteScroll('.gallery', {
  //   // options
  //   path: '.pagination__next',
  //   append: '.post',
  //   history: false,
  // });
}

async function onLoadMore() {
  const images = await apiService.fetchImages();
  if (apiService.numberOfLoadedImages >= apiService.numberOfImages) {
    refs.loadMoreBtn.classList.add('--is-hidden');
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
  renderQueryImageCard(images.hits);
}

// function onLoadMore() {
//   apiService.fetchImages().then(images => {
//     if (apiService.numberOfLoadedImages >= apiService.numberOfImages) {
//       refs.loadMoreBtn.classList.add('--is-hidden');
//       Notiflix.Notify.info(
//         "We're sorry, but you've reached the end of search results."
//       );
//     }
//     renderQueryImageCard(images.hits);
//   });
// }

function clearGallery() {
  refs.gallery.innerHTML = '';
}
