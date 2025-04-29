// import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./components/Home";
import AddData from "./components/AddData";
import Detail from "./components/Detail";
import Layout from "./components/Layout";
import { Provider } from "react-redux";
import store from "../store";
import WrongPage from "./components/WrongPage";
import AuthLayout from "./components/AuthLayout";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import { useOnlineStatus } from "./components/useOnlineStatus";
import NoInternet from "./components/NoInterent";
import { Toaster} from "react-hot-toast";

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
  console.log(isOnline,"onlinestatus");
  
  return (
    <>
      <Provider store={store}>
        {isOnline?<RouterProvider router={router}x />:<NoInternet/>}
        <Toaster position="top-right" />
      </Provider>
    </>
  );
}

export default App;

