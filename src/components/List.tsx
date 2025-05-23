import { ChangeEvent, MouseEvent, useState, useCallback, useRef } from 'react'
import { GroceryItem, GroceryItems } from '../types'
import { generateShortUID, sortList } from '../utils'
import ItemForm from './ItemForm'
import DeleteIcon from '../assets/close.svg?react'
import EditIcon from '../assets/pen_1.svg?react'
import HomeIcon from '../assets/home.svg?react'

type ListProps = {
    listName: string
    list: GroceryItems
    setList: (items: GroceryItems) => void
}

const List: React.FC<ListProps> = ({ listName, list, setList }) => {
    const [editItem, setEditItem] = useState<GroceryItem | undefined>(undefined)
    const disableUncheck = !list.some((item) => item.checked)
    const textInputRef = useRef<HTMLInputElement>(null)
    const [filter, setFilter] = useState('')

    const onSubmitListName = useCallback(
        (itemName: string, color: string) => {
            if (editItem) {
                const newList = list.map((item) =>
                    item.id === editItem.id
                        ? { ...item, name: itemName, color }
                        : item
                )
                setList(newList.toSorted(sortList))
                setEditItem(undefined)
            } else {
                const newList = list.concat({
                    id: generateShortUID(),
                    name: itemName,
                    checked: false,
                    color,
                })
                setList(newList.toSorted(sortList))
            }
        },
        [editItem, list, setList]
    )

    const onCheckChange = useCallback(
        (id: string) => (e: ChangeEvent) => {
            e.stopPropagation()
            const newList = list
                .map((item) =>
                    item.id === id ? { ...item, checked: !item.checked } : item
                )
                .sort(sortList)
            setList(newList)
        },
        [list, setList]
    )

    const onDeleteClick = useCallback(
        (id: string, name: string) => (e: MouseEvent) => {
            e.stopPropagation()
            if (confirm(`Delete ${name} ?`)) {
                const newList = list.filter((item) => item.id !== id)
                setList(newList)
            }
        },
        [list, setList]
    )

    const onEditClick = useCallback(
        (id: string) => (e: MouseEvent) => {
            e.stopPropagation()
            const item = list.find((item) => item.id === id)
            if (!item) return
            setEditItem(item)
            setFilter(item.name)
            textInputRef.current?.scrollIntoView()
            textInputRef.current?.focus()
        },
        [list, setList]
    )

    const onUncheckAllClick = useCallback(
        (e: MouseEvent) => {
            e.stopPropagation()
            const newList = list
                .map((item) => ({ ...item, checked: false }))
                .sort(sortList)
            setList(newList)
        },
        [list, setList]
    )

    const onTyping = useCallback((v: string) => {
        setFilter(v.toLocaleLowerCase())
    }, [])

    const filteredList = list.filter((item) =>
        item.name.toLocaleLowerCase().includes(filter)
    )

    return (
        <>
            <header>
                <h1>{listName}</h1>
                <a href="./" title="back to home" className="homeIcon">
                    <HomeIcon
                        className="icon"
                        style={{
                            fill: 'grey',
                        }}
                    />
                </a>
            </header>
            <ItemForm
                item={editItem}
                onSubmitItem={onSubmitListName}
                onTyping={onTyping}
                ref={textInputRef}
            />
            <ul className="items">
                {filteredList.map((item) => (
                    <li
                        key={item.id}
                        className={`item ${item.checked ? 'checked' : ''} `}
                    >
                        <input
                            id={`checkbox-${item.id}`}
                            type="checkbox"
                            checked={item.checked}
                            onChange={onCheckChange(item.id)}
                        />
                        <span
                            className="color"
                            style={{ backgroundColor: item.color }}
                        ></span>
                        <label
                            htmlFor={`checkbox-${item.id}`}
                            className="label"
                        >
                            {item.name}
                        </label>
                        <EditIcon
                            className="icon"
                            onClick={onEditClick(item.id)}
                            style={{
                                fill: 'grey',
                            }}
                        />
                        <DeleteIcon
                            className="icon"
                            onClick={onDeleteClick(item.id, item.name)}
                            style={{
                                fill: 'grey',
                            }}
                        />
                    </li>
                ))}
            </ul>
            {filter === '' && (
                <p>
                    <button
                        className="unckeckAll"
                        disabled={disableUncheck}
                        onClick={onUncheckAllClick}
                    >
                        Uncheck all
                    </button>
                </p>
            )}
        </>
    )
}

export default List
