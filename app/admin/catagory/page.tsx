// app/categories/page.tsx
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
} from '@/services/categoryService'

import { Category } from '@/types/category'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
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
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
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
  Layers,
  Hash,
  Calendar,
  Archive,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react'

type Subcategory = {
  id: string
  name: string
  categoryId: string
  productCount?: number
  status?: 'active' | 'inactive'
  createdAt?: string
}

interface CategoryWithMeta extends Category {
  productCount?: number
  status?: 'active' | 'inactive'
  createdAt?: string
  updatedAt?: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithMeta[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  // Form states
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDescription, setNewCategoryDescription] = useState('')
  const [newSubName, setNewSubName] = useState('')
  const [newSubDescription, setNewSubDescription] = useState('')
  const [parentCategoryId, setParentCategoryId] = useState('')

  // UI states
  const [open, setOpen] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'category' | 'subcategory' } | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithMeta | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)

  useEffect(() => {
    fetchCategories()
    // Simulate fetching subcategories with metadata
    fetchSubcategoriesWithMeta()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const data = await getCategories()
      // Add mock metadata for demonstration
      const categoriesWithMeta = data.map((cat: Category) => ({
        ...cat,
        productCount: Math.floor(Math.random() * 50),
        status: Math.random() > 0.2 ? 'active' : 'inactive',
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        updatedAt: new Date().toISOString(),
      }))
      setCategories(categoriesWithMeta)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubcategoriesWithMeta = async () => {
    try {
      // This would be replaced with actual API call
      const mockSubs: Subcategory[] = []
      setSubcategories(mockSubs)
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
      const created = await addCategory({ 
        name: newCategoryName,
      })

      setCategories((prev) => [...prev, { 
        ...created, 
        productCount: 0, 
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      
      setNewCategoryName('')
      setNewCategoryDescription('')
    } catch (err) {
      console.error(err)
    }
    setSubmitting(false)
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

      setSubcategories((prev) => [...prev, { 
        ...created, 
        productCount: 0, 
        status: 'active',
        createdAt: new Date().toISOString()
      }])
      
      setNewSubName('')
      setNewSubDescription('')
      setParentCategoryId('')
    } catch (err) {
      console.error(err)
    }
    setSubmitting(false)
  }

  const handleDelete = async () => {
    if (!itemToDelete) return

    try {
      if (itemToDelete.type === 'category') {
        await deleteCategory(itemToDelete.id)
        setCategories((prev) => prev.filter((c) => c.id !== itemToDelete.id))
      } else {
        await deleteSubCategory(itemToDelete.id)
        setSubcategories((prev) => prev.filter((s) => s.id !== itemToDelete.id))
      }
    } catch (err) {
      console.error(err)
    }

    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  const grouped = useMemo(() => {
    return categories
      .filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())      )
      .map((cat) => ({
        ...cat,
        subs: subcategories
          .filter((s) => s.categoryId === cat.id)
          .filter(sub => 
            sub.name.toLowerCase().includes(searchTerm.toLowerCase()) 
          ),
      }))
  }, [categories, subcategories, searchTerm])

 

  if (loading && categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-primary mb-4" />
        <p className="text-muted-foreground">Loading your categories...</p>
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
                  <Button className='bg-gradient-to-r 
                  from-emerald-600 to-teal-600
                  hover:from-emerald-700 hover:to-teal-700
                  text-white '>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
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
                        placeholder="e.g., Electronics"
                        className="mt-1"
                      />
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit" disabled={submitting}>
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
            <TabsList>
              <TabsTrigger value="view" className="px-6">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </TabsTrigger>
              <TabsTrigger value="create" className="px-6">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-[250px]"
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
                  <p className="text-sm text-gray-500 mb-4">Get started by creating your first category</p>
                  <Button onClick={() => document.querySelector('[data-dialog-trigger]')?.dispatchEvent(new Event('click'))}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Category
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                {grouped.map((cat) => (
                  <Card key={cat.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Category Header */}
                    <div className="p-4 bg-white border-b">
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
                            onClick={() => {
                              setSelectedCategory(cat)
                              setDetailDialogOpen(true)
                            }}
                          >
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                              </div>
                              <p className="text-xs text-gray-500">
                                   • {cat.subs.length} subcategories
                              </p>
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
                            <DropdownMenuItem onClick={() => {
                              setEditingId(cat.id)
                              setEditValue(cat.name)
                            }}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                setItemToDelete({ id: cat.id, type: 'category' })
                                setDeleteDialogOpen(true)
                              }}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Subcategories */}
                    {open.includes(cat.id) && (
                      <div className="p-4 bg-gray-50/50">
                        {cat.subs.length > 0 ? (
                          <div className="space-y-2">
                            {cat.subs.map((sub) => (
                              <div
                                key={sub.id}
                                className="flex items-center justify-between p-2 bg-white rounded-lg border"
                              >
                                <div className="flex items-center gap-3">
                                  <Package className="h-4 w-4 text-gray-400" />
                                  <div>
                                    <p className="text-sm font-medium">{sub.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {sub.productCount || 0} products
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => {
                                      setEditingId(sub.id)
                                      setEditValue(sub.name)
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
                            <AlertDescription className="text-sm text-gray-500">
                              No subcategories yet. Click "Add Subcategory" to create one.
                            </AlertDescription>
                          </Alert>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-3 w-full"
                          onClick={() => {
                            setParentCategoryId(cat.id)
                          }}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Subcategory
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* CREATE TAB */}
           <TabsContent value="create">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Folder className="h-5 w-5" />
                    Create Category
                  </CardTitle>
                  <CardDescription>
                    Add a new main category for your products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateCategory} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cat-name">Category Name *</Label>
                      <Input
                        id="cat-name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="e.g., Electronics, Clothing, Books"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={submitting || !newCategoryName.trim()}
                    >
                      {submitting ? (
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      ) : (
                        <PlusCircle className="mr-2 h-4 w-4" />
                      )}
                      Create Category
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Create Subcategory
                  </CardTitle>
                  <CardDescription>
                    Add a subcategory under an existing category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateSubCategory} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sub-name">Subcategory Name </Label>
                      <Input
                        id="sub-name"
                        value={newSubName}
                        onChange={(e) => setNewSubName(e.target.value)}
                        placeholder="e.g., Smartphones, T-shirts, Fiction"
                      />
                    </div>

                  

                    <div className="space-y-2">
                      <Label htmlFor="parent-cat">Category</Label>
                      <Select
                        value={parentCategoryId}
                        onValueChange={setParentCategoryId}
                      >
                        <SelectTrigger id="parent-cat">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              <div className="flex items-center gap-2">
                                <Folder className="h-4 w-4" />
                                {cat.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={submitting || !newSubName.trim() || !parentCategoryId}
                    >
                      {submitting ? (
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      ) : (
                        <PlusCircle className="mr-2 h-4 w-4" />
                      )}
                      Create Subcategory
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
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
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

     
    </div>
  )
}