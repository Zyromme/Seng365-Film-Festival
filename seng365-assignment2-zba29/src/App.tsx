import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./components/NotFound";
import FilmsTable from "./components/FilmsTable";
import Film from "./components/Film";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import Films from "./components/Films";
import Login from "./components/Login";
import Register from "./components/Register";
import User from "./components/User";
import CreateFilm from "./components/CreateFilm";
import MyFilms from "./components/MyFilms";
import EditFilm from "./components/EditFilm";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Router>
          <div>
            <Routes>
              <Route path="/films" element={<Films />} />
              <Route path="/" element={<Films />} />
              <Route path="/myFilms" element={<MyFilms />} />
              <Route path="/createFilm" element={<CreateFilm />} />
              <Route path="/film/:id" element={<Film />} />
              <Route path="/editFilm/:id" element={<EditFilm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/user/:id" element={<User />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
