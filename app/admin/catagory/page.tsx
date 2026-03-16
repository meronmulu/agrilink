'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  getCategories,
  addCategory,
  addSubCategory,
  updateCategory,
  deleteCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubCategories,
} from '@/services/categoryService'

import { Category, SubCategory } from '@/types/category'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Tabs, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Alert, AlertDescription } from '@/components/ui/alert'

import {
  ChevronDown,
  ChevronRight,
  Folder,
  Pencil,
  Trash,
  Loader2,
  PlusCircle,
  Package,
  MoreVertical,
  Search,
  Grid3x3,
  List,
} from 'lucide-react'



export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<SubCategory[]>([])

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  // Form states
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newSubName, setNewSubName] = useState('')
  const [parentCategoryId, setParentCategoryId] = useState('')

  // UI states
  const [open, setOpen] = useState<string[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'category' | 'subcategory' } | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  // Dialog states
  const [subDialogOpen, setSubDialogOpen] = useState(false)
  const [editCategoryDialogOpen, setEditCategoryDialogOpen] = useState(false)
  const [editSubDialogOpen, setEditSubDialogOpen] = useState(false)

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingSubId, setEditingSubId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    fetchCategories()
    fetchSubcategoriesWithMeta()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubcategoriesWithMeta = async () => {
    try {
      const data = await getSubCategories()
      setSubcategories(data)
    } catch (err) {
      console.error(err)
    }
  }

  const toggle = (id: string) => {
    setOpen((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

const handleCreateCategory = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!newCategoryName.trim()) return

  setSubmitting(true)

  try {
    const created = await addCategory({ name: newCategoryName })

    setCategories((prev) => [...prev, created])

    setNewCategoryName('')
    setDetailDialogOpen(false)
  } catch (err) {
    console.error(err)
  } finally {
    setSubmitting(false)
  }
}

 const handleCreateSubCategory = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!newSubName.trim() || !parentCategoryId) return

  setSubmitting(true)

  try {
    const created = await addSubCategory({
      name: newSubName,
      categoryId: parentCategoryId,
    })

    setSubcategories((prev) => [...prev, created])

    setNewSubName('')
    setParentCategoryId('')
    setSubDialogOpen(false)
  } catch (err) {
    console.error(err)
  } finally {
    setSubmitting(false)
  }
}

const handleDelete = async () => {
  if (!itemToDelete) return;

  setSubmitting(true);
  try {
    if (itemToDelete.type === 'category') {
      // Check if category has subcategories
      const hasSubcategories = subcategories.some(
        (s) => s.categoryId === itemToDelete.id
      );

      if (hasSubcategories) {
        alert(
          'Cannot delete category with existing subcategories. Please delete the subcategories first.'
        );
        return; 
      }

      // Safe to delete category
      await deleteCategory(itemToDelete.id);
      setCategories((prev) => prev.filter((c) => c.id !== itemToDelete.id));
    } else {
      // Delete subcategory
      await deleteSubCategory(itemToDelete.id);
      setSubcategories((prev) =>
        prev.filter((s) => s.id !== itemToDelete.id)
      );
    }
  } catch (err) {
    console.error('Failed to delete:', err);
    alert('Failed to delete. Please try again.');
  } finally {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    setSubmitting(false);
  }
};

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategoryId || !editValue.trim()) return

    setSubmitting(true)
    try {
      const updated = await updateCategory(editingCategoryId, { name: editValue })

      if (!updated || !updated.name) {
        throw new Error('No data returned from updateCategory')
      }

      setCategories(prev =>
        prev.map(cat =>
          cat.id === editingCategoryId ? { ...cat, name: updated.name } : cat
        )
      )
      setEditCategoryDialogOpen(false)
      setEditValue('')
      setEditingCategoryId(null)
    } catch (err) {
      console.error('Edit category failed:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditSubCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSubId || !editValue.trim()) return
    setSubmitting(true)
    try {
      const updated = await updateSubCategory(editingSubId, { name: editValue })
      setSubcategories(prev =>
        prev.map(sub =>
          sub.id === editingSubId ? { ...sub, name: updated.name } : sub
        )
      )
      setEditSubDialogOpen(false)
      setEditValue('')
      setEditingSubId(null)
    } catch (err) {
      console.error(err)
    }
    setSubmitting(false)
  }

  const grouped = useMemo(() => {
  return categories
    .filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((cat) => ({
      ...cat,
      subs: subcategories.filter((s) => s.categoryId === cat.id),
    }))
}, [categories, subcategories, searchTerm])
  
 if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header Section */}
      <div className=" bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
              <p className="text-sm text-gray-500 mt-1">
                Organize your products with categories and subcategories
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogTrigger asChild>
                  <Button className='bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white '>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-106.25">
                  <DialogHeader>
                    <DialogTitle>Create New Category</DialogTitle>
                    <DialogDescription>
                      Add a new category to organize your products
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateCategory} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Category Name *</Label>
                      <Input
                        id="name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="e.g., Fresh Produce"
                        className="mt-4"
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={submitting} className='bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white '>
                        {submitting ? (
                          <>
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            Creating...
                          </>
                        ) : (
                          'Create Category'
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="view" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 md:w-4xl"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              >
                {viewMode === 'list' ? <Grid3x3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* VIEW ALL TAB */}
          <TabsContent value="view" className="space-y-4">
            {grouped.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Folder className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-lg font-medium text-gray-900">No categories found</p>

                </CardContent>
              </Card>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                {grouped.map((cat) => (
                  <Card key={cat.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Category Header */}
                    <div className="p-2 bg-white border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => toggle(cat.id)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            {open.includes(cat.id) ? (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                          <div
                            className="flex items-center gap-3 flex-1 cursor-pointer"
                            onClick={() => setSelectedCategory(cat)}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                              </div>
                              <p className="text-xs text-gray-500">• {cat.subs.length} subcategories</p>
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className=''
                              onClick={() => {
                                setEditingCategoryId(cat.id)
                                setEditValue(cat.name)
                                setEditCategoryDialogOpen(true)
                              }}
                            >
                              <Pencil className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setItemToDelete({ id: cat.id, type: 'category' })
                                setDeleteDialogOpen(true)
                              }}
                            >
                              <Trash className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Subcategories */}
                    {open.includes(cat.id) && (
                      <div className="p-4 bg-gray-50/50">
                        <div className='flex items-center justify-end' >

                          <Button
                            variant="ghost"
                            size="sm"
                            className="mb-2 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:text-white text-white "
                            onClick={() => {
                              setParentCategoryId(cat.id)
                              setSubDialogOpen(true)
                            }}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Subcategory
                          </Button>

                        </div>
                        {cat.subs.length > 0 ? (
                          <div className="space-y-2">
                            {cat.subs.map((sub) => (
                              <div key={sub.id} className="flex items-center justify-between p-2 bg-white rounded-lg border">
                                <div className="flex items-center gap-3">
                                  <Package className="h-4 w-4 text-gray-400" />
                                  <div>
                                    <p className="text-sm font-medium">{sub.name}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 "
                                    onClick={() => {
                                      setEditingSubId(sub.id)
                                      setEditValue(sub.name)
                                      setEditSubDialogOpen(true)
                                    }}
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-600 hover:text-red-700"
                                    onClick={() => {
                                      setItemToDelete({ id: sub.id, type: 'subcategory' })
                                      setDeleteDialogOpen(true)
                                    }}
                                  >
                                    <Trash className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <Alert>
                            <AlertDescription className="text-sm text-center text-gray-500">
                              No subcategories yet. Click Add Subcategory  to create one.
                            </AlertDescription>
                          </Alert>
                        )}


                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
              {itemToDelete?.type === 'category' && ' All subcategories under this category will also be deleted.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subcategory Dialog */}
      <Dialog open={subDialogOpen} onOpenChange={setSubDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Subcategory</DialogTitle>
            <DialogDescription>Add a subcategory under this category</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubCategory} className="space-y-4">
            <div>
              <Label>Subcategory Name</Label>
              <Input
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                placeholder="Enter subcategory"
                className='mt-3'
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={submitting} className=' bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:text-white text-white'>
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Creating...
                  </>
                ) : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={editCategoryDialogOpen} onOpenChange={setEditCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditCategory} className="space-y-4">
            <div>
              <Label>Category Name</Label>
              <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} className='mt-3' />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={submitting} className=' bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:text-white text-white'>
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Updating...
                  </>
                ) : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Subcategory Dialog */}
      <Dialog open={editSubDialogOpen} onOpenChange={setEditSubDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subcategory</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubCategory} className="space-y-4">
            <div>
              <Label>Subcategory Name</Label>
              <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} className='mt-3' />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={submitting} className=' bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:text-white text-white'>
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Updating...
                  </>
                ) : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}