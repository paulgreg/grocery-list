import { createContext, useContext } from 'react'
import { GroceryItem, GroceryItems } from './types'

type DataContextType = {
    items: GroceryItems
    addItem: (item: GroceryItem) => void
    checkItem: (id: string) => void
    updateItem: (id: string, name: string, color: string) => void
    deleteItem: (id: string) => void
    uncheckAllItems: () => void
}

export const DataContext = createContext<DataContextType>({} as DataContextType)

export const useDataContext = () => useContext(DataContext)
