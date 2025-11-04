'use client';

import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { ComplianceTasksProps } from './types';

/**
 * ComplianceTasks Component
 *
 * Manages tasks associated with a compliance requirement. Supports adding new tasks,
 * toggling task completion status, and deleting tasks. Displays an empty state when
 * no tasks are present.
 *
 * @param props - ComplianceTasks component props
 * @returns JSX element representing the compliance tasks tab
 */
const ComplianceTasks: React.FC<ComplianceTasksProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask
}) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const completedTasks = tasks.filter(task => task.completed).length;

  /**
   * Handles adding a new task
   */
  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask?.(newTaskTitle.trim(), newTaskDueDate || undefined);
      setNewTaskTitle('');
      setNewTaskDueDate('');
      setShowAddTask(false);
    }
  };

  /**
   * Handles cancelling task addition
   */
  const handleCancelAddTask = () => {
    setShowAddTask(false);
    setNewTaskTitle('');
    setNewTaskDueDate('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Tasks ({completedTasks}/{tasks.length})
        </h3>
        <button
          onClick={() => setShowAddTask(true)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600
                   bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>

      {/* Add Task Form */}
      {showAddTask && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Task title"
              value={newTaskTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTaskTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTaskDueDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAddTask}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white
                         bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Add Task
              </button>
              <button
                onClick={handleCancelAddTask}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      {tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onToggleTask?.(task.id, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className={`text-sm font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {task.title}
                  </p>
                  {task.dueDate && (
                    <p className="text-xs text-gray-500">
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => onDeleteTask?.(task.id)}
                className="p-1 text-gray-400 hover:text-red-600 rounded"
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks</h3>
          <p className="text-gray-600 mb-4">Add tasks to track progress on this requirement.</p>
          <button
            onClick={() => setShowAddTask(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600
                     bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Task
          </button>
        </div>
      )}
    </div>
  );
};

export default ComplianceTasks;
