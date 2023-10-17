import {
  Card,
  CardContent,
  FormControl,
  Grid,
  Button,
  TextField,
  Typography,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  IconButton,
  Link,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { ChangeEvent, FormEvent } from "react";
import CSS from "csstype";
import Navbar from "./Navbar";
import LoginIcon from "@mui/icons-material/Login";
import axios from "axios";
import { useTokenStore } from "../store/TokenStore";
import { useUserIdStore } from "../store/UserIdStore";
import { useNavigate } from "react-router-dom";
import ImageInput from "./ImageInput";

const baseUrl = "http://localhost:4941/api/v1";

const Register = () => {
  const setToken = useTokenStore((state) => state.setToken);
  const token = useTokenStore((state) => state.token);
  const setUserId = useUserIdStore((state) => state.setUserId);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [firstName, setFirsName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setpassword] = React.useState("");
  const [image, setImage] = React.useState<File | null>(null);
  const validImageTypes = ["image/jpeg", "image/gif", "image/png", "image/jpg"];
  const [errorFlag, setErrorFlag] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  var userId = -1;
  var tokenForProfile = "";

  const logInCardStyles: CSS.Properties = {
    maxWidth: "550px",
    borderRadius: "10px",
    margin: "20px",
  };

  const mainGridStyles: CSS.Properties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const handleImageSelect = (File: File) => {
    if (validImageTypes.includes(File.type)) {
      setErrorFlag(false);
    }
    setImage(File);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const updateFirstNameState = (event: ChangeEvent<HTMLInputElement>) => {
    setFirsName(event.target.value);
  };

  const updateLastNameState = (event: ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const updateEmailState = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const updatePasswordState = (event: ChangeEvent<HTMLInputElement>) => {
    setpassword(event.target.value);
    if (password.length >= 6) {
      setErrorFlag(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 6) {
      setErrorFlag(true);
      setErrorMessage("Password must be at least 6 characters long");
    } else if (image !== null && !validImageTypes.includes(image.type)) {
      setErrorFlag(true);
      setErrorMessage("Invalid file type: Image must be JPG, PNG or GIF");
    } else {
      registerUser();
    }
  };

  const registerUser = () => {
    const postConfig = {
      method: "post",
      url: baseUrl + "/users/register",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      },
    };

    axios(postConfig).then(
      (response) => {
        userId = response.data.userId;
        loginUser();
      },
      (error) => {
        console.error(error);
        setErrorFlag(true);
        setErrorMessage(error.response.statusText.substring(11));
      }
    );
  };

  const loginUser = () => {
    const postConfig = {
      method: "post",
      url: baseUrl + "/users/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: email,
        password: password,
      },
    };

    axios(postConfig).then(
      (response) => {
        setUserId(response.data.userId);
        setToken(response.data.token);
        tokenForProfile = response.data.token;
        userId = response.data.userId;
        if (image !== null) {
          addProfilePicture();
        } else {
          navigate("/user/" + userId);
        }
      },
      (error) => {
        setErrorFlag(true);
        setErrorMessage(error.response.statusText);
      }
    );
  };

  const addProfilePicture = () => {
    const config = {
      method: "put",
      url: baseUrl + "/users/" + userId + "/image",
      headers: {
        "Content-Type": image?.type,
        "X-Authorization": tokenForProfile,
      },
      data: image,
    };

    console.log(userId);
    axios(config)
      .then(function (response) {
        navigate("/user/" + userId);
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
          <Card sx={logInCardStyles}>
            <Typography variant="h2">Register</Typography>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      value={firstName}
                      onChange={updateFirstNameState}
                      sx={{ width: "300px" }}
                      label="First Name"
                      placeholder="Enter first name"
                      required
                    ></TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      onChange={updateLastNameState}
                      value={lastName}
                      sx={{ width: "300px" }}
                      label="Last Name"
                      placeholder="Enter last name"
                      required
                    ></TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      onChange={updateEmailState}
                      value={email}
                      sx={{ width: "300px" }}
                      type="email"
                      label="Email"
                      placeholder="example@gmail.com"
                      required
                    ></TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl sx={{ width: "300px" }} variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-password">
                        Password
                      </InputLabel>
                      <OutlinedInput
                        value={password}
                        onChange={updatePasswordState}
                        id="outlined-adornment-password"
                        type={showPassword ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Add profile picture
                    </Typography>
                    <ImageInput
                      isRequired={false}
                      onImageSelect={handleImageSelect}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ width: "300px" }}
                      startIcon={<LoginIcon />}
                    >
                      Register
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Link href="/login">Already have an account?</Link>
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

export default Register;
