import { createMemo, Show, type Setter } from "solid-js";
import { Bell, LayoutGrid } from "lucide-solid";
import { useAuth } from "~/context/AuthContext";
import SidebarContent from "~/components/SidebarContent";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  setShowAddModal: (v: boolean) => void;
  setCurrentPage: (page: string) => void; // 
};


export default function Sidebar(props: Props) {
  const { user } = useAuth();

  const name = createMemo(() => user() || "Guest");
  const avatar = createMemo(
    () => `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name())}`
  );

  return (
    <>
      <aside
        class={`fixed top-0 left-0 h-screen z-30 
                bg-(--bgd) text-(--light-text) border-r border-(--border)
                transition-transform duration-500 ease-in-out
                ${props.open ? "translate-x-0" : "-translate-x-full"}
                w-screen sm:w-[70vw] md:w-[30vw] lg:w-[20rem]`}
      >
         <div class="h-full flex flex-col p-4">
            {/* Top row */}
            <div class="flex items-center justify-between mb-7">
               <div class="flex items-center gap-3">
               <img
                  src={avatar()}
                  alt="avatar"
                  class="cursor-pointer w-10 h-10 rounded-full border border-(--border)"
               />
                  <div class="flex flex-col">
                     <span class="font-medium text-sm text-(--light-text)">
                        {name()}
                     </span>
                  </div>
               </div>

                  <div class="flex items-center gap-1">
                     <button
                        class="cursor-pointer p-2 rounded-md hover:bg-[rgba(255,255,255,0.1)]"
                        aria-label="Notifications"
                     >
                        <Bell size={18} />
                     </button>

                     <button
                        onClick={() => props.setOpen(!props.open)}
                        class="cursor-pointer p-2 rounded-md hover:bg-[rgba(255,255,255,0.1)]"
                        aria-label="Toggle sidebar"
                     >
                        <LayoutGrid size={18} />
                     </button>
                  </div>
               </div>

            {/* Example content */}
            <div class="flex-1 flex flex-col text-sm opacity-80">
               <SidebarContent
                    setShowAddModal={props.setShowAddModal}
                  setCurrentPage={props.setCurrentPage}
                  setOpen={props.setOpen}
               />
            </div>
        </div>
      </aside>

      {/* mobile backdrop */}
      <Show when={props.open}>
        <div
          class="fixed inset-0 bg-black/40 z-20 md:hidden transition-opacity duration-300"
          onClick={() => props.setOpen(false)}
        />
      </Show>
    </>
  );
}
