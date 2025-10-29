import { Suspense } from "solid-js";
import { useLocation } from "@solidjs/router";
import type { RouteSectionProps } from "@solidjs/router";
import Nav from "~/components/Nav";
import Footer from "~/components/Footer";

export default function Layout(props: RouteSectionProps) {
  const location = useLocation();

  const isDashboard = () => location.pathname.startsWith("/dashboard");

  return (
    <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Render Nav + Footer only for non-dashboard pages */}
      {!isDashboard() && <Nav />}

      <main class="flex-1">
        <Suspense fallback={<p class="text-center mt-8 text-gray-500">Loading...</p>}>
          {props.children}
        </Suspense>
      </main>

      {!isDashboard() && <Footer />}
    </div>
  );
}
