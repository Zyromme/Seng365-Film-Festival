type Film = {
  filmId: number;
  title: string;
  genreId: number;
  releaseDate: string;
  directorId: number;
  directorFirstName: string;
  directorLastName: string;
  rating: number;
  ageRating: string;
};

type FilmFull = {
  description: string;
  numReviews: number;
  runtime: number;
} & Film;

type FilmReturn = {
  films: film[];
  count: number;
};

type Genre = {
  genreId: number;
  name: string;
};

type Review = {
  reviewerId: number;
  rating: number;
  review: string;
  reviewerFirstName: string;
  reviewerLastName: string;
};

type FilmSearchQuery = {
  q?: string;
  directorId?: number;
  reviewerId?: number;
  genreIds?: Array<number>;
  ageRatings?: Array<string>;
  sortBy?: string;
  count?: number;
  startIndex?: number;
};

type FilmPost = {
  title: string;
  description: string;
  genreId: number;
  ageRating: string;
  releaseDate?: string;
  runtime?: number;
};

type ReviewPost = {
  rating: number;
  review?: string;
};

type Films = Array<Film>;

export { Film, FilmFull, Films, Genre, Review, FilmPost, ReviewPost };
