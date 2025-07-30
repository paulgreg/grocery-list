import s from './ItemForm.module.css'
import {
    useEffect,
    useCallback,
    useState,
    forwardRef,
    ChangeEventHandler,
    FormEventHandler,
} from 'react'
import { COLORS } from '../constants'
import { GroceryItem } from '../types'

type FormItemProps = {
    item?: GroceryItem
    onSubmitItem: (itemName: string, color: string) => void
    onTyping: (itemName: string) => void
}

const ItemForm = forwardRef<HTMLInputElement, FormItemProps>(
    ({ item, onSubmitItem, onTyping }, textInputRef) => {
        const [itemName, setItemName] = useState('')
        const [color, setColor] = useState(COLORS[0])

        const onSubmitItemForm: FormEventHandler<HTMLFormElement> = useCallback(
            (e) => {
                e.preventDefault()
                onSubmitItem(itemName, color)
                setItemName('')
                onTyping('')
            },
            [onSubmitItem, itemName, color, onTyping]
        )

        const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
            (e) => {
                const v = e.target.value
                setItemName(v)
                onTyping(v)
            },
            [onTyping]
        )

        useEffect(() => {
            if (item) {
                setItemName(item.name)
                setColor(item.color)
            }
        }, [item])
        return (
            <form className={s.ItemForm} onSubmit={onSubmitItemForm}>
                <input
                    ref={textInputRef}
                    className={s.ItemFormInput}
                    type="text"
                    placeholder="item"
                    required
                    autoFocus
                    minLength={2}
                    maxLength={100}
                    value={itemName ?? ''}
                    onChange={onChange}
                ></input>
                <select
                    className={s.colorChooser}
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
                <button className={s.ItemFormButton}>save</button>
            </form>
        )
    }
)

export default ItemForm
