import { useState, useEffect } from 'react'
import { FiLayers, FiPlus, FiEdit, FiTrash2, FiRefreshCw } from 'react-icons/fi'
import toast from 'react-hot-toast'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import SEO from '../../components/SEO'
import adminService from '../../services/adminService'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [isAddEditOpen, setIsAddEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => { loadCategories() }, [])

  const loadCategories = async () => {
    try {
      setCategories(await adminService.getCategories())
    } catch (err) {
      toast.error('Failed to load categories: ' + err.message)
    }
  }

  const handleOpenAdd = () => {
    setIsEditing(false)
    setName('')
    setImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvhZDc_w1CdhxHhTepWNH74v7qlQswWPaTqade53WwaA&s')
    setIsAddEditOpen(true)
  }

  const handleOpenEdit = (cat) => {
    setIsEditing(true)
    setSelectedCategory(cat)
    setName(cat.name)
    setImage(cat.image || '')
    setIsAddEditOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!name) return
    try {
      if (isEditing) {
        await adminService.updateCategory(selectedCategory.id || selectedCategory.slug, { name, image })
        toast.success('Category updated!')
      } else {
        await adminService.addCategory({ name, image })
        toast.success('Category added!')
      }
      setIsAddEditOpen(false)
      await loadCategories()
    } catch (err) {
      toast.error('Failed to save category: ' + err.message)
    }
  }

  const handleDelete = async () => {
    if (!selectedCategory) return
    try {
      await adminService.deleteCategory(selectedCategory.id || selectedCategory.slug)
      toast.success(`Category "${selectedCategory.name}" deleted`)
      setIsDeleteOpen(false)
      await loadCategories()
    } catch (err) {
      toast.error('Failed to delete: ' + err.message)
    }
  }

  const columns = [
    {
      header: 'Category Image',
      render: (c) => (
        <img
          src={c.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80'}
          alt={c.name}
          className="w-12 h-12 rounded-xl object-cover border border-white/10"
        />
      ),
    },
    { header: 'Category Name', accessorKey: 'name', render: (c) => <span className="font-bold text-white text-sm">{c.name}</span> },
    { header: 'Slug', accessorKey: 'slug', render: (c) => <span className="text-xs text-gold/80 font-mono">{c.slug || c.id}</span> },
    {
      header: 'Actions',
      render: (c) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenEdit(c)}
            className="p-2 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
          >
            <FiEdit size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory(c)
              setIsDeleteOpen(true)
            }}
            className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <SEO title="Category Management | Zahara Admin" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <FiLayers className="text-gold" /> Category Management
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            Organize jewellery collections (Necklaces, Earrings, Bangles, Temple Jewellery, etc).
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-5 py-3 gold-gradient text-black font-semibold text-xs rounded-xl hover:opacity-95 transition-all flex items-center gap-2 shadow-lg uppercase tracking-wider"
        >
          <FiPlus size={18} /> Add Category
        </button>
      </div>

      <AdminTable columns={columns} data={categories} emptyMessage="No categories found." />

      {/* ADD/EDIT MODAL */}
      <AdminModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        title={isEditing ? 'Edit Category' : 'Add New Category'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-gold/80 font-medium mb-1">Category Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
            />
          </div>
          <div>
            <label className="block text-gold/80 font-medium mb-1">Image URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white focus:border-gold"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsAddEditOpen(false)}
              className="px-4 py-2 rounded-xl border border-white/20 text-white"
            >
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 gold-gradient text-black font-semibold rounded-xl">
              Save Category
            </button>
          </div>
        </form>
      </AdminModal>

      {/* DELETE MODAL */}
      <AdminModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Category Delete"
      >
        <div className="space-y-4 text-xs">
          <p>
            Are you sure you want to delete category <strong className="text-gold">{selectedCategory?.name}</strong>?
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 rounded-xl border border-white/20 text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-5 py-2 bg-red-600 text-white font-semibold rounded-xl"
            >
              Delete
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  )
}

export default AdminCategories
