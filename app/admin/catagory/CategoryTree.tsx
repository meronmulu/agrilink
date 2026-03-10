'use client'

import { useState } from "react"
import { Category } from "@/types/category"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  ChevronDown,
  ChevronRight,
  Folder,
  Pencil,
  Trash
} from "lucide-react"

type Props = {
  categories: any[]
  subcategories: any[]
  onDeleteCategory: (id: string) => void
  onDeleteSub: (id: string) => void
  onEditCategory: (id: string, name: string) => void
  onEditSub: (id: string, name: string) => void
}

export default function CategoryTree({
  categories,
  subcategories,
  onDeleteCategory,
  onDeleteSub,
  onEditCategory,
  onEditSub
}: Props) {

  const [open, setOpen] = useState<string[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [value, setValue] = useState("")

  const toggle = (id: string) => {
    setOpen(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  return (

    <div className="space-y-3">

      {categories.map((cat) => {

        const subs = subcategories.filter(
          s => s.categoryId === cat.id
        )

        const isOpen = open.includes(cat.id)

        return (

          <div
            key={cat.id}
            className="border rounded-lg p-3 bg-background"
          >

            {/* CATEGORY ROW */}

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">

                <button onClick={() => toggle(cat.id)}>

                  {isOpen
                    ? <ChevronDown size={18} />
                    : <ChevronRight size={18} />}

                </button>

                <Folder className="text-primary" size={18} />

                {editing === cat.id ? (

                  <Input
                    value={value}
                    onChange={(e)=>setValue(e.target.value)}
                    className="w-40"
                  />

                ) : (
                  <span className="font-medium">
                    {cat.name}
                  </span>
                )}

              </div>

              <div className="flex gap-2">

                {editing === cat.id ? (

                  <Button
                    size="sm"
                    onClick={()=>{
                      onEditCategory(cat.id,value)
                      setEditing(null)
                    }}
                  >
                    Save
                  </Button>

                ) : (

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={()=>{
                      setEditing(cat.id)
                      setValue(cat.name)
                    }}
                  >
                    <Pencil size={16}/>
                  </Button>

                )}

                <Button
                  size="icon"
                  variant="destructive"
                  onClick={()=>onDeleteCategory(cat.id)}
                >
                  <Trash size={16}/>
                </Button>

              </div>

            </div>

            {/* SUBCATEGORY LIST */}

            {isOpen && (

              <div className="ml-8 mt-3 space-y-2">

                {subs.map((sub:any)=> (

                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-2 border rounded"
                  >

                    {editing === sub.id ? (

                      <Input
                        value={value}
                        onChange={(e)=>setValue(e.target.value)}
                        className="w-40"
                      />

                    ) : (
                      <span>{sub.name}</span>
                    )}

                    <div className="flex gap-2">

                      {editing === sub.id ? (

                        <Button
                          size="sm"
                          onClick={()=>{
                            onEditSub(sub.id,value)
                            setEditing(null)
                          }}
                        >
                          Save
                        </Button>

                      ) : (

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={()=>{
                            setEditing(sub.id)
                            setValue(sub.name)
                          }}
                        >
                          <Pencil size={16}/>
                        </Button>

                      )}

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={()=>onDeleteSub(sub.id)}
                      >
                        <Trash size={16}/>
                      </Button>

                    </div>

                  </div>

                ))}

                {subs.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No subcategories
                  </p>
                )}

              </div>

            )}

          </div>

        )

      })}

    </div>

  )
}