import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import Directory from "./pages/Directory";
import CommitteePage from "./pages/CommitteePage";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import CreateStory from "./pages/CreateStory";
import CreateUpdate from "./pages/CreateUpdate";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/committee/:id" element={<CommitteePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/create-story" element={<CreateStory />} />
        <Route path="/create-update" element={<CreateUpdate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
