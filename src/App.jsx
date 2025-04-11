// import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./components/Home";
import AddData from "./components/AddData";
import Detail from "./components/Detail";
import Layout from "./components/Layout";
import { AppProvider } from "./GlobalContext/AppContent";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
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
    ],
  },
]);
function App() {
  return (
    <>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </>
  );
}

export default App;
