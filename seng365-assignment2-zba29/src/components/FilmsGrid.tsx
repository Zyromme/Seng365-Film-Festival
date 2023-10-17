import {Film, Genre} from "../types/filmTypes";
import React from "react";
import {
    Alert,
    AlertTitle,
    Avatar,
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Chip,
    Grid,
    Typography,
} from "@mui/material";
import CSS from "csstype";
import {Link, useNavigate} from "react-router-dom";
import './Films.css'

interface Props {
    listOfFilms: Array<Film>;
    listOfGenres: Array<Genre>;
}

const FilmsGrid = ({listOfFilms, listOfGenres}: Props) => {
    const navigate = useNavigate();
    const filmCardStyles: CSS.Properties = {
        minWidth: "300px",
        borderRadius: "10px",
    };

    const handleNavigation = (filmId: number) => {
        navigate("/film/" + filmId);
    };

    const displayFilms = () => {
        return (
            <Grid container spacing={5} justifyContent="space-between">
                {listOfFilms.map((film: any, index: number) => (
                    <Grid item className="FilmCard" key={film.filmId} xs={12} sm={6} md={4}>
                        <Card sx={filmCardStyles}>
                            <CardActionArea onClick={() => handleNavigation(film.filmId)}>
                                <CardMedia
                                    component="img"
                                    height="250"
                                    image={`http://localhost:4941/api/v1/films/${film.filmId}/image`}
                                    alt={`${film.title} Hero Image`}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5">
                                        <div>{film.title}</div>
                                        <Chip
                                            label={film.rating}
                                            color="success"
                                            size="small"
                                            sx={{
                                                fontSize: "14px",
                                                borderRadius: "4px",
                                            }}
                                        />
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
                                            alt={film.directorFirstName + " " + film.directorFirstName}
                                            src={`http://localhost:4941/api/v1/users/${film.directorId}/image`}
                                            style={{marginRight: 5}}
                                        />
                                        <Typography variant="body2">
                                            {`${film.directorFirstName} ${film.directorLastName}`}{" "}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        component="div"
                                    >
                                        {film.ageRating}{" "}
                                        {listOfGenres.find((x) => x.genreId === film.genreId)?.name ||
                                            ""}{" "}
                                        {new Date(film.releaseDate).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    }

    const noFilms = () => {
        return (
            <Alert severity="info">
                <AlertTitle>No result</AlertTitle>
                There is no film that fits such criteria
            </Alert>
        );
    }

    return (
        <>
            {listOfFilms.length === 0 ? noFilms() : displayFilms()}
        </>
    );
};
export default FilmsGrid;
