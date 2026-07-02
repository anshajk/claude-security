import { Dashboard } from "./pages/Dashboard";

export function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1>LVT Command Center</h1>
        <small>bootcamp build — not for production</small>
      </header>
      <Dashboard />
    </div>
  );
}
