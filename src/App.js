import React from "react";
import "./App.css";
import NewCoursePlayer from "./components/CoursePlayer/CoursePlayer";
import CustomContainer from "./components/CustomContainer/CustomContainer";
import ToastManager from "./components/ToastManager/ToastManager";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Course Video Player</h1>
      </header>
      <main>
        <CustomContainer>
          <div className="player-container new">
            <NewCoursePlayer />
          </div>
        </CustomContainer>
      </main>
      <ToastManager />
      <footer className="App-footer">
        <p>&copy; {new Date().getFullYear()} Course Video Player</p>
      </footer>
    </div>
  );
}

export default App;
