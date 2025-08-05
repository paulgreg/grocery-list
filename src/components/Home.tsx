import s from './Home.module.css'
import {
    useCallback,
    FormEvent,
    useRef,
    MouseEvent,
    useState,
    useEffect,
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DeleteIcon from '../assets/close.svg?react'
import settings from '../settings.json'
import { PREFIX } from '../constants'

const requestRawListNames = async () => {
    const url = `${settings.crdtUrl}list?prefix=${PREFIX}`
    const response = await fetch(url)
    if (response.ok) return await response.json()
    return []
}

const deleteList = async (docName: string) => {
    const url = `${settings.crdtUrl}del?doc=${docName}`
    const response = await fetch(url)
    if (response.ok) return await response.json()
    return false
}

const formatRawListName = (rawDocName = '') => rawDocName.split(`${PREFIX}:`)[1]

const Home = () => {
    const [rawListNames, setRawListNames] = useState([])
    const inputRef = useRef<HTMLInputElement>(null)

    const navigate = useNavigate()

    const fillListNames = async () => {
        setRawListNames(await requestRawListNames())
    }

    useEffect(() => {
        if (settings.saveOnline) fillListNames()
    }, [])

    const onSubmitListNameForm = useCallback(
        (e: FormEvent) => {
            e.preventDefault()
            const name = inputRef.current?.value ?? ''
            if (name) {
                navigate(`/list/${name}`)
            }
        },
        [navigate]
    )
    const onDeleteList = useCallback(
        (rawName: string) => (e: MouseEvent) => {
            e.preventDefault()
            if (confirm(`delete ${formatRawListName(rawName)} ?`)) {
                deleteList(rawName)
                fillListNames()
            }
        },
        []
    )

    return (
        <>
            <h1>Grocery list</h1>
            <form className={s.ListNameForm} onSubmit={onSubmitListNameForm}>
                <input
                    ref={inputRef}
                    type="text"
                    name="name"
                    className={s.ListNameFormInput}
                    placeholder="market"
                    required
                    autoFocus
                    minLength={2}
                    maxLength={20}
                ></input>
                <button>go</button>
            </form>
            <ul className={s.list}>
                {rawListNames?.map((name) => (
                    <li key={name} className={s.listItem}>
                        <span className={s.listContainer}>
                            <Link
                                to={`/list/${formatRawListName(name)}`}
                                className={s.listLink}
                            >
                                {formatRawListName(name)}
                            </Link>
                            <button
                                className={s.button}
                                onClick={onDeleteList(name)}
                            >
                                <DeleteIcon
                                    style={{
                                        fill: 'grey',
                                    }}
                                />
                            </button>
                        </span>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Home
