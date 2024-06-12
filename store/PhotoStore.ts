import { makeAutoObservable, action, runInAction } from 'mobx';
import axios from 'axios';

interface Photo {
  id: string;
  urls: {
    small: string;
    regular: string;
  };
}

class PhotoStore {
  photos: Photo[] = [];
  page = this.getRandomPage(100);
  isLoading = false;
  error = '';

  constructor() {
    makeAutoObservable(this, {
      fetchPhotos: action,
      refreshPhotos: action,
      setPhotos: action,
      setLoading: action,
      setError: action,
      setPage: action,
    });
  }

  setPhotos(photos: Photo[]) {
    this.photos = photos;
  }

  setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  setError(error: string) {
    this.error = error;
  }

  setPage(page: number) {
    this.page = page;
  }

  async fetchPhotos() {
    this.setLoading(true);
    this.setError('');
    try {
      const response = await axios.get(`https://api.unsplash.com/photos?page=${this.page}&client_id=${process.env.UNSPLASH_API_KEY}`);
      runInAction(() => {
        const newPhotos = response.data.filter((newPhoto: Photo) =>
          !this.photos.some((existingPhoto: Photo) => existingPhoto.id === newPhoto.id)
        );
        this.photos = [...this.photos, ...newPhotos];
        this.page += 1;
      });
    } catch (err: unknown) {
      runInAction(() => {
        if (axios.isAxiosError(err)) {
          this.error = err.response?.data?.message || err.message;
        } else if (err instanceof Error) {
          this.error = err.message;
        } else {
          this.error = 'An unknown error occurred';
        }
      });
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  getRandomPage(maxPage: number): number {
    return Math.floor(Math.random() * maxPage) + 1;
  }

  async refreshPhotos() {
    runInAction(() => {
      this.setPhotos([]);
      this.setPage(this.getRandomPage(100));
    });
    await this.fetchPhotos();
  }
}

const photoStore = new PhotoStore();
export default photoStore;
