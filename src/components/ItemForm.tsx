import { FormEvent, useEffect, useCallback, useState } from 'react'
import { COLORS } from '../constants'
import { GroceryItem } from '../types'

type AddItemProps = {
    item?: GroceryItem
    onSubmitItem: (itemName: string, color: string) => void
}

const ItemForm: React.FC<AddItemProps> = ({ item, onSubmitItem }) => {
    const [itemName, setItemName] = useState('')
    const [color, setColor] = useState(COLORS[0])

    const onSubmitAddForm = useCallback(
        (e: FormEvent) => {
            e.preventDefault()
            onSubmitItem(itemName, color)
            setItemName('')
        },
        [itemName, color]
    )

    useEffect(() => {
        if (item) {
            setItemName(item.name)
            setColor(item.color)
        }
    }, [item])
    return (
        <form className="ItemForm" onSubmit={onSubmitAddForm}>
            <input
                type="text"
                placeholder="item"
                required
                autoFocus
                minLength={2}
                maxLength={100}
                value={itemName ?? ''}
                onChange={(e) => setItemName(e.target.value)}
            ></input>
            <select
                className="colorChooser"
                style={{ color, backgroundColor: color }}
                onChange={(e) => setColor(e.target.value)}
            >
                {COLORS.map((c) => (
                    <option
                        key={c}
                        value={c}
                        style={{
                            color: c,
                            backgroundColor: c,
                        }}
                    >
                        {c}
                    </option>
                ))}
            </select>
            <button>Add</button>
        </form>
    )
}

export default ItemForm
