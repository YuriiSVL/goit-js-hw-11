import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ApiService from './api-service';

const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

let lightbox = new SimpleLightbox('.gallery a');

const apiService = new ApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  apiService.query = e.currentTarget.elements.searchQuery.value;

  if (apiService.query.trim() === '') {
    return Notiflix.Notify.failure(
      'Sorry, the search query should not be empty'
    );
  }

  apiService.resetData();
  clearGallery();

  try {
    refs.loadMoreBtn.classList.add('is-hidden');
    const images = await apiService.fetchImages();

    if (images.hits.length === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    renderQueryImageCards(images.hits);
    refs.loadMoreBtn.classList.remove('is-hidden');

    Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);

    checkIsEndOfImages();
  } catch (error) {
    console.error('caught error: ', error);
  }
}

function renderQueryImageCards(arrOfImages) {
  const markup = arrOfImages
    .map(image => {
      return `<div class="photo-card">
  <a href="${image.largeImageURL}"
    ><img
    
      src="${image.webformatURL}"
      alt="${image.tags}"
      loading="lazy"
  /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${image.likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${image.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${image.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${image.downloads}</span>
    </p>
  </div>
</div>`;
    })
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
}

async function onLoadMore() {
  try {
    const images = await apiService.fetchImages();

    renderQueryImageCards(images.hits);
    checkIsEndOfImages();
  } catch (error) {
    console.error(error);
  }

  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function checkIsEndOfImages() {
  if (apiService.endOfCollection) {
    refs.loadMoreBtn.classList.add('is-hidden');
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
