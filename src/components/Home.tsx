import s from './Home.module.css'
import { useEffect, useCallback, FormEvent, useRef, useMemo } from 'react'
import settings from '../settings.json'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { PREFIX } from '../constants'
import { IndexeddbPersistence } from 'y-indexeddb'
import { useY } from 'react-yjs'

type HomeProps = {
    onSubmitListName: (listName: string) => void
}

const LISTNAMES = 'listnames'
const guid = `${PREFIX}:${LISTNAMES}`

const Home: React.FC<HomeProps> = ({ onSubmitListName }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const provider = useRef<WebsocketProvider>(null)
    const persistence = useRef<IndexeddbPersistence>(null)

    const yDoc = useMemo(() => new Y.Doc({ guid }), [])
    const yListNames = yDoc.getArray<string>(`listNames`)
    const listNames = useY(yListNames)

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
                onSubmitListName(name)
            }
        },
        [listNames, onSubmitListName, yListNames]
    )

    return (
        <>
            <h1>Grocery list</h1>
            <form className={s.ListNameForm} onSubmit={onSubmitListNameForm}>
                <datalist id="data-listnames">
                    {listNames?.map((name) => (
                        <option value={name} key={name}>
                            {name}
                        </option>
                    ))}
                </datalist>
                <input
                    ref={inputRef}
                    type="text"
                    name="name"
                    className={s.ListNameFormInput}
                    placeholder="market"
                    list="data-listnames"
                    required
                    autoFocus
                    minLength={2}
                    maxLength={20}
                ></input>
                <button>go</button>
            </form>
        </>
    )
}

export default Home
