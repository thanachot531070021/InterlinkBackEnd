/**
 * Entitlements Management Page
 * Full CRUD functionality for store-brand entitlements
 */

'use client';

import React, { useState, useEffect } from 'react';
import { entitlementService } from '@/lib/services/entitlementService';
import { storeService } from '@/lib/services/storeService';
import { brandService } from '@/lib/services/brandService';
import type { Entitlement, Store, Brand } from '@/types/models';
import Button from '@/components/ui/button/Button';

export default function EntitlementsPage() {
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEntitlement, setEditingEntitlement] = useState<Entitlement | null>(null);
  const [formData, setFormData] = useState({
    storeId: '',
    brandId: '',
    isActive: true,
  });

  // Fetch data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [entitlementsResponse, storesResponse, brandsResponse] = await Promise.all([
        entitlementService.getEntitlements(),
        storeService.getStores(),
        brandService.getBrands(),
      ]);
      setEntitlements(entitlementsResponse.data || []);
      setStores(storesResponse.data || []);
      setBrands(brandsResponse.data || []);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingEntitlement(null);
    setFormData({
      storeId: '',
      brandId: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEdit = (entitlement: Entitlement) => {
    setEditingEntitlement(entitlement);
    setFormData({
      storeId: entitlement.storeId,
      brandId: entitlement.brandId,
      isActive: entitlement.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEntitlement) {
        await entitlementService.updateEntitlement(editingEntitlement.id, formData);
      } else {
        await entitlementService.createEntitlement(formData);
      }
      setShowModal(false);
      loadData();
    } catch (err: any) {
      console.error('Error saving entitlement:', err);
      alert(err.response?.data?.message || 'Failed to save entitlement');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entitlement?')) return;

    try {
      await entitlementService.deleteEntitlement(id);
      loadData();
    } catch (err: any) {
      console.error('Error deleting entitlement:', err);
      alert(err.response?.data?.message || 'Failed to delete entitlement');
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this entitlement?')) return;

    try {
      await entitlementService.revokeEntitlement(id);
      loadData();
    } catch (err: any) {
      console.error('Error revoking entitlement:', err);
      alert(err.response?.data?.message || 'Failed to revoke entitlement');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading entitlements...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Store-Brand Entitlements
        </h2>
        <Button onClick={handleCreate} size="sm">
          + Grant Permission
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Info Box */}
      <div className="mb-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
        Entitlements control which stores can sell products from specific brands. Grant permissions to allow stores to access brand products.
      </div>

      {/* Entitlements Table */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="px-4 py-4 font-medium text-black dark:text-white">Store Name</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Brand Name</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Status</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Created At</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entitlements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No entitlements found. Click "Grant Permission" to create one.
                  </td>
                </tr>
              ) : (
                entitlements.map((entitlement) => (
                  <tr key={entitlement.id} className="border-b border-stroke dark:border-strokedark">
                    <td className="px-4 py-4 text-black dark:text-white">
                      {entitlement.store?.name || '-'}
                    </td>
                    <td className="px-4 py-4 text-black dark:text-white">
                      {entitlement.brand?.name || '-'}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                          entitlement.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}
                      >
                        {entitlement.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(entitlement.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(entitlement)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Edit
                        </button>
                        {entitlement.isActive && (
                          <button
                            onClick={() => handleRevoke(entitlement.id)}
                            className="text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300"
                          >
                            Revoke
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(entitlement.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 dark:bg-boxdark">
            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
              {editingEntitlement ? 'Edit Entitlement' : 'Grant Permission'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Store *
                </label>
                <select
                  value={formData.storeId}
                  onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                  className="w-full rounded border border-stroke bg-transparent px-4 py-2 text-black outline-none focus:border-primary dark:border-strokedark dark:text-white"
                  required
                  disabled={!!editingEntitlement}
                >
                  <option value="">Select a store</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
                {editingEntitlement && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Store cannot be changed after creation
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Brand *
                </label>
                <select
                  value={formData.brandId}
                  onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                  className="w-full rounded border border-stroke bg-transparent px-4 py-2 text-black outline-none focus:border-primary dark:border-strokedark dark:text-white"
                  required
                  disabled={!!editingEntitlement}
                >
                  <option value="">Select a brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {editingEntitlement && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Brand cannot be changed after creation
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-black dark:text-white">Active</span>
                </label>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Only active entitlements grant access to brand products
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  Cancel
                </Button>
                <Button type="submit">{editingEntitlement ? 'Update' : 'Grant'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
