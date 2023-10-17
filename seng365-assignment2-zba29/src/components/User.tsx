import {
  Avatar,
  Box,
  Button,
  Grid,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import Navbar from "./Navbar";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { UserReturnWithEmail } from "../types/userTypes";
import axios from "axios";
import { useTokenStore } from "../store/TokenStore";
import NotFound from "./NotFound";
import EditProfileForm from "./EditProfileForm";
import { useUserIdStore } from "../store/UserIdStore";

const User = () => {
  const { id } = useParams();
  const token = useTokenStore((state) => state.token);
  const [userData, setUserData] = useState<UserReturnWithEmail>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const userId = useUserIdStore((state) => state.userId);
  const [hasImage, setHasImage] = useState(true);
  const [photo, setPhoto] = useState("");
  const [errorFlag, setErrorFlag] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getUser = () => {
      var config = {
        method: "get",
        url: `http://localhost:4941/api/v1/users/${id}`,
        headers: {
          "X-Authorization": token,
        },
      };
      axios(config)
        .then(function (response) {
          setErrorFlag(false);
          setErrorMessage("");
          setUserData(response.data);
          if (response.data.email !== undefined) {
            setUserLoggedIn(true);
          }
        })
        .catch(function (error) {
          setErrorFlag(true);
          setErrorMessage(error.toString());
        });
    };
    getUser();
    setPhoto(`http://localhost:4941/api/v1/users/${id}/image`);
  }, [userLoggedIn, photo]);

  const handleDeletePhoto = () => {
    const config = {
      method: "delete",
      url: "http://localhost:4941/api/v1/users/" + userId + "/image",
      headers: {
        "X-Authorization": token,
      },
    };

    axios(config)
      .then(function (response) {
        setPhoto("");
      })
      .catch(function (error) {
        setErrorFlag(true);
        setErrorMessage(error.response.statusText);
      });
  };

  const showContents = () => {
    return (
      <>
        <Navbar />
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Paper
            sx={{
              justifyContent: "center",
              maxWidth: "fit-content",
              alignContent: "center",
              margin: 5,
              paddingLeft: 5,
              paddingRight: 5,
              paddingTop: 2,
              paddingBottom: 2,
            }}
          >
            <Avatar
              alt={userData.firstName + " " + userData.lastName}
              src={photo}
              sx={{ width: 200, height: 200 }}
              onError={() => setHasImage(false)}
            />
            <Typography variant="subtitle1">
              {userData.firstName} {userData.lastName}
            </Typography>
            <Typography variant="subtitle2">{userData.email}</Typography>
            <EditProfileForm user={userData} />
            {hasImage && (
              <Button
                variant="outlined"
                onClick={handleDeletePhoto}
                style={{ marginTop: "2px" }}
              >
                Remove photo
              </Button>
            )}
          </Paper>
        </Grid>
      </>
    );
  };

  return <>{userLoggedIn ? showContents() : <NotFound />}</>;
};

export default User;
