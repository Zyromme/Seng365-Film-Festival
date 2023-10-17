import {
  Card,
  CardContent,
  FormControl,
  Grid,
  Button,
  TextField,
  Typography,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Link,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoginIcon from "@mui/icons-material/Login";
import React, { ChangeEvent, FormEvent } from "react";
import CSS from "csstype";
import Navbar from "./Navbar";
import axios from "axios";
import { useTokenStore } from "../store/TokenStore";
import { useUserIdStore } from "../store/UserIdStore";
import { useNavigate } from "react-router-dom";

const baseUrl = "http://localhost:4941/api/v1";

const Login = () => {
  const token = useTokenStore((state) => state.token);
  const setToken = useTokenStore((state) => state.setToken);
  const navigate = useNavigate();
  const userId = useUserIdStore((state) => state.userId);
  const setUserId = useUserIdStore((state) => state.setUserId);
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setpassword] = React.useState("");
  const [errorFlag, setErrorFlag] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    if (token !== "") {
      navigate("/user/" + userId);
    }
  });

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

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const updateEmailState = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const updatePasswordState = (event: ChangeEvent<HTMLInputElement>) => {
    setpassword(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginUser();
  };

  const loginUser = () => {
    if (password.length < 6) {
      setErrorFlag(true);
      setErrorMessage("Password must be at least 6 characters long");
    } else {
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
          setToken(response.data.token);
          setUserId(response.data.userId);
          navigate("/user/" + response.data.userId);
        },
        (error) => {
          console.error(error);
          setErrorFlag(true);
          setErrorMessage(error.response.statusText);
        }
      );
    }
  };

  return (
    <>
      <Navbar />
      <Grid container sx={mainGridStyles}>
        <Grid item>
          <Card sx={logInCardStyles}>
            <Typography variant="h2">Login</Typography>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      sx={{ width: "300px" }}
                      type="email"
                      label="Email"
                      placeholder="example@gmail.com"
                      required
                      onChange={updateEmailState}
                      value={email}
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
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ width: "300px" }}
                      startIcon={<LoginIcon />}
                    >
                      Login
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Link href="/register">Sign up?</Link>
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

export default Login;
