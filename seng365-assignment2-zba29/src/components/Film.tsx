import {useNavigate, useParams} from "react-router-dom";
import {Film as film, FilmFull, Genre, Review} from "../types/filmTypes";
import React, {Fragment} from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
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
import {useUserIdStore} from "../store/UserIdStore";
import FilmsTable from "./FilmsTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {useTokenStore} from "../store/TokenStore";

const Film = () => {
    const {id} = useParams();
    const userId = useUserIdStore((state) => state.userId);
    const token = useTokenStore((state) => state.token);
    const [film, setFilm] = React.useState<FilmFull>({
        ageRating: "",
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
    const [reviews, setReviews] = React.useState<Array<Review>>([]);
    const [genres, setGenres] = React.useState<Array<Genre>>([]);
    const [similarFilms, setSimilarFilms] = React.useState<Array<film>>([]);
    const [filmsOfGenre, setFilmsOfGenre] = React.useState<Array<film>>([]);
    const [filmsByDirector, setFilmsByDirector] = React.useState<Array<film>>([]);
    const [openDeleteDialogue, setOpenDeleteDialogue] = React.useState(false);
    const navigate = useNavigate();
    const [readyForConcat, setReadyForConcat] = React.useState(false);
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    React.useEffect(() => {
        const getFilm = () => {
            axios.get("http://localhost:4941/api/v1/films/" + id).then(
                (response) => {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setFilm(response.data);
                },
                (error) => {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                }
            );
        };

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

        getFilm();
        getGenres();
    }, [id]);

    React.useEffect(() => {
        const getReviews = () => {
            var config = {
                method: "get",
                url: "http://localhost:4941/api/v1/films/" + film.filmId + "/reviews",
                headers: {},
            };

            axios(config)
                .then(function (response) {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setReviews(response.data);
                })
                .catch(function (error) {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };

        const getFilmsByDirector = () => {
            var config = {
                method: "get",
                url: "http://localhost:4941/api/v1/films?directorId=" + film.directorId,
                headers: {},
            };

            axios(config)
                .then(function (response) {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setFilmsByDirector(response.data.films);
                    setReadyForConcat(true);
                })
                .catch(function (error) {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };

        const getSameGenreFilms = () => {
            var config = {
                method: "get",
                url: "http://localhost:4941/api/v1/films?genreIds=" + film.genreId,
                headers: {},
            };

            axios(config)
                .then(function (response) {
                    setErrorFlag(false);
                    setErrorMessage("");
                    setFilmsOfGenre(response.data.films);
                    setReadyForConcat(true);
                })
                .catch(function (error) {
                    setErrorFlag(true);
                    setErrorMessage(error.toString());
                });
        };

        const getSimilarFilms = () => {
            getFilmsByDirector();
            getSameGenreFilms();
        };
        if (film !== null && film.directorId !== 0 && film.genreId !== 0) {
            getReviews();
            getSimilarFilms();
        }
    }, [film, genres, id]);

    React.useEffect(() => {
        const concatenateSimilarFilms = () => {
            var array = require("lodash/array");

            if (filmsByDirector.length > 0 && filmsOfGenre.length > 0) {
                const allSimilarFilms = filmsByDirector.concat(filmsOfGenre);
                const uniqueSimilarFilms = array.uniqBy(allSimilarFilms, "filmId");
                const similarFilmsWithoutCurrent = uniqueSimilarFilms.filter(
                    (f: film) => f.filmId !== film.filmId
                );
                setSimilarFilms(similarFilmsWithoutCurrent);
            }
        };

        if (filmsByDirector.length > 0 && filmsOfGenre.length > 0) {
            concatenateSimilarFilms();
        } else {
            setReadyForConcat(false);
        }
    }, [readyForConcat]);

    const displayReviews = () => {
        return reviews.map((review: Review) => <ReviewCard review={review}/>);
    };

    const canReviewCheck = () => {
        if (userId === "") {
            return false;
        }
        if (film.directorId === parseInt(userId)) {
            return false;
        } else if (Date.parse(film.releaseDate) > Date.now()) {
            return false;
        } else if (reviews.find((x) => x.reviewerId === parseInt(userId))) {
            return false;
        } else {
            return true;
        }
    };

    const notLoggedIn = () => {
        return userId === "";
    };

    const loginPrompt = () => {
        return (
            <>
                <Button
                    onClick={() => navigate("/login")}
                    variant="outlined"
                    size="large"
                >
                    Log in to add review
                </Button>
            </>
        );
    };

    const displayEdit = () => {
        return (
            <Box>
                <Button
                    variant="outlined"
                    onClick={() => {
                        navigate(`/editFilm/${film.filmId}`);
                    }}
                    endIcon={<EditIcon/>}
                >
                    Edit Film
                </Button>
            </Box>
        );
    };

    const canBeEdited = () => {
        if (film.numReviews > 0 || film.directorId !== parseInt(userId)) {
            return null;
        } else {
            return displayEdit();
        }
    };

    const deleteFilm = () => {
        var config = {
            method: "delete",
            url: "http://localhost:4941/api/v1/films/" + film.filmId,
            headers: {
                "X-Authorization": token,
            },
        };

        axios(config)
            .then(function (response) {
                navigate("/films");
            })
            .catch(function (error) {
                console.log(error);
                setErrorFlag(true);
                setErrorMessage(error.statusText);
            });
    };

    const handleClickOpen = () => {
        setOpenDeleteDialogue(true);
    };

    const handleClose = () => {
        setOpenDeleteDialogue(false);
    };

    const displayDelete = () => {
        return (
            <>
                <Box sx={{marginTop: "10px"}}>
                    <Button
                        variant="outlined"
                        endIcon={<DeleteIcon/>}
                        onClick={() => handleClickOpen()}
                    >
                        Delete
                    </Button>
                </Box>
                <Dialog
                    open={openDeleteDialogue}
                    onClose={handleClose}
                    aria-labelledby="delete-alert-dialog"
                >
                    <DialogTitle id="delete-dialog-title">
                        Title: {film.title}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="delete-dialog-description">
                            Are you sure you want to delete this film?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} autoFocus>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => deleteFilm()}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    };

    return (
        <>
            <Navbar/>
            <Typography variant="h2">{film.title}</Typography>
            <Box
                component="img"
                src={`http://localhost:4941/api/v1/films/${film.filmId}/image`}
                alt={film.title}
                maxWidth="450px"
                loading="lazy"
            />
            {canBeEdited()}
            {film.directorId === parseInt(userId) ? displayDelete() : null}
            <Typography variant="h4">{film.description}</Typography>
            <Table>
                <Fragment>
                    <TableBody>
                        <TableRow>
                            <TableCell
                                rowSpan={4}
                                align="center"
                                style={{
                                    border: "none",
                                    textAlign: "center",
                                    alignContent: "center",
                                }}
                            >
                                <Typography variant="body1">Director:</Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Box>
                                        <Avatar
                                            alt="Director"
                                            src={`http://localhost:4941/api/v1/users/${film.directorId}/image`}
                                            sx={{width: 200, height: 200}}
                                            variant="square"
                                        />
                                        {film.directorFirstName} {film.directorLastName}
                                    </Box>
                                </Box>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{border: "none", textAlign: "right"}}>
                                <Typography variant="body1">Release Date:</Typography>
                            </TableCell>
                            <TableCell style={{border: "none"}}>
                                {new Date(film.releaseDate).toLocaleString()}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{border: "none", textAlign: "right"}}>
                                <Typography variant="body1">Rating:</Typography>
                            </TableCell>
                            <TableCell style={{border: "none"}}>{film.rating}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{border: "none", textAlign: "right"}}>
                                <Typography variant="body1">
                                    Total number of reviews:
                                </Typography>
                            </TableCell>
                            <TableCell style={{border: "none"}}>
                                {film.numReviews}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Fragment>
            </Table>
            {reviews.length > 0 ? (
                <Typography style={{marginBottom: 5}}>Reviews:</Typography>
            ) : null}
            {displayReviews()}

            {canReviewCheck() ? <FilmReviewForm filmId={film.filmId}/> : null}
            {notLoggedIn() ? loginPrompt() : null}
            <Typography style={{marginBottom: 5}}>Similar Films:</Typography>
            <Grid container justifyContent="center">
                <Grid item>
                    <FilmsTable listOfFilms={similarFilms} listOfGenres={genres}/>
                </Grid>
            </Grid>
        </>
    );
};

export default Film;
