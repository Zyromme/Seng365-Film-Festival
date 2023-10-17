import React from "react";
import axios from "axios";
import { Film, Films, Genre } from "../types/filmTypes";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Box,
  Button,
  ButtonBase,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useUserIdStore } from "../store/UserIdStore";
import { useNavigate } from "react-router-dom";
import { useTokenStore } from "../store/TokenStore";

interface Props {
  listOfFilms: Films;

  listOfGenres: Array<Genre>;

  onClickPicture?: (film: Film) => void;
}

const FilmsTable = ({ listOfFilms, listOfGenres, onClickPicture }: Props) => {
  const token = useTokenStore((state) => state.token);
  const userId = useUserIdStore((state) => state.userId);
  const [dialogFilm, setDialogFilm] = React.useState<Film>({
    filmId: 0,
    title: "",
    directorId: 0,
    directorLastName: "",
    directorFirstName: "",
    genreId: 0,
    rating: 0,
    releaseDate: "",
    ageRating: "",
  });
  const [openDeleteDialogue, setOpenDeleteDialogue] = React.useState(false);
  const navigate = useNavigate();
  const [errorFlag, setErrorFlag] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleClickOpen = (film: Film) => {
    setDialogFilm(film);
    setOpenDeleteDialogue(true);
  };

  const handleClose = () => {
    setOpenDeleteDialogue(false);
  };

  const canManageFilm = (film: Film) => {
    return film.directorId === parseInt(userId);
  };

  const displayFilmCard = (film: Film) => {
    return (
      <Paper
        key={film.filmId}
        sx={{
          p: 2,
          margin: "auto",
          marginBottom: 3,

          width: 600,
          flexGrow: 1,
        }}
      >
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase
              sx={{ width: 128, height: 128 }}
              onClick={() => onClickPicture && onClickPicture(film)}
            >
              <Avatar
                alt={film.title}
                src={`http://localhost:4941/api/v1/films/${film.filmId}/image`}
                variant="square"
                sx={{ width: 120, height: 120 }}
              />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h6" component="div">
                  {film.title}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingBottom: "2px",
                  }}
                >
                  <Avatar
                    alt={film.directorFirstName + " " + film.directorLastName}
                    src={`http://localhost:4941/api/v1/users/${film.directorId}/image`}
                    style={{ marginRight: 5 }}
                  />
                  <Typography variant="body2">
                    {`${film.directorFirstName} ${film.directorLastName}`}{" "}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {film.ageRating}{" "}
                  {listOfGenres.find((x) => x.genreId === film.genreId)?.name ||
                    ""}{" "}
                  {new Date(film.releaseDate).toLocaleDateString()}
                </Typography>
                <Chip
                  label={film.rating}
                  color="success"
                  size="small"
                  sx={{
                    fontSize: "14px",
                    borderRadius: "4px",
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  return <div>{listOfFilms.map((film: Film) => displayFilmCard(film))}</div>;
};
export default FilmsTable;
