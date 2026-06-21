import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Task, CreateTaskInput, Priority, TaskStatus, RecurrenceType } from '../../types';
import { useTasks } from '../../context/TaskContext';
import { Input, Select, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { format } from 'date-fns';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  status: z.enum(['pending', 'in_progress', 'completed']),
  priority: z.enum(['high', 'medium', 'low']),
  categoryId: z.string().min(1, 'Category is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  dueTime: z.string().optional(),
  recurrence: z.enum(['none', 'daily', 'weekly', 'monthly']),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task;
  onSuccess: () => void;
  onCancel: () => void;
  defaultDate?: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSuccess, onCancel, defaultDate }) => {
  const { categories, addTask, updateTask } = useTasks();
  const isEdit = !!task;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'pending',
      priority: task?.priority || 'medium',
      categoryId: task?.categoryId || categories[0]?.id || '',
      dueDate: task?.dueDate || defaultDate || format(new Date(), 'yyyy-MM-dd'),
      dueTime: task?.dueTime || '',
      recurrence: task?.recurrence || 'none',
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        categoryId: task.categoryId,
        dueDate: task.dueDate,
        dueTime: task.dueTime || '',
        recurrence: task.recurrence,
      });
    }
  }, [task, reset]);

  const onSubmit = async (data: TaskFormData) => {
    const input: CreateTaskInput = {
      title: data.title,
      description: data.description,
      status: data.status as TaskStatus,
      priority: data.priority as Priority,
      categoryId: data.categoryId,
      dueDate: data.dueDate,
      dueTime: data.dueTime || undefined,
      recurrence: data.recurrence as RecurrenceType,
    };

    if (isEdit && task) {
      updateTask(task.id, input);
    } else {
      addTask(input);
    }
    onSuccess();
  };

  const categoryOptions = categories.map(c => ({ value: c.id, label: `${c.icon} ${c.name}` }));
  const statusOptions = [
    { value: 'pending',     label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed',   label: 'Completed' },
  ];
  const priorityOptions = [
    { value: 'high',   label: '🔴 High' },
    { value: 'medium', label: '🟡 Medium' },
    { value: 'low',    label: '🟢 Low' },
  ];
  const recurrenceOptions = [
    { value: 'none',    label: 'No Repeat' },
    { value: 'daily',   label: '🔄 Daily' },
    { value: 'weekly',  label: '📅 Weekly' },
    { value: 'monthly', label: '📆 Monthly' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title */}
      <Input
        label="Task Title *"
        placeholder="What needs to be done?"
        error={errors.title?.message}
        {...register('title')}
      />

      {/* Description */}
      <Textarea
        label="Description"
        placeholder="Add more details about this task..."
        rows={3}
        error={errors.description?.message}
        {...register('description')}
      />

      {/* Row: Priority + Status */}
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Priority"
          options={priorityOptions}
          error={errors.priority?.message}
          {...register('priority')}
        />
        <Select
          label="Status"
          options={statusOptions}
          error={errors.status?.message}
          {...register('status')}
        />
      </div>

      {/* Category */}
      <Select
        label="Category"
        options={categoryOptions}
        error={errors.categoryId?.message}
        {...register('categoryId')}
      />

      {/* Row: Due Date + Time */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Due Date *"
          type="date"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />
        <Input
          label="Due Time"
          type="time"
          error={errors.dueTime?.message}
          {...register('dueTime')}
        />
      </div>

      {/* Recurrence */}
      <Select
        label="Recurrence"
        options={recurrenceOptions}
        error={errors.recurrence?.message}
        {...register('recurrence')}
      />

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="flex-1"
        >
          {isEdit ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};
