// src/components/TodoOptions.tsx
import { createSignal, Show, onMount, onCleanup } from "solid-js";
import { Ellipsis, Pencil, Trash2 } from "lucide-solid";

   type Props = {
   onEdit: () => void;
   onDelete: () => void;
   };

   export default function TodoOptions(props: Props) {
   const [menuOpen, setMenuOpen] = createSignal(false);

   const toggleMenu = (e: Event) => {
      e.stopPropagation();
      setMenuOpen((prev) => !prev);
   };

  const closeMenu = () => setMenuOpen(false);

  onMount(() => {
   const handleClickOutside = (e: MouseEvent) => {
      // Only close if clicking outside the dropdown
      const target = e.target as HTMLElement;
      if (!target.closest(".todo-options")) {
         closeMenu();
      }
   };

   window.addEventListener("click", handleClickOutside);
      onCleanup(() => window.removeEventListener("click", handleClickOutside));
   });

   return (
      <div class="relative todo-options" onClick={(e) => e.stopPropagation()}>
         {/* Ellipsis Icon */}
         <button
            onClick={toggleMenu}
            class="block md:hidden group-hover:flex cursor-pointer items-center justify-center"
         >
            <Ellipsis size={18} class="text-(--dark-text)" />
         </button>

         {/* Dropdown Menu */}
         <Show when={menuOpen()}>
            <div
               class="absolute right-0 mt-2 bg-(--bg) dark:bg-(--bgd) border border-(--border)
                     rounded-lg shadow-md z-50 animate-fade-in min-w-[150px] py-1 px-1"
            >
               <button
                  class="flex items-center gap-2 w-full text-left px-4 py-2 text-sm cursor-pointer rounded-lg hover:bg-[#cfcaca]"
                  onClick={() => {
                  props.onEdit();
                  closeMenu();
                  }}
               >
                  <Pencil size={15} class="text-(--dark-text)" />
                  Edit
               </button>

               <button
                  class="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 cursor-pointer rounded-lg hover:bg-[#cfcaca]"
                  onClick={() => {
                  props.onDelete();
                  closeMenu();
                  }}
               >
                  <Trash2 size={15} class="text-red-500" />
                  Delete
               </button>
            </div>
         </Show>
      </div>
   );
}
