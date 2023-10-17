import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, FormEvent } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoginIcon from "@mui/icons-material/Login";
import { useTokenStore } from "../store/TokenStore";
import { useUserIdStore } from "../store/UserIdStore";
import { useNavigate } from "react-router-dom";
import { UserReturnWithEmail } from "../types/userTypes";
import axios from "axios";
import ImageInput from "./ImageInput";

interface Props {
  user: UserReturnWithEmail;
}

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
const EditProfileForm = ({ user }: Props) => {
  const token = useTokenStore((state) => state.token);
  const userId = useUserIdStore((state) => state.userId);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [firstName, setFirsName] = React.useState(user.firstName);
  const [lastName, setLastName] = React.useState(user.lastName);
  const [email, setEmail] = React.useState(user.email);
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [editPassword, setEditPassword] = React.useState(false);
  const [image, setImage] = React.useState<File | null>(null);
  const validImageTypes = ["image/jpeg", "image/gif", "image/png", "image/jpg"];
  const [errorFlag, setErrorFlag] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleImageSelect = (File: File) => {
    if (validImageTypes.includes(File.type)) {
      setImage(File);
    } else {
      setErrorFlag(true);
      setErrorMessage("Invalid file type: Image must be JPG, PNG or GIF");
    }
  };
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setFirsName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setImage(null);
    setOpen(false);
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

  const updateOldPasswordState = (event: ChangeEvent<HTMLInputElement>) => {
    setOldPassword(event.target.value);
  };

  const updateNewPasswordState = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
    if (event.target.value !== "" && event.target.value.length < 6) {
      setErrorFlag(true);
      setErrorMessage("Password must be at least 6 characters long");
    } else {
      setErrorFlag(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateUser();
  };

  const updateUser = () => {
    var data;
    if (oldPassword !== "" || newPassword !== "") {
      data = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        currentPassword: oldPassword,
        password: newPassword,
      };
    } else {
      data = {
        firstName: firstName,
        lastName: lastName,
        email: email,
      };
    }

    var config = {
      method: "patch",
      url: "http://localhost:4941/api/v1/users/" + userId,
      headers: {
        "X-Authorization": token,
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (image !== null) {
          updateProfilePicture();
        }
        window.location.reload();
      })
      .catch(function (error) {
        setErrorFlag(true);
        setErrorMessage(error.response.statusText);
      });
  };

  const updateProfilePicture = () => {
    const config = {
      method: "put",
      url: "http://localhost:4941/api/v1/users/" + userId + "/image",
      headers: {
        "Content-Type": image?.type,
        "X-Authorization": token,
      },
      data: image,
    };

    axios(config)
      .then(function (response) {
        navigate("/user/" + userId);
      })
      .catch(function (error) {
        setErrorFlag(true);
        setErrorMessage(error.response.statusText);
      });
  };

  const toggleEditPassword = () => {
    setOldPassword("");
    setNewPassword("");
    setEditPassword((prevState) => !prevState);
  };

  const showChangePassword = () => {
    return (
      <>
        <Grid item xs={12}>
          <FormControl sx={{ width: "300px" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Current Password
            </InputLabel>
            <OutlinedInput
              value={oldPassword}
              onChange={updateOldPasswordState}
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
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl sx={{ width: "300px" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              New Password
            </InputLabel>
            <OutlinedInput
              value={newPassword}
              onChange={updateNewPasswordState}
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
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
        </Grid>
      </>
    );
  };

  return (
    <>
      <div>
        <Button onClick={handleOpen} variant="outlined">
          Edit Profile
        </Button>
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12} marginBottom="10px">
                  <Typography>Change Profile Picture:</Typography>
                  <ImageInput
                    isRequired={false}
                    onImageSelect={handleImageSelect}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    value={firstName}
                    onChange={updateFirstNameState}
                    sx={{ width: "300px" }}
                    label="New First Name"
                    placeholder="Enter first name"
                  ></TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    onChange={updateLastNameState}
                    value={lastName}
                    sx={{ width: "300px" }}
                    label="New Last Name"
                    placeholder="Enter last name"
                  ></TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    onChange={updateEmailState}
                    value={email}
                    sx={{ width: "300px" }}
                    type="email"
                    label="New Email"
                    placeholder="example@gmail.com"
                  ></TextField>
                </Grid>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editPassword}
                      onChange={toggleEditPassword}
                    />
                  }
                  label="Change Password"
                />
                {editPassword ? showChangePassword() : null}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ width: "300px" }}
                    startIcon={<LoginIcon />}
                  >
                    Update Profile
                  </Button>
                </Grid>
              </Grid>
            </form>
            {errorFlag && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Alert>
            )}
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default EditProfileForm;
