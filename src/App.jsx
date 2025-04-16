// import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./components/Home";
import AddData from "./components/AddData";
import Detail from "./components/Detail";
import Layout from "./components/Layout";
// import { AppProvider } from "./GlobalContext/AppContent";
import { Provider } from "react-redux";
import store from "../store";
import WrongPage from "./components/WrongPage";

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
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </>
  );
}

export default App;
MimeType;
