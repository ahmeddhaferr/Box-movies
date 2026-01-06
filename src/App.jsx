import { useState } from "react";
import "./App.css";

const Card = ({ title }) => {
  const [like, setLike] = useState(false);
  return (
    <div className="card">
      <h2>{title}</h2>

      <button onClick={()=>setLike(!like)}>
        {like ? "liked":"like"}
      </button>
    </div>
  );
};
function App() {
  return (
    <div className="card-container">
      <Card title="apps" />
      <Card title="apps" />
      <Card title="apps" />
    </div>
  );
}

export default App;
