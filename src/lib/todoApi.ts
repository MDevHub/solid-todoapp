// src/lib/todoApi.ts
import { apiFetch } from "~/lib/api";

// Lightweight todo API helpers that return the parsed response body
// (apiFetch itself returns { res, body }).

export async function getTodos(userId: string) {
  const { body } = await apiFetch(`/users/${userId}/todos`, {
    method: "GET",
  });
  return body;
}

export async function createTodo(userId: string, task: string) {
  const { body } = await apiFetch(`/users/${userId}/todos`, {
    method: "POST",
    body: JSON.stringify({ task }),
  });
  return body;
}

export async function updateTodo(
  userId: string,
  todoId: string,
  updates: { task?: string; completed?: boolean }
) {
  const { body } = await apiFetch(`/users/${userId}/todos/${todoId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return body;
}

export async function deleteTodo(userId: string, todoId: string) {
   const { body } = await apiFetch(`/users/${userId}/todos/${todoId}`, {
      method: "DELETE",
   });
   return body;
}
