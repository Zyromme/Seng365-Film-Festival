import {
  Alert,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import React, { ChangeEvent, FormEvent } from "react";
import CSS from "csstype";
import Navbar from "./Navbar";
import axios from "axios";
import { useTokenStore } from "../store/TokenStore";
import { useUserIdStore } from "../store/UserIdStore";
import { useNavigate, useParams } from "react-router-dom";
import ImageInput from "./ImageInput";
import { FilmFull, FilmPost, Genre } from "../types/filmTypes";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { UserReturnWithEmail } from "../types/userTypes";

const baseUrl = "http://localhost:4941/api/v1";

const EditFilm = () => {
  const { id } = useParams();
  const token = useTokenStore((state) => state.token);
  const userId = useUserIdStore((state) => state.userId);
  const navigate = useNavigate();
  const [film, setFilm] = React.useState<FilmFull>({
    ageRating: "TBC",
    description: "",
    directorFirstName: "",
    directorId: 0,
    directorLastName: "",
    filmId: 0,
    genreId: 0,
    numReviews: 0,
    rating: 0,
    releaseDate: "",
    runtime: 0,
    title: "",
  });
  const [genres, setGenres] = React.useState<Array<Genre>>([]);
  const ageRatings = ["G", "PG", "M", "R13", "R16", "R18", "TBC"];
  const [releaseDate, setReleaseDate] = React.useState<Date | null>(
    new Date(film.releaseDate)
  );
  const [image, setImage] = React.useState<File | null>(null);
  const validImageTypes = ["image/jpeg", "image/gif", "image/png", "image/jpg"];
  const [errorFlag, setErrorFlag] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const todayDate = new Date();

  React.useEffect(() => {
    signInCheck();
    getFilm();
    getGenres();
  }, [userId, film.directorId]);

  const cardStyles: CSS.Properties = {
    maxWidth: "800px",
    borderRadius: "10px",
    margin: "20px",
  };

  const mainGridStyles: CSS.Properties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const getFilm = () => {
    axios.get("http://localhost:4941/api/v1/films/" + id).then(
      (response) => {
        setErrorFlag(false);
        setErrorMessage("");
        setFilm(response.data);
        setReleaseDate(new Date(response.data.releaseDate.toString()));
      },
      (error) => {
        setErrorFlag(true);
        setErrorMessage(error.toString());
      }
    );
  };

  const getGenres = () => {
    axios.get(baseUrl + "/films/genres").then(
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

  const handleImageSelect = (File: File) => {
    if (validImageTypes.includes(File.type)) {
      setImage(File);
    } else {
      setErrorFlag(false);
      setErrorMessage("Invalid file type: Image must be JPG, PNG or GIF");
    }
  };

  const signInCheck = () => {
    if (userId === "" || token === "") {
      navigate("/notFound");
    }
  };

  const updateTitleState = (event: ChangeEvent<HTMLInputElement>) => {
    setFilm({ ...film, title: event.target.value });
  };

  const updateDescriptionState = (event: ChangeEvent<HTMLInputElement>) => {
    setFilm({ ...film, description: event.target.value });
  };

  const handleChangeGenre = (event: SelectChangeEvent) => {
    setFilm({ ...film, genreId: parseInt(event.target.value) });
  };

  const handleChangeAgeRating = (event: SelectChangeEvent) => {
    setFilm({ ...film, ageRating: event.target.value });
  };
  const updateRuntimeState = (event: ChangeEvent<HTMLInputElement>) => {
    setFilm({ ...film, runtime: parseInt(event.target.value) });
  };

  const handleChangeReleaseDate = (date: Date | null) => {
    if (!date) {
      setErrorFlag(true);
      setErrorMessage("Please select a release date");
    } else if (date < todayDate) {
      setErrorFlag(true);
      setErrorMessage("Release date cannot be in the past");
    } else {
      setErrorFlag(false);
      setReleaseDate(date);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (image !== null && !validImageTypes.includes(image.type)) {
      setErrorFlag(true);
      setErrorMessage("Invalid file type: Image must be JPG, PNG or GIF");
    } else {
      updateFilm();
    }
  };

  const updateFilm = () => {
    const data: FilmPost = {
      title: film.title,
      description: film.description,
      genreId: film.genreId,
      ageRating: film.ageRating,
    };

    if (!(film.runtime === null || film.runtime === 0)) {
      data.runtime = film.runtime;
    }

    if (releaseDate !== null) {
      const year = releaseDate.getFullYear();
      const month = releaseDate.getMonth() + 1;
      const day = releaseDate.getDate();
      const hour = releaseDate.getHours();
      const minute = releaseDate.getMinutes();
      const second = releaseDate.getSeconds();
      data.releaseDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    var config = {
      method: "patch",
      url: `http://localhost:4941/api/v1/films/${film.filmId}`,
      headers: {
        "X-Authorization": token,
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (image !== null) {
          updateFilmPicture();
        }
        navigate(`/film/${film.filmId}`);
      })
      .catch(function (error) {
        setErrorFlag(true);
        setErrorMessage(error.response.statusText);
      });
  };

  const updateFilmPicture = () => {
    const config = {
      method: "patch",
      url: baseUrl + "/films/" + id + "/image",
      headers: {
        "Content-Type": image?.type,
        "X-Authorization": token,
      },
      data: image,
    };

    axios(config)
      .then(function (response) {
        navigate("/films");
      })
      .catch(function (error) {
        setErrorFlag(true);
        setErrorMessage(error.response.statusText);
      });
  };

  const displayEditForm = () => {
    return (
      <Grid container sx={mainGridStyles}>
        <Grid item>
          <Card sx={cardStyles}>
            <Typography variant="h2">Edit Film</Typography>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      value={film.title}
                      onChange={updateTitleState}
                      sx={{ width: "450px" }}
                      label="Title"
                      placeholder="Enter Film Title"
                      required
                    ></TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={film.description}
                      onChange={updateDescriptionState}
                      sx={{ width: "450px" }}
                      multiline
                      rows={5}
                      label="Description"
                      placeholder="Enter Film Description"
                      required
                    ></TextField>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sx={{ display: "flex", justifyContent: "right" }}
                  >
                    <FormControl>
                      <InputLabel id="genreSelectLabel">Genre *</InputLabel>
                      <Select
                        required
                        labelId="genreSelectLabel"
                        label="Genre"
                        id="genreSelectBox"
                        style={{ width: "221px" }}
                        value={film.genreId.toString()}
                        onChange={handleChangeGenre}
                      >
                        {genres.map((genre) => (
                          <MenuItem key={genre.genreId} value={genre.genreId}>
                            {genre.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sx={{ display: "flex", justifyContent: "left" }}
                  >
                    <FormControl>
                      <InputLabel id="ageRatingSelectLabel">
                        Age Rating
                      </InputLabel>
                      <Select
                        labelId="ageRatingSelectLabel"
                        id="ageRatingSelectBox"
                        style={{ width: "221px" }}
                        value={film.ageRating}
                        label="Age Rating"
                        onChange={handleChangeAgeRating}
                      >
                        {ageRatings.map((ageRating) => (
                          <MenuItem key={ageRating} value={ageRating}>
                            {ageRating}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sx={{ display: "flex", justifyContent: "right" }}
                  >
                    <TextField
                      id="runtime"
                      label="Runtime"
                      value={film.runtime}
                      placeholder="Enter Film Runtime"
                      type="number"
                      style={{ width: "221px" }}
                      InputProps={{
                        inputProps: { min: 1 },
                      }}
                      onChange={updateRuntimeState}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sx={{ display: "flex", justifyContent: "left" }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <div style={{ width: "220px" }}>
                        <MobileDatePicker
                          label="Release Date"
                          disabled={
                            releaseDate ? new Date() > releaseDate : undefined
                          }
                          value={releaseDate}
                          onChange={handleChangeReleaseDate}
                        />
                      </div>
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Film Image:</Typography>
                    <ImageInput
                      onImageSelect={handleImageSelect}
                      isRequired={false}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ width: "300px" }}
                      startIcon={<ArrowUpwardIcon />}
                    >
                      Update Film
                    </Button>
                  </Grid>
                </Grid>
              </form>
              {errorFlag && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {errorMessage}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const displayCannotEdit = () => {
    return (
      <div>
        <Typography variant="h3">You cannot edit this film!</Typography>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      {film.directorId === parseInt(userId)
        ? displayEditForm()
        : displayCannotEdit()}
    </>
  );
};

export default EditFilm;
