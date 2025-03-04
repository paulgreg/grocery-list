import { useState, useEffect, useCallback, FormEvent } from 'react'
import settings from '../settings.json'

type HomeProps = {
    onSubmitListName: (listName: string) => void
}
const LISTNAMES = 'listnames'

const Home: React.FC<HomeProps> = ({ onSubmitListName }) => {
    const [listName, setListName] = useState('')
    const [listNames, setListNames] = useState<Array<string>>([])

    const loadListNames = useCallback(async () => {
        if (!settings.saveOnline || !navigator.onLine)
            return Promise.resolve([])
        try {
            const response = await fetch(
                `${settings.saveUrl}/${LISTNAMES}.json`,
                {
                    headers: {
                        Authorization: `Basic ${settings.authorization}`,
                    },
                }
            )
            if (response.ok) {
                const json = await response.json()
                return json as Array<string>
            }
            return Promise.resolve([])
        } catch (e) {
            console.error('error while loading listnames', e)
            return Promise.resolve([])
        }
    }, [])

    useEffect(() => {
        const load = async () => setListNames(await loadListNames())
        if (!listName) load()
    }, [listName, setListNames])

    const addListNameOnline = useCallback(
        async (listName: string) => {
            if (!settings.saveOnline) return
            if (listNames.includes(listName)) return
            return fetch(`${settings.saveUrl}/add/${LISTNAMES}.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${settings.authorization}`,
                },
                body: JSON.stringify([listName]),
            }).catch((e) => {
                console.error('error while saving listname', e)
            })
        },
        [listNames]
    )

    const onSubmitListNameForm = useCallback(
        (e: FormEvent) => {
            e.preventDefault()
            if (listName) {
                addListNameOnline(listName)
                onSubmitListName(listName)
            }
        },
        [listName, addListNameOnline]
    )

    return (
        <>
            <h1>Grocery list</h1>
            <form className="ListNameForm" onSubmit={onSubmitListNameForm}>
                <datalist id="data-listnames">
                    {listNames.map((name) => (
                        <option value={name} key={name}>
                            {name}
                        </option>
                    ))}
                </datalist>
                <input
                    type="text"
                    placeholder="market"
                    list="data-listnames"
                    required
                    autoFocus
                    minLength={2}
                    maxLength={20}
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                ></input>
                <button>go</button>
            </form>
        </>
    )
}

export default Home
