import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import MemberForm from "./components/MemberForm";
import MemberList from "./components/MemberList";
import Register from "./components/Register";
import Login from "./components/Login";
import Unauthorized from "./components/Unauthorized";
import RequireAuth from "./components/RequireAuth";
import Missing from "./components/Missing";
import PersistLogin from "./components/PersistLogin";
import MemberEdit from "./components/MemberEdit";
import MemberView from "./components/MemberView";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={["admin", "user"]} />}>
              <Route path="/" element={<Home />} />
              <Route path="/members" element={<MemberList />} />
              <Route path="/members/new" element={<MemberForm />} />
              <Route path="/members/edit/:id" element={<MemberEdit />} />
              <Route path="/members/:id" element={<MemberView />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Missing />} />
      </Routes>
    </Router>
  );
}

export default App;
