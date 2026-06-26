import "./App.css";
import UserRegistration from "./Components/userRegistration";
import ProductRegistration from "./Components/productRegistration";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
<Router>
  <Routes>
    <Route path="/users" element={<UserRegistration />} />
    <Route path="/products" element={<ProductRegistration />} />

  </Routes>
</Router>

    </>
  );
}

export default App;
