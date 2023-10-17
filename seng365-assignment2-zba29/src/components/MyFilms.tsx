import { useNavigate, useParams } from "react-router-dom";
import {
  Film,
  Film as film,
  FilmFull,
  Genre,
  Review,
} from "../types/filmTypes";
import React, { Fragment } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  Button,
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import Navbar from "./Navbar";
import ReviewCard from "./ReviewCard";
import FilmReviewForm from "./FilmReviewForm";
import { useUserIdStore } from "../store/UserIdStore";
import FilmsGrid from "./FilmsGrid";
import FilmsTable from "./FilmsTable";
import NotFound from "./NotFound";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

const MyFilms = () => {
  const { id } = useParams();
  const userId = useUserIdStore((state) => state.userId);
  const navigate = useNavigate();
  const [genres, setGenres] = React.useState<Array<Genre>>([]);
  const [similarFilms, setSimilarFilms] = React.useState<Array<film>>([]);
  const [filmsIReviewed, setFilmsIReviewed] = React.useState<Array<film>>([]);
  const [filmsICreated, setFilmsICreated] = React.useState<Array<film>>([]);
  const [readyForConcat, setReadyForConcat] = React.useState(false);
  const [errorFlag, setErrorFlag] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    const getGenres = () => {
      axios.get("http://localhost:4941/api/v1/films/genres").then(
        (response) => {
          if (Array.isArray(response.data)) {
            setErrorFlag(false);
            setErrorMessage("");
            setGenres(response.data);
          } else {
            setErrorFlag(true);
            setErrorMessage("Response data is not an array");
          }
        },
        (error) => {
          setErrorFlag(true);
          setErrorMessage(error.toString());
        }
      );
    };

    const getFilmsICreated = () => {
      var config = {
        method: "get",
        url: "http://localhost:4941/api/v1/films?directorId=" + userId,
        headers: {},
      };

      axios(config)
        .then(function (response) {
          setErrorFlag(false);
          setErrorMessage("");
          setFilmsICreated(response.data.films);
        })
        .catch(function (error) {
          setErrorFlag(true);
          setErrorMessage(error.toString());
        });
    };

    const getFilmsIReviewed = () => {
      var config = {
        method: "get",
        url: "http://localhost:4941/api/v1/films?reviewerId=" + userId,
        headers: {},
      };

      axios(config)
        .then(function (response) {
          setErrorFlag(false);
          setErrorMessage("");
          setFilmsIReviewed(response.data.films);
        })
        .catch(function (error) {
          setErrorFlag(true);
          setErrorMessage(error.toString());
        });
    };

    getGenres();
    getFilmsICreated();
    getFilmsIReviewed();
  }, [userId]);

  React.useEffect(() => {
    const concatenateSimilarFilms = () => {
      const allMyFilms = filmsICreated.concat(filmsIReviewed);
      setSimilarFilms(allMyFilms);
      console.log(allMyFilms);
    };
    concatenateSimilarFilms();
  }, [filmsICreated, filmsIReviewed]);

  const handleFilmNavigation = (film: Film) => {
    navigate(`/film/${film.filmId}`);
  };

  const displayFilms = () => {
    return (
      <>
        <FilmsTable
          listOfFilms={similarFilms}
          listOfGenres={genres}
          onClickPicture={handleFilmNavigation}
        />
      </>
    );
  };

  const showNoFilms = () => {
    return (
      <>
        <Typography variant="h4" marginBottom="10px">
          You have no films yet
        </Typography>
        <Button
          variant="outlined"
          onClick={() => {
            navigate("/createFilm");
          }}
        >
          Create a film
        </Button>
      </>
    );
  };

  return (
    <>
      {userId !== "" ? (
        <>
          <Navbar />
          <Typography variant="h2">My Films</Typography>
          <Grid container justifyContent="center">
            <Grid item>
              {similarFilms.length > 0 ? displayFilms() : showNoFilms()}
            </Grid>
          </Grid>
        </>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default MyFilms;
