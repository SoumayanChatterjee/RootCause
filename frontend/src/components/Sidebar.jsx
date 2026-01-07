import { NavLink } from "react-router-dom";

export default function Sidebar({ role }) {
  return (
    <div className="sidebar">
      <h1>RootCause</h1>

      {role === "farmer" && (
        <>
          <NavLink to="/farmer/dashboard">Dashboard</NavLink>
          <NavLink to="/farmer/disease">Disease Detection</NavLink>
          <NavLink to="/farmer/treatment">Treatment</NavLink>
          <NavLink to="/farmer/yield">Yield Prediction</NavLink>
        </>
      )}

      {role === "admin" && (
        <>
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
        </>
      )}
    </div>
  );
}
