import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { RootLayout } from "./layouts/layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
