export type GroceryItem = {
    id: string
    name: string
    checked: boolean
    color: string
}
export type GroceryItems = Array<GroceryItem>

export type YGroceryItem = Map<string, string | boolean>

export type YGroceryItems = Array<YGroceryItem>
