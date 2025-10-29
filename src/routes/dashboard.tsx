import { createSignal } from "solid-js";
import Sidebar from "~/components/Sidebar";
import DashboardNav from "~/components/DashboardNav";
import DashboardMain from "~/components/DashboardMain";
import DashboardFooter from "~/components/DashboardFooter";


export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = createSignal(true);

   // modal state lifted here so Sidebar and Main can both open it
  const [showAddModal, setShowAddModal] = createSignal(false);

  return (
    <div class="min-h-screen flex bg-(--bg) text-(--dark-text)">
      <Sidebar open={sidebarOpen()} setOpen={setSidebarOpen} setShowAddModal={setShowAddModal} />

      {/* Right side adjusts based on sidebar state */}
      <div
        class={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${
          sidebarOpen() ? "md:ml-[30vw] lg:ml-80" : "ml-0"
        }`}
      >
        <header class="sticky px-4 top-0 z-10 bg-(--bg)">
          <DashboardNav open={sidebarOpen()} setOpen={setSidebarOpen} />
        </header>

        <main class="flex-1 overflow-auto p-4">
          <DashboardMain showAddModal={showAddModal} setShowAddModal={setShowAddModal} />
        </main>

        <footer>
          <DashboardFooter />
        </footer>
      </div>
    </div>
  );
}
