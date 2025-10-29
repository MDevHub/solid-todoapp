import { Plus, Inbox, CircleCheck, LogOut } from "lucide-solid";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "~/context/AuthContext";

type Props = {
   setShowAddModal?: (v: boolean) => void;
};

const SidebarContent = (props: Props) => {
   const { logout } = useAuth();
   const navigate = useNavigate();
    return (
      <div class="flex flex-col gap-4 text-(--light-text)">
         {/* Add Task button */}
         <button
            onClick={() => props.setShowAddModal?.(true)}
            class="flex items-center gap-4 p-3 rounded-xl hover:bg-[rgba(255,255,255,0.05)] transition-colors duration-300 cursor-pointer"
            >
            <div class="w-5 h-5 flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.05)] text-white">
               <Plus size={12} />
            </div>
            <span class="font-medium text-sm">Add Task</span>
         </button>

         {/* Inbox */}
         <div class="flex items-center gap-4 p-3 rounded-xl hover:bg-[rgba(255,255,255,0.05)] cursor-pointer transition-colors">
            <Inbox size={18} />
            <span class="text-sm">Inbox</span>
         </div>

         {/* Completed */}
         <div class="flex items-center gap-4 p-3 rounded-xl hover:bg-[rgba(255,255,255,0.05)] cursor-pointer transition-colors">
            <CircleCheck size={18} />
            <span class="text-sm">Completed</span>
         </div>

         {/* Logout */}
         <button
            type="button"
            onClick={() => {
               try {
                 logout();
               } finally {
                 // Redirect to sign-in after clearing auth
                 navigate("/signin");
               }
            }}
            class="flex items-center gap-4 p-3 rounded-xl hover:bg-[rgba(255,255,255,0.05)] cursor-pointer transition-colors mt-auto"
         >
            <LogOut size={18} />
            <span class="text-sm">Log out</span>
         </button>
      </div>
   );
};

export default SidebarContent;
