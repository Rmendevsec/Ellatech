import "./App.css";
import UserRegistration from "./Components/userRegistration";
import ProductRegistration from "./Components/productRegistration";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotFoundPage from "./Components/NotFoundPage";
function App() {
  return (
    <>
<Router>
  <Routes>
    <Route path="/users" element={<UserRegistration />} />
    <Route path="/products" element={<ProductRegistration />} />
    <Route path="*" element={<NotFoundPage />} />

  </Routes>
</Router>

    </>
  );
}

export default App;
