import { For, Show, createSignal, onMount } from "solid-js";
import { useAuth } from "~/context/AuthContext";

export default function CompletedPage() {
  const { user } = useAuth();
  const [completed, setCompleted] = createSignal<any[]>([]);

  // Load completed todos from localStorage
  onMount(() => {
    // Retrieve the logged-in user's username
    const username = localStorage.getItem("user");

    // Load that user's completed todos (fallback to empty array)
    const stored = JSON.parse(localStorage.getItem(`completedTodos_${username}`) || "[]");

    // Add a completedAt timestamp if missing
    const withDates = stored.map((t: any) => ({
      ...t,
      completedAt: t.completedAt || new Date().toISOString(),
    }));

    // Update state and store under the current user's key
    setCompleted(withDates);

    if (username) {
      localStorage.setItem(`completedTodos_${username}`, JSON.stringify(withDates));
    }
  });

  // Group todos by date
  const groupedByDate = () => {
    const grouped: Record<string, any[]> = {};
    for (const t of completed()) {
      const date = new Date(t.completedAt).toDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(t);
    }
    return grouped;
  };

  // Format date header (e.g., “Oct 29 • Today, Tuesday”)
  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      weekday: "long",
    };
    const formatted = date.toLocaleDateString("en-US", options);
    return isToday ? `${formatted} • Today` : formatted;
  };

  return (
    <div class="">
      <h2 class="text-2xl font-semibold mb-6">Activity: All Projects</h2>

      <Show when={completed().length} fallback={<p class="text-(--light-text)">No completed tasks yet.</p>}>
        <div class="flex flex-col gap-6">
          <For each={Object.entries(groupedByDate())}>
            {([date, tasks]) => (
              <div>
                {/* Date header */}
                <h3 class="text-base font-bold text-(--dark-text) mb-3 pb-1">
                  {formatDateHeader(date)}
                </h3>

                {/* Task activity list */}
                <ul class="flex flex-col gap-4">
                  <For each={tasks}>
                    {(task) => (
                      <li class="flex items-center gap-3 border border-(--border) rounded-lg p-2 hover:bg-[rgba(255,255,255,0.05)] transition-colors max-w-[500px]">
                        {/* Avatar */}
                        <div class="w-10 h-10 rounded-full bg-(--bgd) flex items-center justify-center text-sm font-semibold text-(--light-text)">
                          {user()?.charAt(0).toUpperCase() || "U"}
                        </div>

                        {/* Message */}
                        <div class="text-sm text-(--dark-text)">
                          Completed:{" "}
                          <span class="text-[12px] underline sm:font-medium text-red-500">{task.task}</span>
                        </div>
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
