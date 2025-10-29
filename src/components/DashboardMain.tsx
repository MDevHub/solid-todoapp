import { createSignal, createResource, For, Show } from "solid-js";
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

  // signal for forcing reload after adding a new todo
  const [reloadKey, setReloadKey] = createSignal(0);

	const [todos, { refetch, mutate }] = createResource(
		() => [user(), reloadKey()] as const,
		async ([username]) => {
			if (!username) return [];
			try {
			const data = await getTodos(username);
			return Array.isArray(data) ? data : [];
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
			prev
				? prev.map((t) => (t.id === updatedTodo.id ? { ...t, ...updatedTodo } : t))
				: []
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


  return (
		<div class="p-">
			<div class="flex items-center justify-between mb-6">
			<h2 class="text-2xl font-semibold">Inbox</h2>
			<button
				onClick={() => {
					setTodoToEdit(null); // ensure fresh state
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

			{/* Todos List */}
			<Show when={!todos.loading} fallback={<p class="text-(--light-text)">Loading tasks...</p>}>
			<Show when={todos()?.length} fallback={<p class="text-(--light-text)">No tasks yet. Add one!</p>}>
				<ul class="flex flex-col gap-3">
					<For each={todos()}>
					{(todo: any) => (
						<div
							tabindex="0"
							class="group flex items-center justify-between border border-(--border) rounded-lg p-3 transition-colors duration-300 hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] max-w-[400px] w-full"
						>
							{/* Left side: checkbox + text */}
							<div class="flex items-center gap-3">
							<input
								type="checkbox"
								checked={todo.completed}
								onChange={() => console.log("Toggled:", todo.id)}
								class="cursor-pointer rounded-full accent-red-500 w-4 h-4"
							/>
							<span
								class="text-(--dark-text) text-sm truncate"
								classList={{
									"line-through text-(--light-text)": todo.completed,
								}}
							>
								{todo.task}
							</span>
							</div>

							{/* Right side: ellipsis menu */}
							<TodoOptions
							onEdit={() => {
								setTodoToEdit(todo); // set which todo to edit
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

			{/* Modal handles both Add and Edit */}
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
		</div>
	);
}
