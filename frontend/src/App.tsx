import { Routes, Route } from "react-router";
import { Header } from "./components/layout/Header";
import Dashboard from "./components/dashboard/Dashboard";
import Evaluate from "./components/evaluate/Evaluate";
import Runs from "./components/runs/Runs";
import RunDetail from "./components/runs/RunDetail";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/evaluate" element={<Evaluate />} />
          <Route path="/runs" element={<Runs />} />
          <Route path="/runs/:id" element={<RunDetail />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
