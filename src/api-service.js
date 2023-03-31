export default class ApiService {
  constructor() {
    this.serchQuery = '';
    this.page = 1;
    this.numberOfImages = 0;
    this.numberOfLoadedImages = 0;
  }
  //   fetchImages() {
  //     return fetch(
  //       `https://pixabay.com/api/?key=34827531-46fe6f83c6cd16e6040b33d37&q=${this.serchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=3`
  //     )
  //       .then(response => response.json())
  //       .then(images => {
  //         this.numberOfImages = images.totalHits;
  //         this.incrementNomberOfLoadedImages(images.hits.length);
  //         this.incrementPage();
  //         // console.log(this.numberOfLoadedImages);
  //         return images;
  //       })
  //       .catch(console.error);
  //   }

  async fetchImages() {
    const response = await fetch(
      `https://pixabay.com/api/?key=34827531-46fe6f83c6cd16e6040b33d37&q=${this.serchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
    );
    const images = await response.json();

    this.numberOfImages = images.totalHits;
    this.incrementNomberOfLoadedImages(images.hits.length);
    this.incrementPage();
    // console.log(this.numberOfLoadedImages);

    return images;
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
