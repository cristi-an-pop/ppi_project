import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Unauthorized from "./components/Unauthorized";
import RequireAuth from "./components/RequireAuth";
import Missing from "./components/Missing";
import PersistLogin from "./components/PersistLogin";
import Layout from "./components/Layout";
import CaseSelector from "./components/Cases/CaseSelector";
import CaseForm from "./components/Cases/CaseForm";
import CaseReport from "./components/Cases/CaseReport";
import ClientList from "./components/Client/ClientList";
import ClientForm from "./components/Client/ClientForm";
import ClientView from "./components/Client/ClientView";
import ClientEdit from "./components/Client/ClientEdit";

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
              <Route path="/clients" element={<ClientList />} />
              <Route path="/clients/new" element={<ClientForm />} />
              <Route path="/clients/:id" element={<ClientView />} />
              <Route path="/clients/edit/:id" element={<ClientEdit />} />
              <Route path="/clients/:clientId/cases" element={<CaseSelector />} />
              <Route path="/clients/:clientId/cases/new" element={<CaseForm />} />
              <Route path="/clients/:clientId/cases/:caseId" element={<CaseReport />} />
            </Route>
          </Route>
        </Route>
        <Route path="/case" element={<CaseReport />} />
        <Route path="*" element={<Missing />} />
      </Routes>
    </Router>
  );
}

export default App;
