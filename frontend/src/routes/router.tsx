import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Home from "../components/home";
import Signin from "../components/sign-in";
import Protected from "./protected";
import Signup from "../components/sign-up";
import { SingleElimination } from "../components/types-elimination";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/">
          <Route element={<Protected />}>
            <Route path="/tournament" element={<SingleElimination id="672e02dc9f2e0a54b3bb53c7"/>} />
          </Route>
          <Route path="home" element={<Home />} />
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
          <Route path="*" element={<h1>Page not found</h1>} />
        </Route>
  ),{
    future: {
      v7_relativeSplatPath: true, 
      v7_fetcherPersist: true, 
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true, 
    },
  }
);

export default router