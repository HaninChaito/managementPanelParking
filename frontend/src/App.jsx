import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import RequestsTable from "./Pages/RequestsTable/RequestsTable";
import Login from "./Pages/Login/Login";
import VisitorRequestForm from "./Pages/VisitorRequestForm/VisitorRequestForm";
import RequestsHistory from "./Pages/RequestsHistory/RequestsHistory";
import AddManagerForm from "./Pages/AddManager/addManager";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode"; 
import CreateAccount from "./Pages/CreateAccount/CreateAccount";
import SetPassword from "./Pages/SetPassword/SetPassword";


function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/RequestsTable" element={<RequestsTable />} />
          <Route path="/VisitorRequestForm" element={<VisitorRequestForm />} />
          <Route path="/RequestsHistory" element={<RequestsHistory />} />
          <Route path="/AddManagerForm" element={<AddManagerForm/>} />
          <Route path="/CreateAccount" element={<CreateAccount />} />
          <Route path="/SetPassword/:email" element={<SetPassword />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
