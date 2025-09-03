import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Menu from './pages/Menu/Menu';
import { GameEngineProvider } from './hooks/useGameEngine';
import Lobby from './pages/Lobby/Lobby';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Menu />
  },
  {
    path: "/lobby",
    element: <Lobby />
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GameEngineProvider>
      <RouterProvider router={router} />
    </GameEngineProvider>
  </StrictMode>,
)
