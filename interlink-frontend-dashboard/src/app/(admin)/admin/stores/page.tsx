/**
 * Stores Management Page
 * Full CRUD functionality for stores
 */

'use client';

import React, { useState, useEffect } from 'react';
import { storeService } from '@/lib/services/storeService';
import type { Store } from '@/types/models';
import Button from '@/components/ui/button/Button';

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    is_active: true,
  });

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      setLoading(true);
      const response = await storeService.getStores();
      setStores(response.data || []);
    } catch (err: any) {
      console.error('Error loading stores:', err);
      setError(err.response?.data?.message || 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingStore(null);
    setFormData({
      name: '',
      description: '',
      address: '',
      phone: '',
      email: '',
      is_active: true,
    });
    setShowModal(true);
  };

  const handleEdit = (store: Store) => {
    setEditingStore(store);
    // Handle address - convert object to string if needed
    let addressStr = '';
    if (store.address && typeof store.address === 'object') {
      addressStr = `${store.address.street || ''} ${store.address.city || ''} ${store.address.province || ''} ${store.address.postalCode || ''}`.trim();
    } else if (typeof store.address === 'string') {
      addressStr = store.address;
    }

    setFormData({
      name: store.name,
      description: store.description || '',
      address: addressStr,
      phone: store.phone || '',
      email: store.email || '',
      is_active: store.is_active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStore) {
        await storeService.updateStore(editingStore.id, formData);
      } else {
        await storeService.createStore(formData);
      }
      setShowModal(false);
      loadStores();
    } catch (err: any) {
      console.error('Error saving store:', err);
      alert(err.response?.data?.message || 'Failed to save store');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this store?')) return;

    try {
      await storeService.deleteStore(id);
      loadStores();
    } catch (err: any) {
      console.error('Error deleting store:', err);
      alert(err.response?.data?.message || 'Failed to delete store');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading stores...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Stores Management
        </h2>
        <Button onClick={handleCreate} size="sm">
          + Add Store
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="px-4 py-4 font-medium text-black dark:text-white">Name</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Address</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Contact</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Status</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No stores found. Click "Add Store" to create one.
                  </td>
                </tr>
              ) : (
                stores.map((store) => (
                  <tr key={store.id} className="border-b border-stroke dark:border-strokedark">
                    <td className="px-4 py-4 text-black dark:text-white">{store.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {store.address && typeof store.address === 'object'
                        ? `${store.address.street || ''} ${store.address.city || ''} ${store.address.province || ''} ${store.address.postalCode || ''}`.trim() || '-'
                        : store.address || '-'}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {store.phone || store.email || '-'}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                          store.is_active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}
                      >
                        {store.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(store)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(store.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-boxdark">
            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
              {editingStore ? 'Edit Store' : 'Create Store'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Store Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded border border-stroke bg-transparent px-4 py-2 text-black outline-none focus:border-primary dark:border-strokedark dark:text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded border border-stroke bg-transparent px-4 py-2 text-black outline-none focus:border-primary dark:border-strokedark dark:text-white"
                  rows={2}
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded border border-stroke bg-transparent px-4 py-2 text-black outline-none focus:border-primary dark:border-strokedark dark:text-white"
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded border border-stroke bg-transparent px-4 py-2 text-black outline-none focus:border-primary dark:border-strokedark dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded border border-stroke bg-transparent px-4 py-2 text-black outline-none focus:border-primary dark:border-strokedark dark:text-white"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-black dark:text-white">Active</span>
                </label>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  Cancel
                </Button>
                <Button type="submit">{editingStore ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
