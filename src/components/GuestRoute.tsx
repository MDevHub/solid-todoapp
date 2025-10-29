import { useAuth } from "~/context/AuthContext";
import { Navigate } from "@solidjs/router";
import { JSX, Show } from "solid-js";

export default function GuestRoute(props: { children: JSX.Element }) {
  const { token } = useAuth();

  // Reactively show children only if no token
  return (
    <Show
      when={!token()}
      fallback={<Navigate href="/dashboard" />}
    >
      {props.children}
    </Show>
  );
}
