import { Suspense } from "solid-js";
import type { RouteSectionProps } from "@solidjs/router";
import Nav from "~/components/Nav";
import Footer from "~/components/Footer";

export default function Layout(props: RouteSectionProps) {
  return (
    <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Nav />
      <main class="flex-1">
        <Suspense fallback={<p class="text-center mt-8 text-gray-500">Loading...</p>}>
          {props.children}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
