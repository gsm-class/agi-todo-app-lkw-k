"use client";

import { useTodos } from "@/hooks/useTodos";
import TaskForm from "@/components/TaskForm";
import TaskFilter from "@/components/TaskFilter";
import TaskList from "@/components/TaskList";

export default function Home() {
  const {
    tasks,
    isLoading,
    showCompleted,
    setShowCompleted,
    addTask,
    editTask,
    deleteTask,
    toggleComplete,
  } = useTodos();

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* 작업 추가 폼 */}
          <TaskForm onAddTask={addTask} />

          {/* 필터 */}
          <TaskFilter
            showCompleted={showCompleted}
            onToggleShowCompleted={setShowCompleted}
          />

          {/* 작업 목록 */}
          <TaskList
            tasks={tasks}
            onToggleComplete={toggleComplete}
            onEdit={editTask}
            onDelete={deleteTask}
          />
        </div>
      </div>
    </main>
  );
}