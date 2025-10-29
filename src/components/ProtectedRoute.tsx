// src/components/ProtectedRoute.tsx
import { useAuth } from "~/context/AuthContext";
import { Navigate } from "@solidjs/router";
import { JSX } from "solid-js";

export default function ProtectedRoute(props: { children: JSX.Element }) {
  const { token } = useAuth();

  if (!token()) {
      // If not logged in, redirect to signin (route is /signin)
      return <Navigate href="/signin" />;
   }


  // If logged in, show the protected content
  return props.children;
}
