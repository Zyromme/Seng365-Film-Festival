import { Review } from "../types/filmTypes";
import { Avatar, ButtonBase, Grid, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";

interface Props {
  review: Review;
}

const ReviewCard = ({ review }: Props) => {
  return (
    <>
      <Paper
        key={review.reviewerId}
        sx={{
          p: 2,
          margin: "auto",
          marginBottom: 3,
          maxWidth: 500,
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        }}
      >
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase sx={{ width: 128, height: 128 }}>
              <Avatar
                alt="Reviewer"
                src={`http://localhost:4941/api/v1/users/${review.reviewerId}/image`}
                variant="square"
                sx={{ width: 120, height: 120 }}
              />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1" component="div">
                  {review.reviewerFirstName} {review.reviewerLastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {review.review}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" component="div">
                {review.rating}/10
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default ReviewCard;
