import { createSignal, createResource, For, Show, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Plus } from "lucide-solid";
import AddTaskModal from "~/components/AddTaskModal";
import { useAuth } from "~/context/AuthContext";
import { getTodos, deleteTodo } from "~/lib/todoApi";
import TodoOptions from "~/components/TodoOptions";

type Props = {
  showAddModal: () => boolean;
  setShowAddModal: (v: boolean) => void;
};

export default function DashboardMain(props: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [reloadKey, setReloadKey] = createSignal(0);

  const [todos, { refetch, mutate }] = createResource(
    () => [user(), reloadKey()] as const,
    async ([username]) => {
      if (!username) return [];
      try {
        const data = await getTodos(username);
        const storedCompleted = JSON.parse(localStorage.getItem(`completedTodos_${username}`) || "[]");
			const active = Array.isArray(data)
			? data.filter((t: any) => !storedCompleted.some((c: any) => c.id === t.id))
			: [];
			return active;

      } catch (err: any) {
        if (err?.status === 401) {
          try {
            logout();
          } catch {}
          try {
            navigate("/signin");
          } catch {}
          return [];
        }
        throw err;
      }
    },
    { initialValue: [] as any[] }
  );

  const [completedTodos, setCompletedTodos] = createSignal<any[]>([]);

  onMount(() => {
    const stored = JSON.parse(localStorage.getItem("completedTodos") || "[]");
    setCompletedTodos(stored);
  });

  // Save completed todos anytime it changes
  const saveCompleted = (list: any[]) => {
    setCompletedTodos(list);
    localStorage.setItem("completedTodos", JSON.stringify(list));
  };

  // Add Todo handler
  const handleCreated = (newTodo: any) => {
    try {
      mutate((prev: any[] | undefined) => (prev ? [newTodo, ...prev] : [newTodo]));
    } catch {
      setReloadKey((k) => k + 1);
      refetch();
    }
  };

  const [todoToEdit, setTodoToEdit] = createSignal<any | null>(null);

  // Edit Todo handler (optimistic)
	const handleUpdated = (updatedTodo: any) => {
		mutate((prev: any[] | undefined) =>
			prev ? prev.map((t) => (t.id === updatedTodo.id ? { ...t, ...updatedTodo } : t)) : []
		);
	};

	  // Delete Todo handler (optimistic + API sync)
	const handleDeleted = async (id: string) => {
		const userId = user();
		if (!userId) return;

		// Optimistically update UI
		mutate((prev: any[] | undefined) => (prev ? prev.filter((t) => t.id !== id) : []));

		try {
			await deleteTodo(userId, id);
		} catch (err) {
			console.error("Delete failed:", err);
			// fallback: refetch if API call failed
			refetch();
		}
		};
		// Popup signal
		const [completedMessage, setCompletedMessage] = createSignal<string | null>(null);

		// Handle task completion
			const handleComplete = (todo: any) => {
		const username = localStorage.getItem("user");
		if (!username) return;

		// 1. Remove from current todos (optimistic)
		mutate(prev => (prev ? prev.filter(t => t.id !== todo.id) : []));

		// 2. Save completed item per user
		const completedItem = { ...todo, completed: true, completedAt: new Date().toISOString() };
		const prevCompleted = JSON.parse(localStorage.getItem(`completedTodos_${username}`) || "[]");
		const updatedCompleted = [completedItem, ...prevCompleted];
		localStorage.setItem(`completedTodos_${username}`, JSON.stringify(updatedCompleted));
		setCompletedTodos(updatedCompleted);

		// 3. Show popup
		setCompletedMessage(`Todo completed: ${todo.task}`);
		setTimeout(() => setCompletedMessage(null), 2500);
		};

	// ✅ Mark as completed handler (local-only)
	const handleToggleCompleted = (todo: any) => {
		// remove from active list
		mutate((prev: any[] | undefined) => (prev ? prev.filter((t) => t.id !== todo.id) : []));
		// add to completed list
		const newCompleted = [todo, ...completedTodos()];
		saveCompleted(newCompleted);
	};

  return (
		<div class="p-">
			<div class="flex items-center justify-between mb-6">
			<h2 class="text-2xl font-semibold">Inbox</h2>
			<button
				onClick={() => {
					setTodoToEdit(null);
					props.setShowAddModal(true);
				}}
				class="group flex items-center gap-2 text-sm p-2 rounded-xl cursor-pointer transition-colors duration-300"
			>
				<div class="w-6 h-6 flex items-center justify-center rounded-full group-hover:bg-[rgba(255,255,255,0.05)]">
					<Plus size={18} class="text-(--dark-text) group-hover:text-red-500" />
				</div>
				<span class="font-medium text-(--dark-text) group-hover:text-red-500">
					Add Task
				</span>
			</button>
			</div>

			<Show when={!todos.loading} fallback={<p class="text-(--light-text)">Loading tasks...</p>}>
				<Show when={todos()?.length} fallback={<p class="text-(--light-text)">No tasks yet. Add one!</p>}>
					<ul class="flex flex-col gap-3">
						<For each={todos()}>
						{(todo: any) => (
							<div
								tabindex="0"
								class="group flex items-center justify-between border border-(--border) rounded-lg p-3 transition-colors duration-300 hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] max-w-[400px] w-full"
							>
								<div class="flex items-center gap-3">
								<input
										type="checkbox"
										checked={todo.completed}
										onChange={() => handleComplete(todo)}
										class="cursor-pointer rounded-full accent-red-500 w-4 h-4"
									/>

								<span class="text-(--dark-text) text-sm truncate">
									{todo.task}
								</span>
								</div>

								<TodoOptions
								onEdit={() => {
									setTodoToEdit(todo);
									props.setShowAddModal(true);
								}}
								onDelete={() => handleDeleted(todo.id)}
								/>
							</div>
						)}
						</For>
					</ul>
				</Show>
			</Show>

			<AddTaskModal
				show={props.showAddModal()}
				onClose={() => {
					props.setShowAddModal(false);
					setTodoToEdit(null);
				}}
				onCreated={handleCreated}
				onUpdated={handleUpdated}
				todoToEdit={todoToEdit()}
			/>

			{/* Completion Popup */}
			<Show when={completedMessage()}>
				<div class="fixed bottom-5 left-5 bg-(--bgd) text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in">
					{completedMessage()}
				</div>
			</Show>

		</div>
	);
}
