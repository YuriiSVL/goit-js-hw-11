import axios from 'axios';

const API_KEY = '34827531-46fe6f83c6cd16e6040b33d37';
const URL = 'https://pixabay.com/api';
const PER_PAGE = 40;
const OPTIONS = 'image_type=photo&orientation=horizontal&safesearch=true';

export default class ApiService {
  constructor() {
    this.serchQuery = '';
    this.page = 1;
    this.numberOfImages = 0;
    this.numberOfLoadedImages = 0;
    this.isEndOfCollection = false;
  }

  async fetchImages() {
    const response = await axios.get(
      `${URL}/?key=${API_KEY}&q=${this.serchQuery}&${OPTIONS}&page=${this.page}&per_page=${PER_PAGE}`
    );

    const images = response.data;

    this.numberOfImages = images.totalHits;
    this.incrementNomberOfLoadedImages(images.hits.length);
    this.incrementPage();

    if (this.numberOfImages <= this.numberOfLoadedImages) {
      this.isEndOfCollection = true;
    }

    return images;
  }

  get endOfCollection() {
    return this.isEndOfCollection;
  }

  incrementNomberOfLoadedImages(number) {
    this.numberOfLoadedImages += number;
  }

  incrementPage() {
    this.page += 1;
  }

  resetData() {
    this.page = 1;
    this.numberOfLoadedImages = 0;
    this.numberOfImages = 0;
    this.isEndOfCollection = false;
  }

  get query() {
    return this.serchQuery;
  }

  set query(newQuery) {
    this.serchQuery = newQuery;
  }
}
