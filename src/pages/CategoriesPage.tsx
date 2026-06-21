import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Tag, Lock } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { Category } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal, ConfirmModal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';

const CATEGORY_COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6',
  '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#14b8a6',
  '#3b82f6', '#a855f7', '#22c55e', '#f43f5e', '#64748b',
];

const CATEGORY_ICONS = ['📚', '💼', '🏠', '💪', '✨', '🎯', '🎨', '🎵', '🚀', '💡', '🍎', '🌿', '⚡', '🔥', '💎'];

interface CategoryFormProps {
  category?: Category;
  onSuccess: () => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSuccess, onCancel }) => {
  const { addCategory, updateCategory } = useTasks();
  const [name, setName] = useState(category?.name || '');
  const [color, setColor] = useState(category?.color || CATEGORY_COLORS[0]);
  const [icon, setIcon] = useState(category?.icon || '📚');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Name is required'); return; }
    if (name.length > 50) { setError('Name is too long'); return; }

    if (category) {
      updateCategory(category.id, { name: name.trim(), color, icon });
    } else {
      addCategory({ name: name.trim(), color, icon });
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Category Name *"
        placeholder="e.g., Side Projects"
        value={name}
        onChange={e => { setName(e.target.value); setError(''); }}
        error={error}
        maxLength={50}
      />

      {/* Icon Picker */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Icon</label>
        <div className="grid grid-cols-8 gap-2">
          {CATEGORY_ICONS.map(i => (
            <button
              key={i}
              type="button"
              onClick={() => setIcon(i)}
              className={`text-2xl p-2 rounded-xl transition-all hover:scale-110 ${icon === i ? 'bg-indigo-100 dark:bg-indigo-900/30 ring-2 ring-indigo-500' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      {/* Color Picker */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Color</label>
        <div className="flex flex-wrap gap-3">
          {CATEGORY_COLORS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`h-8 w-8 rounded-full transition-all hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-slate-500 scale-110' : ''}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-slate-50 dark:bg-slate-700/30 rounded-2xl p-4">
        <p className="text-xs text-slate-500 mb-2">Preview:</p>
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: color + '15' }}>
          <div className="h-10 w-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: color + '25' }}>
            {icon}
          </div>
          <div>
            <p className="font-semibold" style={{ color }}>{name || 'Category Name'}</p>
            <p className="text-xs text-slate-500">0 tasks</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" className="flex-1">{category ? 'Update' : 'Create'} Category</Button>
      </div>
    </form>
  );
};

export const CategoriesPage: React.FC = () => {
  const { categories, tasks, deleteCategory } = useTasks();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getCategoryTaskCount = (categoryId: string) => tasks.filter(t => t.categoryId === categoryId).length;
  const getCategoryCompletedCount = (categoryId: string) => tasks.filter(t => t.categoryId === categoryId && t.isCompleted).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="h-7 w-7 text-indigo-500" />
            Categories
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{categories.length} categories</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowCreateModal(true)}>
          New Category
        </Button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <EmptyState
          icon="🏷️"
          title="No categories yet"
          description="Create categories to organize your tasks better."
          action={{ label: 'Create Category', onClick: () => setShowCreateModal(true) }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => {
            const totalCount = getCategoryTaskCount(category.id);
            const completedCount = getCategoryCompletedCount(category.id);
            const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <Card key={category.id} className="hover:shadow-md transition-all duration-200 group">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200">{category.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {totalCount} task{totalCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!category.isDefault && (
                      <>
                        <button
                          onClick={() => setEditCategory(category)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(category.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {category.isDefault && (
                      <div className="p-1.5 text-slate-300 dark:text-slate-600">
                        <Lock className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{completedCount} of {totalCount} completed</span>
                    <span className="font-semibold" style={{ color: category.color }}>{percentage}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%`, backgroundColor: category.color }}
                    />
                  </div>
                </div>

                {/* Default Badge */}
                {category.isDefault && (
                  <div className="mt-3 inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                    <Lock className="h-3 w-3" />
                    Default
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Category" size="md">
        <CategoryForm onSuccess={() => setShowCreateModal(false)} onCancel={() => setShowCreateModal(false)} />
      </Modal>

      <Modal isOpen={!!editCategory} onClose={() => setEditCategory(null)} title="Edit Category" size="md">
        {editCategory && (
          <CategoryForm
            category={editCategory}
            onSuccess={() => setEditCategory(null)}
            onCancel={() => setEditCategory(null)}
          />
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteCategory(deleteId)}
        title="Delete Category"
        message="This will not delete the tasks in this category. Are you sure you want to delete this category?"
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
};
