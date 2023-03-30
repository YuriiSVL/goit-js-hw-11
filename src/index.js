import Notiflix from 'notiflix';

const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

class ApiService {
  constructor() {
    this.serchQuery = '';
    this.page = 1;
    this.numberOfImages = 0;
    this.numberOfLoadedImages = 0;
  }
  fetchImages() {
    return fetch(
      `https://pixabay.com/api/?key=34827531-46fe6f83c6cd16e6040b33d37&q=${this.serchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=3`
    )
      .then(response => response.json())
      .then(images => {
        this.numberOfImages = images.totalHits;
        this.incrementNomberOfLoadedImages(images.hits.length);
        this.incrementPage();
        console.log(this.numberOfLoadedImages);
        return images;
      })
      .catch(console.error);
  }

  incrementNomberOfLoadedImages(number) {
    this.numberOfLoadedImages += number;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  resetNumberOfLoadedImages() {
    this.numberOfLoadedImages = 0;
  }

  get query() {
    return this.serchQuery;
  }

  set query(newQuery) {
    this.serchQuery = newQuery;
  }
}

const apiService = new ApiService();

function onSearch(e) {
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

  apiService.fetchImages().then(images => {
    if (images.hits.length === 0) {
      refs.loadMoreBtn.classList.add('--is-hidden');
      return Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    refs.loadMoreBtn.classList.remove('--is-hidden');
    clearGallery();
    renderQueryImageCard(images.hits);
  });
}

function renderQueryImageCard(arrOfImages) {
  const markup = arrOfImages
    .map(image => {
      return `<div class="photo-card">
  <img width="370" heigth="270" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
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
}

function onLoadMore() {
  apiService.fetchImages().then(images => {
    if (apiService.numberOfLoadedImages >= apiService.numberOfImages) {
      refs.loadMoreBtn.classList.add('--is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
    renderQueryImageCard(images);
  });
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}
