import { Navigate, Route, Routes } from "react-router-dom";
import { Dashboard } from "./instructor/Dashboard";
import { SessionRunner } from "./instructor/SessionRunner";
import { ExportPage } from "./instructor/ExportPage";
import { AssessmentKiosk } from "./instructor/AssessmentKiosk";
import { PrincipalReport } from "./instructor/PrincipalReport";
import { LoginPage } from "./instructor/LoginPage";
import { RequireAuth } from "./instructor/RequireAuth";
import { JoinPage } from "./student/JoinPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/console" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/console"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/console/sessions/:id"
        element={
          <RequireAuth>
            <SessionRunner />
          </RequireAuth>
        }
      />
      <Route
        path="/console/sessions/:id/assessment-kiosk"
        element={
          <RequireAuth>
            <AssessmentKiosk />
          </RequireAuth>
        }
      />
      <Route
        path="/console/export"
        element={
          <RequireAuth>
            <ExportPage />
          </RequireAuth>
        }
      />
      <Route
        path="/console/report"
        element={
          <RequireAuth>
            <PrincipalReport />
          </RequireAuth>
        }
      />
      <Route path="/join" element={<JoinPage />} />
    </Routes>
  );
}

export default App;
