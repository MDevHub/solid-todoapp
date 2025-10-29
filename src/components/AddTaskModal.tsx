// src/components/AddTaskModal.tsx
import { createSignal, createEffect, Show, onMount } from "solid-js";
import { apiFetch } from "~/lib/api";
import { useAuth } from "~/context/AuthContext";

type Props = {
  show: boolean;
  onClose: () => void;
  onCreated?: (todo: any) => void;
  onUpdated?: (todo: any) => void;
  todoToEdit?: any | null; // new prop for edit mode
};

export default function AddTaskModal(props: Props) {
  const { user } = useAuth();
  const [task, setTask] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");

   // Populate or clear input reactively whenever the edit target changes
   createEffect(() => {
   if (props.todoToEdit) {
      setTask(props.todoToEdit.task);
   } else {
      setTask("");
   }
   });


  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");

    const trimmed = task().trim();
    if (!trimmed) {
      setError("Task cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const username = user();
      if (!username) throw new Error("User not authenticated");

      if (props.todoToEdit) {
        // ---- Edit Todo ----
        const path = `/users/${encodeURIComponent(username)}/todos/${props.todoToEdit.id}`;
        const { body } = await apiFetch(path, {
          method: "PUT",
          body: JSON.stringify({ task: trimmed, completed: props.todoToEdit.completed }),
        });

         // Optimistically update UI immediately
         props.onUpdated?.({ ...props.todoToEdit, task: trimmed });
      } else {
        // ---- Add Todo ----
        const path = `/users/${encodeURIComponent(username)}/todos`;
        const { body } = await apiFetch(path, {
          method: "POST",
          body: JSON.stringify({ task: trimmed }),
        });

        props.onCreated?.(body);
      }

      setTask("");
      props.onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save todo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Show when={props.show}>
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" onClick={props.onClose} />
        <form
          onSubmit={handleSubmit}
          class="relative z-60 bg-(--bg) dark:bg-(--bgd) rounded-lg p-6 w-[min(560px,90vw)] shadow-lg"
        >
          <h3 class="text-lg text-(--dark-text) font-semibold mb-3">
            {props.todoToEdit ? "Edit Task" : "Add Your Task"}
          </h3>

          {error() && <p class="text-red-500 text-sm mb-2">{error()}</p>}

          <input
            value={task()}
            onInput={(e) => setTask(e.currentTarget.value)}
            class="w-full p-2 border border-(--border) rounded-lg mb-4 outline-none focus:border-(--accent)"
            placeholder="Hit the gym, Read a book, etc..."
            required
            maxLength={100}
          />

          <div class="flex justify-end gap-3">
            <button
              type="button"
              onClick={props.onClose}
              class="cursor-pointer px-3 py-1.5 rounded-lg border hover:bg-(--hover-bg) transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading()}
              class="cursor-pointer px-3 py-1.5 rounded-lg bg-(--bgd) hover:bg-(--bgd)/90 text-white transition disabled:opacity-70"
            >
              {props.todoToEdit ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </Show>
  );
}
