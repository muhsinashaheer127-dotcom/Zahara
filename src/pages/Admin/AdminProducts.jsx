import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiSearch,
  FiFilter,
  FiPackage,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import SEO from '../../components/SEO'
import adminService from '../../services/adminService'
import { CATEGORIES, OCCASIONS } from '../../data/products'

const INITIAL_PRODUCT_FORM = {
  name: '',
  id: '',
  category: 'bridal-sets',
  description: '',
  price: '',
  duration: 3,
  deposit: '',
  availableQuantity: 1,
  availability: 'available',
  imageUrl: '',
  material: 'Gold-plated alloy',
  color: 'Gold',
  occasion: 'Wedding',
  isFeatured: false,
  status: 'Active',
}

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [availabilityFilter, setAvailabilityFilter] = useState('all')

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [formData, setFormData] = useState(INITIAL_PRODUCT_FORM)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    loadProducts()
    setCategories(adminService.getCategories())
    const handleUpdate = () => loadProducts()
    window.addEventListener('zh_admin_data_updated', handleUpdate)
    return () => window.removeEventListener('zh_admin_data_updated', handleUpdate)
  }, [])

  const loadProducts = () => {
    setProducts(adminService.getProducts())
  }

  // Filtering
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
    const matchesAvailability = availabilityFilter === 'all' || p.availability === availabilityFilter

    return matchesSearch && matchesCategory && matchesAvailability
  })

  // Open Add Modal
  const handleOpenAdd = () => {
    setIsEditing(false)
    setFormData({
      ...INITIAL_PRODUCT_FORM,
      id: `ZH-PRD-${Date.now().toString().slice(-4)}`,
      imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    })
    setIsAddEditOpen(true)
  }

  // Open Edit Modal
  const handleOpenEdit = (product) => {
    setIsEditing(true)
    setSelectedProduct(product)
    setFormData({
      name: product.name || '',
      id: product.id || '',
      category: product.category || 'bridal-sets',
      description: product.description || '',
      price: product.price || '',
      duration: product.duration || 3,
      deposit: product.deposit || '',
      availableQuantity: product.availableQuantity || 1,
      availability: product.availability || 'available',
      imageUrl: product.images?.[0] || '',
      material: product.specifications?.material || 'Gold-plated alloy',
      color: product.color || 'Gold',
      occasion: product.occasion || 'Wedding',
      isFeatured: Boolean(product.isFeatured),
      status: product.status || 'Active',
    })
    setIsAddEditOpen(true)
  }

  // Open View Modal
  const handleOpenView = (product) => {
    setSelectedProduct(product)
    setIsViewOpen(true)
  }

  // Open Delete Modal
  const handleOpenDelete = (product) => {
    setSelectedProduct(product)
    setIsDeleteOpen(true)
  }

  // Form Submit
  const handleSaveProduct = (e) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.deposit) {
      toast.error('Please fill in required fields (Name, Price, Deposit)')
      return
    }

    const payload = {
      name: formData.name,
      id: formData.id,
      category: formData.category,
      description: formData.description,
      price: Number(formData.price),
      duration: Number(formData.duration),
      deposit: Number(formData.deposit),
      availableQuantity: Number(formData.availableQuantity),
      availability: formData.availability,
      images: [formData.imageUrl || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'],
      color: formData.color,
      occasion: formData.occasion,
      isFeatured: formData.isFeatured,
      status: formData.status,
      specifications: {
        material: formData.material,
        care: 'Professional cleaning included',
        insurance: 'Included',
      },
    }

    if (isEditing) {
      adminService.updateProduct(formData.id, payload)
      toast.success('Product updated successfully!')
    } else {
      adminService.addProduct(payload)
      toast.success('New product added successfully!')
    }

    setIsAddEditOpen(false)
    loadProducts()
  }

  // Delete Action
  const handleDeleteProduct = () => {
    if (selectedProduct) {
      adminService.deleteProduct(selectedProduct.id)
      toast.success(`Product "${selectedProduct.name}" deleted`)
      setIsDeleteOpen(false)
      setSelectedProduct(null)
      loadProducts()
    }
  }

  // Table Columns Setup
  const columns = [
    {
      header: 'Product',
      render: (p) => (
        <div className="flex items-center gap-3">
          <img
            src={p.images?.[0]}
            alt={p.name}
            className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
          />
          <div>
            <p className="font-semibold text-white text-sm">{p.name}</p>
            <p className="text-[11px] text-gold/80 font-mono">Code: {p.id}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category',
      render: (p) => (
        <span className="capitalize text-xs text-white/70 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
          {p.category?.replace('-', ' ')}
        </span>
      ),
    },
    {
      header: 'Rental Pricing',
      render: (p) => (
        <div>
          <span className="text-gold font-bold text-sm">₹{p.price}</span>
          <span className="text-white/40 text-xs"> / {p.duration}d</span>
          <p className="text-[11px] text-white/50">Deposit: ₹{p.deposit}</p>
        </div>
      ),
    },
    {
      header: 'Stock',
      render: (p) => <span className="text-xs font-semibold text-white/80">{p.availableQuantity || 0} units</span>,
    },
    {
      header: 'Availability',
      render: (p) => {
        const isAvailable = p.availability === 'available'
        const isLimited = p.availability === 'limited'
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              isAvailable
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : isLimited
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            {isAvailable ? (
              <FiCheckCircle size={12} />
            ) : isLimited ? (
              <FiAlertCircle size={12} />
            ) : (
              <FiXCircle size={12} />
            )}
            {isAvailable ? 'Available' : isLimited ? 'Limited Stock' : 'Out of Stock'}
          </span>
        )
      },
    },
    {
      header: 'Actions',
      render: (p) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenView(p)}
            className="p-2 rounded-lg border border-white/10 text-white/70 hover:text-gold hover:border-gold/40 transition-colors"
            title="View Details"
          >
            <FiEye size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleOpenEdit(p)}
            className="p-2 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
            title="Edit Product"
          >
            <FiEdit size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleOpenDelete(p)}
            className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete Product"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <SEO title="Product Management | Zahara Admin" />

      {/* Header & Primary CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <FiPackage className="text-gold" /> Product Management
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            Manage inventory, rental pricing, deposits, and availability status.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-5 py-3 gold-gradient text-black font-semibold text-xs rounded-xl hover:opacity-95 transition-all flex items-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.25)] cursor-pointer uppercase tracking-wider"
        >
          <FiPlus size={18} /> Add New Product
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border border-gold/15 flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0e0e0e]/80">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold/60" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search product name or code..."
            className="w-full bg-black/60 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-gold/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gold/80" size={14} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold/50"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug || c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold/50"
          >
            <option value="all">All Availability</option>
            <option value="available">Available</option>
            <option value="limited">Limited Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Data Table */}
      <AdminTable columns={columns} data={filteredProducts} emptyMessage="No products found matching your filters." />

      {/* ADD / EDIT PRODUCT MODAL */}
      <AdminModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        title={isEditing ? 'Edit Product Details' : 'Add New Jewellery Product'}
        subtitle="Manage product specifications, pricing, deposit and live availability."
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4 text-xs text-white/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gold/80 font-medium mb-1">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-gold/80 font-medium mb-1">Product Code (ID)</label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                disabled={isEditing}
                className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gold/80 font-medium mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug || c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gold/80 font-medium mb-1">Occasion</label>
              <select
                value={formData.occasion}
                onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
              >
                {OCCASIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gold/80 font-medium mb-1">Material</label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-gold/80 font-medium mb-1">Rental Price (₹) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-gold/80 font-medium mb-1">Rental Duration (Days)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-gold/80 font-medium mb-1">Security Deposit (₹) *</label>
              <input
                type="number"
                value={formData.deposit}
                onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                required
                className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-gold/80 font-medium mb-1">Stock Quantity</label>
              <input
                type="number"
                value={formData.availableQuantity}
                onChange={(e) => setFormData({ ...formData, availableQuantity: e.target.value })}
                className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gold/80 font-medium mb-1">Availability Status</label>
              <select
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
              >
                <option value="available">Available</option>
                <option value="limited">Limited Stock</option>
                <option value="out_of_stock">Out of Stock (Currently Unavailable)</option>
              </select>
            </div>
            <div>
              <label className="block text-gold/80 font-medium mb-1">Product Image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-gold/80 font-medium mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded text-gold accent-gold"
              />
              <span>Featured Product</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsAddEditOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 gold-gradient text-black font-semibold rounded-xl hover:opacity-95"
            >
              {isEditing ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* VIEW PRODUCT MODAL */}
      <AdminModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Product Information"
        subtitle={selectedProduct?.name}
      >
        {selectedProduct && (
          <div className="space-y-4 text-sm text-white/80">
            <div className="flex items-center gap-4">
              <img
                src={selectedProduct.images?.[0]}
                alt={selectedProduct.name}
                className="w-24 h-24 rounded-2xl object-cover border border-gold/30"
              />
              <div>
                <h4 className="font-bold text-lg text-gold">{selectedProduct.name}</h4>
                <p className="text-xs text-white/50">ID: {selectedProduct.id}</p>
                <p className="text-xs text-white/70 capitalize mt-1">Category: {selectedProduct.category}</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase mt-2 ${
                    selectedProduct.availability === 'available'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : selectedProduct.availability === 'limited'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {selectedProduct.availability}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl text-xs">
              <div>
                <p className="text-white/40">Rental Price</p>
                <p className="text-gold font-bold text-base">₹{selectedProduct.price}</p>
              </div>
              <div>
                <p className="text-white/40">Security Deposit</p>
                <p className="text-white font-bold text-base">₹{selectedProduct.deposit}</p>
              </div>
              <div>
                <p className="text-white/40">Stock Quantity</p>
                <p className="text-white font-semibold">{selectedProduct.availableQuantity || 1} Units</p>
              </div>
              <div>
                <p className="text-white/40">Material</p>
                <p className="text-white font-semibold">{selectedProduct.specifications?.material || 'Alloy'}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gold uppercase tracking-wider mb-1">Description</p>
              <p className="text-xs text-white/70 leading-relaxed">{selectedProduct.description || 'No description provided.'}</p>
            </div>
          </div>
        )}
      </AdminModal>

      {/* DELETE CONFIRMATION MODAL */}
      <AdminModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Delete Product"
        subtitle="This action cannot be undone."
      >
        <div className="space-y-4">
          <p className="text-xs text-white/70">
            Are you sure you want to permanently delete{' '}
            <strong className="text-gold">{selectedProduct?.name}</strong>?
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 rounded-xl border border-white/20 text-xs text-white hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteProduct}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl"
            >
              Delete Product
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  )
}

export default AdminProducts
