import "./App.css";
import UserRegistration from "./Components/userRegistration";
import ProductRegistration from "./Components/productRegistration";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFoundPage from "./Components/NotFoundPage";
import Homepage from "./Components/Homepage";
import AuthFlow from "./Components/AuthFlow";
function App() {
  return (
    <>
<Router>
  <Routes>
    <Route path="/" element={<Homepage />} />
    <Route path="/auth" element={<UserRegistration />} />
    <Route path="/products" element={<ProductRegistration />} />
    <Route path="/auth-flow" element={<AuthFlow />} />
    <Route path="*" element={<NotFoundPage />} />

  </Routes>
</Router>

    </>
  );
}

export default App;
