import { LayoutGrid } from "lucide-solid";
import type { Setter } from "solid-js";

type Props = {
  open: boolean;
  setOpen: Setter<boolean>;
};

export default function DashboardNav(props: Props) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <nav class="text-(--dark-text) py-3 flex items-center justify-between">
      {/* Left side: sidebar icon + date */}
      <div class="flex items-center gap-5">
        {!props.open && (
          <button
            onClick={() => props.setOpen(true)}
            class="cursor-pointer p-2 rounded-md hover:bg-[#cfcaca]/30 transition md:block"
          >
            <LayoutGrid size={20} />
          </button>
        )}

        <span class="hidden sm:block text-lg md:text-xl font-medium text-(--dark-text)">
          {currentDate}
        </span>
      </div>

      {/* Right side: action buttons */}
      <div class="flex items-center gap-2">
        <button class="cursor-pointer bg-[#cfcaca] text-(--dark-text) px-6 py-2 rounded-lg text-sm md:text-base font-medium transition">
          Today
        </button>
      </div>
    </nav>
  );
}
