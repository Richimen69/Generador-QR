import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import QRCodeGenerator from "./QRCodeGenerator";
function App() {
  return (
    <>
      <div>
        <QRCodeGenerator />
      </div>
    </>
  );
}

export default App;
