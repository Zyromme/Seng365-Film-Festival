import React, {ChangeEvent} from "react";
import axios from "axios";
import {Genre} from "../types/filmTypes";
import {
    Alert,
    AlertTitle,
    Autocomplete,
    Box,
    Checkbox,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem, OutlinedInput,
    Pagination,
    Paper,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from "@mui/material";
import FilmsGrid from "./FilmsGrid";
import SearchIcon from "@mui/icons-material/Search";
import Navbar from "./Navbar";
import CSS from "csstype";
import {useFilmStore} from "../store";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {useSearchParams} from "react-router-dom";

const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
const checkedIcon = <CheckBoxIcon fontSize="small"/>;

const baseUrl = "http://localhost:4941/api/v1";

const Films = () => {
    const films = useFilmStore((state) => state.Films);
    const setFilms = useFilmStore((state) => state.setFilms);
    const [genres, setGenres] = React.useState<Array<Genre>>([]);
    const [searchQuery, setSearchQuery] = useSearchParams();
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [firstLoad, setFirstLoad] = React.useState(true);
    const ageRatings = ["G", "PG", "M", "R13", "R16", "R18", "TBC"];
    const sortOptions = [
        {value: "ALPHABETICAL_ASC", label: "Ascending Alphabetically"},
        {value: "ALPHABETICAL_DESC", label: "Descending Alphabetically"},
        {value: "RATING_ASC", label: "Ascending by Rating"},
        {value: "RATING_DESC", label: "Descending by Rating"},
        {value: "RELEASED_ASC", label: "Chronologically by Release Date"},
        {
            value: "RELEASED_DESC",
            label: "Reverse Chronologically by Release Date",
        },
    ];
    const [sortBy, setSortBy] = React.useState("RELEASED_ASC");
    const [currentPage, setCurrentPage] = React.useState(1);
    const [maxPage, setMaxPage] = React.useState(1);

    React.useEffect(() => {
        const getSearchParams = () => {
            const ratings = searchQuery.getAll("ageRatings");
            const genres = searchQuery.getAll("genreIds");
            const sortByQuery = searchQuery.getAll("sortBy");

            let query = "?";

            if (searchQuery.get("q")) {
                query += `&q=${searchQuery.get("q")}`;
            }

            if (genres) {
                genres.map((value, index) => {
                    query += `&genreIds=${value}`;
                });
            }

            if (genres) {
                ratings.map((value, index) => {
                    query += `&ageRatings=${value}`;
                });
            }
            if (sortByQuery.toString() !== "") {
                query += `&sortBy=${sortByQuery}`;
            }
            query += `&count=9`;
            query += `&startIndex=${(currentPage - 1) * 9}`;
            return query;
        };

        const getFilms = () => {
            axios.get(baseUrl + "/films?" + getSearchParams()).then(
                (response) => {
                    if (Array.isArray(response.data.films)) {
                        setErrorFlag(false);
                        setErrorMessage("");
                        setFilms(response.data.films);
                        setMaxPage(Math.ceil(response.data.count / 9));
                    } else {
                        setErrorFlag(true);
                        setErrorMessage("Response data is not an array");
                    }
                },
                (error) => {
                    setErrorFlag(true);
                    console.log(error.statusText);
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
        getFilms();
        if (firstLoad) {
            getGenres();
        }
        setFirstLoad(false);
    }, [searchQuery, firstLoad, currentPage, maxPage]);

    const card: CSS.Properties = {
        padding: "16px",
        marginLeft: "30px",
        marginRight: "30px",
        marginBottom: "30px",
    };

    const handlePageChange = (event: ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const handSearchInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        searchQuery.set("q", event.target.value);
        setCurrentPage(1);
        setSearchQuery(searchQuery);
    };

    const handleGenreChange = (
        event: React.ChangeEvent<{}>,
        value: Array<Genre>
    ) => {
        setCurrentPage(1);
        searchQuery.delete("genreIds");
        setSearchQuery(searchQuery);
        for (var genre of value) {
            searchQuery.append("genreIds", genre.genreId.toString());
            setSearchQuery(searchQuery);
        }
    };

    const handeAgeRatingsChange = (
        event: React.ChangeEvent<{}>,
        value: Array<String>
    ) => {
        setCurrentPage(1);
        searchQuery.delete("ageRatings");
        setSearchQuery(searchQuery);
        for (var ageRating of value) {
            searchQuery.append("ageRatings", ageRating.toString());
            setSearchQuery(searchQuery);
        }
    };

    const handleChangeSortBy = (event: SelectChangeEvent) => {
        setCurrentPage(1);
        setSortBy(event.target.value);
        searchQuery.set("sortBy", event.target.value);
        setSearchQuery(searchQuery);
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Navbar/>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h2">Films</Typography>
            </Grid>
            <Grid item xs={4}>
                <Box display="flex" justifyContent="flex-end">
                    <FormControl>
                        <TextField
                            size="small"
                            variant="outlined"
                            onChange={handSearchInputChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon/>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormControl>
                </Box>
            </Grid>
            <Grid item xs={8}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                    }}
                >
                    <Autocomplete
                        multiple
                        style={{width: "400px"}}
                        id="genreCheckbox"
                        options={genres}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option.name}
                        renderOption={(props, option, {selected}) => (
                            <li {...props}>
                                <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    style={{marginRight: 8}}
                                    checked={selected}
                                />
                                {option.name}
                            </li>
                        )}
                        renderInput={(params) => <TextField {...params} label="Genres"/>}
                        onChange={handleGenreChange}
                    />
                    <Autocomplete
                        multiple
                        id="genreCheckbox"
                        style={{width: "300px"}}
                        options={ageRatings}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option}
                        renderOption={(props, option, {selected}) => (
                            <li {...props}>
                                <Checkbox
                                    icon={icon}
                                    checkedIcon={checkedIcon}
                                    style={{marginRight: 8}}
                                    checked={selected}
                                />
                                {option}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField {...params} label="ageRatings"/>
                        )}
                        onChange={handeAgeRatingsChange}
                    />
                    <Box sx={{minWidth: 120}}>
                        <FormControl fullWidth>
                            <InputLabel id="sortBySelectBoxLabel">sortBy</InputLabel>
                            <Select
                                labelId="sortBySelectBoxLabel"
                                id="sortBySelectBox"
                                style={{width: "300px"}}
                                value={sortBy}
                                label="sortBySelectBoxLabel"
                                onChange={handleChangeSortBy}
                            >
                                {sortOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Paper elevation={3} style={card}>
                    <div
                        style={{
                            display: "inline-block",
                            maxWidth: "965px",
                            minWidth: "320",
                        }}
                    >
                        {errorFlag ? (
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                {errorMessage}
                            </Alert>
                        ) : (
                            ""
                        )}
                        <FilmsGrid listOfFilms={films} listOfGenres={genres}/>
                        <Box mt={2} display="flex" justifyContent="center">
                            <Pagination
                                count={maxPage}
                                page={currentPage}
                                onChange={handlePageChange}
                            ></Pagination>
                        </Box>
                    </div>
                </Paper>
            </Grid>
        </Grid>
    );
};
export default Films;
