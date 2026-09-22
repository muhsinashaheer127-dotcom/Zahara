import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  FiPlus, FiEdit, FiTrash2, FiEye, FiSearch, FiFilter,
  FiPackage, FiCheckCircle, FiAlertCircle, FiXCircle,
  FiUploadCloud, FiX, FiImage, FiRefreshCw,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import SEO from '../../components/SEO'
import adminService from '../../services/adminService'
import { OCCASIONS } from '../../data/products'

const INITIAL_FORM = {
  name: '', id: '', category: 'bridal-sets', description: '',
  price: '', duration: 3, deposit: '', availableQuantity: 1,
  availability: 'available', imageUrl: '', material: 'Gold-plated alloy',
  occasion: 'Wedding', isFeatured: false,
}

const AdminProducts = () => {
  const [products,  setProducts]  = useState([])
  const [categories, setCategories] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [searchTerm,         setSearchTerm]         = useState('')
  const [categoryFilter,     setCategoryFilter]     = useState('all')
  const [availabilityFilter, setAvailabilityFilter] = useState('all')

  const [isAddEditOpen, setIsAddEditOpen] = useState(false)
  const [isViewOpen,    setIsViewOpen]    = useState(false)
  const [isDeleteOpen,  setIsDeleteOpen]  = useState(false)

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [formData,        setFormData]        = useState(INITIAL_FORM)
  const [isEditing,       setIsEditing]       = useState(false)

  const [isDragging,      setIsDragging]      = useState(false)
  const [imageUploading,  setImageUploading]  = useState(false)
  const fileInputRef = useRef(null)

  const handleImageFile = useCallback((file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please select a valid image file'); return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be smaller than 5MB'); return }
    setImageUploading(true)
    const reader = new FileReader()
    reader.onload  = (e) => { setFormData((p) => ({ ...p, imageUrl: e.target.result })); setImageUploading(false); toast.success('Image uploaded!', { icon: '🖼️' }) }
    reader.onerror = () => { toast.error('Failed to read image'); setImageUploading(false) }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop      = useCallback((e) => { e.preventDefault(); setIsDragging(false); handleImageFile(e.dataTransfer.files?.[0]) }, [handleImageFile])
  const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const [prods, cats] = await Promise.all([adminService.getProducts(), adminService.getCategories()])
      setProducts(prods)
      setCategories(cats)
    } catch (err) {
      toast.error('Failed to load products: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const filtered = products.filter((p) => {
    const s = searchTerm.toLowerCase()
    return (
      (p.name?.toLowerCase().includes(s) || p.id?.toLowerCase().includes(s) || p.category?.toLowerCase().includes(s)) &&
      (categoryFilter     === 'all' || p.category     === categoryFilter) &&
      (availabilityFilter === 'all' || p.availability === availabilityFilter)
    )
  })

  const handleOpenAdd = () => {
    setIsEditing(false)
    setFormData({ ...INITIAL_FORM, id: `ZH-PRD-${Date.now().toString().slice(-4)}`, imageUrl: '' })
    setIsAddEditOpen(true)
  }

  const handleOpenEdit = (p) => {
    setIsEditing(true)
    setSelectedProduct(p)
    setFormData({
      name: p.name || '', id: p.id || '', category: p.category || 'bridal-sets',
      description: p.description || '', price: p.price || '', duration: p.duration || 3,
      deposit: p.deposit || '', availableQuantity: p.availableQuantity || 1,
      availability: p.availability || 'available', imageUrl: p.images?.[0] || '',
      material: p.specifications?.material || 'Gold-plated alloy',
      occasion: p.occasion || 'Wedding', isFeatured: Boolean(p.isFeatured),
    })
    setIsAddEditOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.price || !formData.deposit) {
      toast.error('Please fill in required fields (Name, Price, Deposit)'); return
    }
    setSaving(true)
    const payload = {
      name: formData.name, id: formData.id, category: formData.category,
      description: formData.description, price: Number(formData.price),
      duration: Number(formData.duration), deposit: Number(formData.deposit),
      availableQuantity: Number(formData.availableQuantity), availability: formData.availability,
      images: [formData.imageUrl || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'],
      occasion: formData.occasion, isFeatured: formData.isFeatured,
      specifications: { material: formData.material, care: 'Professional cleaning included', insurance: 'Included' },
    }
    try {
      if (isEditing) {
        await adminService.updateProduct(selectedProduct.id, payload)
        toast.success('Product updated successfully!')
      } else {
        await adminService.addProduct(payload)
        toast.success('New product added successfully!')
      }
      setIsAddEditOpen(false)
      await loadData()
    } catch (err) {
      toast.error('Failed to save: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedProduct) return
    setSaving(true)
    try {
      await adminService.deleteProduct(selectedProduct.id)
      toast.success(`"${selectedProduct.name}" deleted from database`)
      setIsDeleteOpen(false)
      setSelectedProduct(null)
      await loadData()
    } catch (err) {
      toast.error('Failed to delete: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    {
      header: 'Product',
      render: (p) => (
        <div className="flex items-center gap-3">
          <img src={p.images?.[0]} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0" />
          <div>
            <p className="font-semibold text-white text-sm">{p.name}</p>
            <p className="text-[11px] text-gold/80 font-mono">ID: {p.id}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      render: (p) => (
        <span className="capitalize text-xs text-white/70 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
          {p.category?.replace(/-/g, ' ')}
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
    { header: 'Stock', render: (p) => <span className="text-xs font-semibold text-white/80">{p.availableQuantity || 0} units</span> },
    {
      header: 'Availability',
      render: (p) => {
        const av = p.availability
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            av === 'available' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            : av === 'limited' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          }`}>
            {av === 'available' ? <FiCheckCircle size={12} /> : av === 'limited' ? <FiAlertCircle size={12} /> : <FiXCircle size={12} />}
            {av === 'available' ? 'Available' : av === 'limited' ? 'Limited' : 'Out of Stock'}
          </span>
        )
      },
    },
    {
      header: 'Actions',
      render: (p) => (
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => { setSelectedProduct(p); setIsViewOpen(true) }} className="p-2 rounded-lg border border-white/10 text-white/70 hover:text-gold hover:border-gold/40 transition-colors" title="View"><FiEye size={16} /></button>
          <button type="button" onClick={() => handleOpenEdit(p)} className="p-2 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition-colors" title="Edit"><FiEdit size={16} /></button>
          <button type="button" onClick={() => { setSelectedProduct(p); setIsDeleteOpen(true) }} className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors" title="Delete"><FiTrash2 size={16} /></button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <SEO title="Product Management | Zahara Admin" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <FiPackage className="text-gold" /> Product Management
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1">Manage inventory, rental pricing, deposits, and availability. All changes sync to the database.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={loadData} className="p-2.5 rounded-xl border border-white/20 text-white/70 hover:text-gold hover:border-gold/40 transition-colors" title="Refresh"><FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} /></button>
          <button type="button" onClick={handleOpenAdd} className="px-5 py-3 gold-gradient text-black font-semibold text-xs rounded-xl hover:opacity-95 transition-all flex items-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.25)] cursor-pointer uppercase tracking-wider">
            <FiPlus size={18} /> Add New Product
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border border-gold/15 flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0e0e0e]/80">
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold/60" size={16} />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search product name or ID..." className="w-full bg-black/60 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-gold/50" />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gold/80" size={14} />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold/50">
              <option value="all">All Categories</option>
              {categories.map((c) => <option key={c.id || c.slug} value={c.slug || c.id}>{c.name}</option>)}
            </select>
          </div>
          <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)} className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold/50">
            <option value="all">All Availability</option>
            <option value="available">Available</option>
            <option value="limited">Limited Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gold/60 gap-3">
          <FiRefreshCw className="animate-spin" size={20} /> Loading products from database...
        </div>
      ) : (
        <AdminTable columns={columns} data={filtered} emptyMessage="No products found matching your filters." />
      )}

      {/* ADD / EDIT MODAL */}
      <AdminModal isOpen={isAddEditOpen} onClose={() => setIsAddEditOpen(false)} title={isEditing ? 'Edit Product Details' : 'Add New Jewellery Product'} subtitle="All changes are saved directly to the database." maxWidth="max-w-3xl">
        <form onSubmit={handleSave} className="space-y-4 text-xs text-white/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gold/80 font-medium mb-1">Product Name *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold" />
            </div>
            <div>
              <label className="block text-gold/80 font-medium mb-1">Product Code (ID)</label>
              <input type="text" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} disabled={isEditing} className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold disabled:opacity-50" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-gold/80 font-medium mb-1">Category *</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold">
                {categories.map((c) => <option key={c.id || c.slug} value={c.slug || c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gold/80 font-medium mb-1">Occasion</label>
              <select value={formData.occasion} onChange={(e) => setFormData({ ...formData, occasion: e.target.value })} className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold">
                {OCCASIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gold/80 font-medium mb-1">Material</label>
              <input type="text" value={formData.material} onChange={(e) => setFormData({ ...formData, material: e.target.value })} className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-gold/80 font-medium mb-1">Rental Price (₹) *</label>
              <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold" />
            </div>
            <div>
              <label className="block text-gold/80 font-medium mb-1">Duration (Days)</label>
              <input type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold" />
            </div>
            <div>
              <label className="block text-gold/80 font-medium mb-1">Deposit (₹) *</label>
              <input type="number" value={formData.deposit} onChange={(e) => setFormData({ ...formData, deposit: e.target.value })} required className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold" />
            </div>
            <div>
              <label className="block text-gold/80 font-medium mb-1">Stock Qty</label>
              <input type="number" value={formData.availableQuantity} onChange={(e) => setFormData({ ...formData, availableQuantity: e.target.value })} className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gold/80 font-medium mb-1">Availability Status</label>
              <select value={formData.availability} onChange={(e) => setFormData({ ...formData, availability: e.target.value })} className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold">
                <option value="available">Available</option>
                <option value="limited">Limited Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            <div>
              <label className="block text-gold/80 font-medium mb-1">Product Image URL</label>
              <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold" />
              {/* Drag and Drop Zone */}
              <div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onClick={() => fileInputRef.current?.click()}
                className={`mt-2 border-2 border-dashed rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all ${isDragging ? 'border-gold bg-gold/10' : 'border-white/20 hover:border-gold/50'}`}>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageFile(e.target.files?.[0])} />
                {imageUploading ? <span className="text-[11px] text-white/60">Uploading...</span> : <><FiUploadCloud size={14} className="text-white/40" /><span className="text-[11px] text-white/50">or drag & drop an image</span></>}
              </div>
              {formData.imageUrl && <img src={formData.imageUrl} alt="preview" className="mt-2 w-full h-24 object-cover rounded-xl border border-gold/30" onError={(e) => { e.target.style.display = 'none' }} />}
            </div>
          </div>

          <div>
            <label className="block text-gold/80 font-medium mb-1">Description</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold" />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4 rounded accent-gold" />
            <label htmlFor="isFeatured" className="cursor-pointer">Featured Product</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={() => setIsAddEditOpen(false)} className="px-4 py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/5">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2.5 gold-gradient text-black font-semibold rounded-xl hover:opacity-95 disabled:opacity-60 flex items-center gap-2">
              {saving && <FiRefreshCw size={14} className="animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* VIEW MODAL */}
      <AdminModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} title="Product Information" subtitle={selectedProduct?.name}>
        {selectedProduct && (
          <div className="space-y-4 text-sm text-white/80">
            <div className="flex items-center gap-4">
              <img src={selectedProduct.images?.[0]} alt={selectedProduct.name} className="w-24 h-24 rounded-2xl object-cover border border-gold/30" />
              <div>
                <h4 className="font-bold text-lg text-gold">{selectedProduct.name}</h4>
                <p className="text-xs text-white/50">ID: {selectedProduct.id}</p>
                <p className="text-xs text-white/70 capitalize mt-1">Category: {selectedProduct.category?.replace(/-/g, ' ')}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase mt-2 ${selectedProduct.availability === 'available' ? 'bg-emerald-500/20 text-emerald-400' : selectedProduct.availability === 'limited' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {selectedProduct.availability}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl text-xs">
              <div><p className="text-white/40">Rental Price</p><p className="text-gold font-bold text-base">₹{selectedProduct.price}</p></div>
              <div><p className="text-white/40">Security Deposit</p><p className="text-white font-bold text-base">₹{selectedProduct.deposit}</p></div>
              <div><p className="text-white/40">Stock Quantity</p><p className="text-white font-semibold">{selectedProduct.availableQuantity || 1} Units</p></div>
              <div><p className="text-white/40">Material</p><p className="text-white font-semibold">{selectedProduct.specifications?.material || 'N/A'}</p></div>
            </div>
            <div><p className="text-xs font-bold text-gold uppercase tracking-wider mb-1">Description</p><p className="text-xs text-white/70 leading-relaxed">{selectedProduct.description || 'No description.'}</p></div>
          </div>
        )}
      </AdminModal>

      {/* DELETE MODAL */}
      <AdminModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Product" subtitle="This will permanently remove it from the database.">
        <div className="space-y-4">
          <p className="text-xs text-white/70">Are you sure you want to permanently delete <strong className="text-gold">{selectedProduct?.name}</strong>?</p>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button type="button" onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 rounded-xl border border-white/20 text-xs text-white hover:bg-white/5">Cancel</button>
            <button type="button" onClick={handleDelete} disabled={saving} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl disabled:opacity-60 flex items-center gap-2">
              {saving && <FiRefreshCw size={12} className="animate-spin" />} Delete Product
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  )
}

export default AdminProducts
