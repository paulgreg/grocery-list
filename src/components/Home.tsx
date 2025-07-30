import s from './Home.module.css'
import {
    useEffect,
    useCallback,
    FormEvent,
    useRef,
    useMemo,
    MouseEvent,
} from 'react'
import settings from '../settings.json'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { PREFIX } from '../constants'
import { IndexeddbPersistence } from 'y-indexeddb'
import { useY } from 'react-yjs'
import { Link, useNavigate } from 'react-router-dom'
import DeleteIcon from '../assets/close.svg?react'

const LISTNAMES = 'listnames'
const guid = `${PREFIX}:${LISTNAMES}`

const Home = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const provider = useRef<WebsocketProvider>(null)
    const persistence = useRef<IndexeddbPersistence>(null)

    const yDoc = useMemo(() => new Y.Doc({ guid }), [])
    const yListNames = yDoc.getArray<string>(`listNames`)
    const listNames = useY(yListNames)

    const navigate = useNavigate()

    useEffect(() => {
        persistence.current = new IndexeddbPersistence(guid, yDoc)
        if (settings.saveOnline && settings.wsUrl) {
            provider.current = new WebsocketProvider(settings.wsUrl, guid, yDoc)
            return () => provider.current?.disconnect()
        }
    }, [yDoc])

    const onSubmitListNameForm = useCallback(
        (e: FormEvent) => {
            e.preventDefault()
            const name = inputRef.current?.value ?? ''
            if (name) {
                if (!listNames.includes(name)) {
                    yListNames.insert(0, [name])
                }
                navigate(`/list/${name}`)
            }
        },
        [listNames, navigate, yListNames]
    )
    const onDeleteList = useCallback(
        (name: string) => (e: MouseEvent) => {
            e.preventDefault()
            if (confirm(`delete ${name} ?`)) {
                const idx = yListNames
                    .toArray()
                    .findIndex((listName) => listName === name)
                yListNames.delete(idx, 1)
            }
        },
        [yListNames]
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
                {listNames?.map((name) => (
                    <li key={name} className={s.listItem}>
                        <span className={s.listContainer}>
                            <Link to={`/list/${name}`} className={s.listLink}>
                                {name}
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
