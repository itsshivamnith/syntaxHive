import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import AuthLayout from "./components/auth/AuthLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import HomeLayout from "@/components/Home/HomeLayout";
import UserSelection from "./components/selections/UserSelection";
import CodeEditor from "./components/code-editor/CodeEditor";
import { ThemeProvider } from "next-themes";

const client = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<AuthLayout />}>
        <Route path="signin" element={<SignIn />} />
        <Route path="signup" element={<SignUp />} />
      </Route>

      <Route path="/" element={<HomeLayout />}>
        <Route index element={<App />} />
        <Route path="start" element={<UserSelection />} />
        <Route path="editor" element={<CodeEditor />} />
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark">
      <QueryClientProvider client={client}>
        <Toaster/>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
