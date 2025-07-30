import s from './List.module.css'
import { MouseEvent, useState, useCallback, useRef } from 'react'
import { GroceryItem } from '../types'
import { generateShortUID } from '../utils'
import ItemForm from './ItemForm'
import HomeIcon from '../assets/home.svg?react'
import { useDataContext } from '../DataContext'
import { Link } from 'react-router-dom'
import ListItem from './ListItem'

type ListProps = {
    listName: string
}

const List: React.FC<ListProps> = ({ listName }) => {
    const { items, addItem, updateItem, uncheckAllItems } = useDataContext()

    const [editItem, setEditItem] = useState<GroceryItem | undefined>(undefined)
    const disableUncheck = !items.some((item) => item.checked)
    const textInputRef = useRef<HTMLInputElement>(null)
    const [filter, setFilter] = useState('')

    const onSubmitItem = useCallback(
        (name: string, color: string) => {
            if (editItem) {
                const id = editItem.id
                updateItem(id, name, color)
                setEditItem(undefined)
            } else {
                addItem({
                    id: generateShortUID(),
                    name,
                    checked: false,
                    color,
                })
            }
        },
        [addItem, editItem, updateItem]
    )

    const onEditClick = useCallback(
        (id: string) => (e: MouseEvent) => {
            e.stopPropagation()
            const item = items.find((item) => item.id === id)
            if (!item) return
            setEditItem(item)
            setFilter(item.name)
            textInputRef.current?.scrollIntoView()
            textInputRef.current?.focus()
        },
        [items]
    )

    const onUncheckAllClick = useCallback(
        (e: MouseEvent) => {
            e.stopPropagation()
            uncheckAllItems()
        },
        [uncheckAllItems]
    )

    const onTyping = useCallback((v: string) => {
        setFilter(v.toLocaleLowerCase())
    }, [])

    const filteredList = items.filter((item) =>
        item.name.toLocaleLowerCase()?.includes(filter)
    )

    return (
        <>
            <header>
                <h1>{listName}</h1>
                <Link to="/" title="back to home" className={s.homeIcon}>
                    <HomeIcon
                        className={s.icon}
                        style={{
                            fill: 'grey',
                        }}
                    />
                </Link>
            </header>
            <ItemForm
                item={editItem}
                onSubmitItem={onSubmitItem}
                onTyping={onTyping}
                ref={textInputRef}
            />
            <ul className={s.items}>
                {filteredList.map((item) => (
                    <ListItem
                        key={item.id}
                        item={item}
                        onEditClick={onEditClick}
                    />
                ))}
            </ul>
            {filter === '' && (
                <p>
                    <button
                        className={s.unckeckAll}
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
