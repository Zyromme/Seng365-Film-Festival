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
import { useNavigate } from "react-router-dom";
import ImageInput from "./ImageInput";
import { FilmPost, Genre } from "../types/filmTypes";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const baseUrl = "http://localhost:4941/api/v1";

const CreateFilm = () => {
  const token = useTokenStore((state) => state.token);
  const userId = useUserIdStore((state) => state.userId);
  const navigate = useNavigate();
  const [title, setTitle] = React.useState("");
  const [description, setDecription] = React.useState("");
  const [genre, setGenre] = React.useState("");
  const [genres, setGenres] = React.useState<Array<Genre>>([]);
  const [ageRating, setAgeRating] = React.useState("TBC");
  const ageRatings = ["G", "PG", "M", "R13", "R16", "R18", "TBC"];
  const [runtime, setRuntime] = React.useState("");
  const [releaseDate, setReleaseDate] = React.useState<Date | null>(null);
  const [image, setImage] = React.useState<File | null>(null);
  const validImageTypes = ["image/jpeg", "image/gif", "image/png", "image/jpg"];
  const [errorFlag, setErrorFlag] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  var filmId = -1;
  const todayDate = new Date();

  React.useEffect(() => {
    signInCheck();
    getGenres();
  }, []);

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
      setErrorFlag(false);
    } else {
    }
    setImage(File);
  };

  const signInCheck = () => {
    if (userId === "" || token === "") {
      navigate("/notFound");
    }
  };

  const updateTitleState = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const updateDescriptionState = (event: ChangeEvent<HTMLInputElement>) => {
    setDecription(event.target.value);
  };

  const handleChangeGenre = (event: SelectChangeEvent) => {
    setGenre(event.target.value);
  };

  const handleChangeAgeRating = (event: SelectChangeEvent) => {
    setAgeRating(event.target.value);
  };
  const updateRuntimeState = (event: ChangeEvent<HTMLInputElement>) => {
    setRuntime(event.target.value);
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
    }
    setReleaseDate(date);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (image !== null && !validImageTypes.includes(image.type)) {
      setErrorFlag(true);
      setErrorMessage("Invalid file type: Image must be JPG, PNG or GIF");
    } else {
      createFilm();
    }
  };

  const createFilm = () => {
    const data: FilmPost = {
      title: title,
      description: description,
      genreId: parseInt(genre),
      ageRating: ageRating,
    };

    if (runtime !== "") {
      data.runtime = parseInt(runtime);
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
      method: "post",
      url: `http://localhost:4941/api/v1/films`,
      headers: {
        "X-Authorization": token,
      },
      data: data,
    };

    console.log(config);

    axios(config)
      .then(function (response) {
        filmId = response.data.filmId;
        addFilmPicture();
      })
      .catch(function (error) {
        setErrorFlag(true);
        if (error.response.status === 403) {
          setErrorMessage(error.response.statusText);
        }
      });
  };

  const addFilmPicture = () => {
    const config = {
      method: "put",
      url: baseUrl + "/films/" + filmId + "/image",
      headers: {
        "Content-Type": image?.type,
        "X-Authorization": token,
      },
      data: image,
    };

    axios(config)
      .then(function (response) {
        navigate(`/film/${filmId}`);
      })
      .catch(function (error) {
        setErrorFlag(true);
        setErrorMessage(error.response.statusText);
      });
  };

  return (
    <>
      <Navbar />
      <Grid container sx={mainGridStyles}>
        <Grid item>
          <Card sx={cardStyles}>
            <Typography variant="h2">Create Film</Typography>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      value={title}
                      onChange={updateTitleState}
                      sx={{ width: "450px" }}
                      label="Title"
                      placeholder="Enter Film Title"
                      required
                    ></TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={description}
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
                        value={genre}
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
                        value={ageRating}
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
                      value={runtime}
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
                          value={releaseDate}
                          onChange={handleChangeReleaseDate}
                        />
                      </div>
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Film Image:</Typography>
                    <ImageInput
                      isRequired={true}
                      onImageSelect={handleImageSelect}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ width: "300px" }}
                      startIcon={<ArrowUpwardIcon />}
                    >
                      Create Film
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
    </>
  );
};

export default CreateFilm;
