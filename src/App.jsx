import React, { useEffect } from 'react';
import Storage from './Components/Storage.jsx';
import Dashboard from "./Components/DashBoard.jsx"
import CargoInput from "./Components/CargoInput";
import CargoStats from './Components/CargoStats';
import Delete from "./Components/Delete.jsx"
import Cargoadded from './Components/Itemadded.jsx';

import { createBrowserRouter,  createRoutesFromElements,  RouterProvider,  Route, } from 'react-router-dom';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<CargoStats />}/>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/input" element={<CargoInput />} />
      <Route path="/storage/:id" element={<Storage />}/>
      <Route path="/delete" element={<Delete />}/>
      <Route path="/cargoadded" element={<Cargoadded />}/>
    </>
  )
);

const App = () => {
  useEffect(() => {document.title = "Team AlgoChefs";}, []);

  return (
    <RouterProvider router={router}/>
  )
}

export default App;