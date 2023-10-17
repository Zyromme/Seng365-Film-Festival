import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  Input,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import React, {ChangeEvent, FormEvent} from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import axios from "axios";
import {useTokenStore} from "../store/TokenStore";
import {ReviewPost} from "../types/filmTypes";

const FilmReviewForm = ({filmId}: { filmId: number }) => {
  const token = useTokenStore((state) => state.token);
  const [rating, setRating] = React.useState("");
  const [review, setReview] = React.useState("");
  const [errorFlag, setErrorFlag] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addReview();
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const updateRatingState = (event: ChangeEvent<HTMLInputElement>) => {
    setRating(event.target.value);
  };

  const updateReviewState = (event: ChangeEvent<HTMLInputElement>) => {
    setReview(event.target.value);
  };

  const addReview = () => {
    var data: ReviewPost = {
      rating: parseInt(rating),
    };

    if (review !== "") {
      data.review = review
    }
    var config = {
      method: "post",
      url: `http://localhost:4941/api/v1/films/${filmId}/reviews`,
      headers: {
        "X-Authorization": token,
      },
      data: data,
    };

    axios(config)
        .then(function (response) {
          setErrorFlag(false);
          window.location.reload();
        })
        .catch(function (error) {
          setErrorFlag(true);
          setErrorMessage(error.response.statusText.substring(18));
        });
  };

  return (
      <>
        <div>
          <Button onClick={handleOpen} variant="outlined" size="large">
            ADD REVIEW
          </Button>
          <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="rating"
                        label="Rating /10"
                        value={rating}
                        placeholder="10"
                        type="number"
                        InputProps={{
                          inputProps: {min: 1, max: 10},
                        }}
                        onChange={updateRatingState}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="review"
                        label="Review"
                        multiline
                        rows={4}
                        placeholder="What did you think about the film?"
                        onChange={updateReviewState}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        startIcon={<ArrowUpwardIcon/>}
                    >
                      Submit Review
                    </Button>
                  </Grid>
                </Grid>
              </form>
              {errorFlag && (
                  <Grid item xs={12} paddingTop="10px">
                    <Card>
                      <Typography color="error">{errorMessage}</Typography>
                    </Card>
                  </Grid>
              )}
            </Box>
          </Modal>
        </div>
      </>
  );
};

export default FilmReviewForm;
