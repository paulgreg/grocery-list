import s from './ListItem.module.css'
import classNames from 'classnames'
import { GroceryItem } from '../types'
import DeleteIcon from '../assets/close.svg?react'
import EditIcon from '../assets/pen_1.svg?react'
import { useDataContext } from '../DataContext'
import { ChangeEvent, MouseEvent, useCallback } from 'react'

type ListItemProps = {
    item: GroceryItem
    onEditClick: (id: string) => (e: MouseEvent) => void
}

const ListItem: React.FC<ListItemProps> = ({ item, onEditClick }) => {
    const { checkItem, deleteItem } = useDataContext()
    const { id, color, name, checked } = item

    const onCheckChange = useCallback(
        (id: string) => (e: ChangeEvent) => {
            e.stopPropagation()
            checkItem(id)
        },
        [checkItem]
    )

    const onDeleteClick = useCallback(
        (id: string, name: string) => (e: MouseEvent) => {
            e.stopPropagation()
            if (confirm(`Delete ${name} ?`)) {
                deleteItem(id)
            }
        },
        [deleteItem]
    )

    return (
        <li key={id} className={classNames(s.item, checked && s.checked)}>
            <input
                id={`checkbox-${id}`}
                type="checkbox"
                checked={Boolean(checked)}
                onChange={onCheckChange(id)}
            />
            <span
                className={s.color}
                style={{
                    backgroundColor: color,
                }}
            ></span>
            <label htmlFor={`checkbox-${id}`} className={s.label}>
                {name}
            </label>
            <EditIcon
                className={s.icon}
                onClick={onEditClick(id)}
                style={{
                    fill: 'grey',
                }}
            />
            <DeleteIcon
                className={s.icon}
                onClick={onDeleteClick(id, name)}
                style={{
                    fill: 'grey',
                }}
            />
        </li>
    )
}

export default ListItem
