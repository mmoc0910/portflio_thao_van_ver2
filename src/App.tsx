import { Route, Routes } from "react-router";
import { PortfolioLayout } from "./layouts";
import { Home, MediaProduction, Photography, Resume, SocialMedia } from "./pages";

function App() {
  return (
    <Routes>
      <Route element={<PortfolioLayout />}>
        <Route index element={<Home />} />
        <Route path="/photography" element={<Photography />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/social-media-promotion" element={<SocialMedia />} />
        <Route path="/media-production" element={<MediaProduction />} />
      </Route>
    </Routes>
  );
}

export default App;
