import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthFlow from "./Components/AuthFlow";
import NotFoundPage from "./Components/NotFoundPage";
import Homepage from "./Components/Homepage"; 
// import Shop from "./components/Shop";
// import Merchant from "./components/Merchant";
// import Driver from "./components/Driver";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/auth" element={<AuthFlow />} />
        <Route path="/login" element={<AuthFlow />} />
        <Route path="/register" element={<AuthFlow />} />
        {/* <Route path="/shop" element={<Shop />} /> */}
        {/* <Route path="/merchant" element={<Merchant />} /> */}
        {/* <Route path="/driver" element={<Driver />} /> */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;