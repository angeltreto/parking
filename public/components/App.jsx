import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <div>
      <h1>¡Hola desde React!</h1>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('react-root'));
root.render(<App />);
