import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import Layout from "~/routes/layout";
import { AuthProvider } from "~/context/AuthContext";
import "./app.css";

export default function App() {
  return (
    <AuthProvider>
      <Router root={Layout}>
        <FileRoutes />
      </Router>
    </AuthProvider>
  );
}
