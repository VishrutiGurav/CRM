
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import MouSignup from "./components/MouSignup"; 
import Sidebar from "./components/Sidebar";
import Application2 from "./components/Application2";
import FillDetails from "./components/FillDetails";
import FillDetails2 from "./components/FillDetails2";
import FillDetails3 from "./components/FillDetails3";
import SuccessPage from "./components/SuccessPage";
import AdminDashboard from "./components/AdminDashboard";
import ClientDashboard from "./components/ClientDashboard";
import Review from "./components/Review";
import MouDocument from "./components/MouDocument";
import MouList from "./components/MouList";
import MouReviewAdmin from "./components/MouReviewAdmin";



function App() {
    return (
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/mou-signup" element={<MouSignup />} />
            <Route path="/signup" element={<SignUpPage />} />
              <Route path="/Sidebar" element={<Sidebar />} />
              <Route path="/filldetails" element={<FillDetails/>} />
              <Route path="/filldetails2" element={<FillDetails2/>}/>
              <Route path="/Application2" element={<Application2/>} />
              <Route path="/filldetails3" element={<FillDetails3/>} />
              <Route path="/Success" element={<SuccessPage/>} />
              <Route path="/admindashboard" element={<AdminDashboard/>}/>
              <Route path="/ClientDashboard" element={<ClientDashboard/>} />
              <Route path="/Review" element={<Review/>} />
              <Route path="/MouDocument" element={<MouDocument/>} />
              <Route path="/MouList" element={<MouList/>} />
              <Route path="/MouReviewAdmin" element={<MouReviewAdmin/>} />
              {/*<Route element={<Layout isOpen={isOpen} setIsOpen={setIsOpen} />}>*/}
          </Routes>
        </Router>
      </div>
    );
  }

export default App;


