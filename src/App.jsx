// import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import AddData from "./pages/AddData";
import Detail from "./pages/Detail";
import Layout from "./layout/Layout";

import WrongPage from "./pages/WrongPage";
import AuthLayout from "./layout/AuthLayout";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { useOnlineStatus } from "./components/useOnlineStatus";
import NoInternet from "./pages/NoInterent";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <SignUp />,
      },
      {
        path: "/auth/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        // index: true,
        path: "/",
        element: <Home />,
      },
      {
        path: "/users",
        element: <Home />,
      },
      {
        path: "/user/:id",
        element: <Detail />,
      },
      {
        path: "addData",
        element: <AddData />,
      },
      {
        path: "*",
        element: <WrongPage />,
      },
      {
        path: "/users/:id",
        element: <AddData />,
      },
    ],
  },
]);
function App() {
  const isOnline = useOnlineStatus();
  return (
    <>
      {isOnline ? <RouterProvider router={router} x /> : <NoInternet />}
      <Toaster position="top-right" />
    </>
  );
}

export default App;
