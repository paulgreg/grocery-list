import './App.css'
import { useCallback, useEffect, useState } from 'react'
import Home from './components/Home'
import List from './components/List'
import { GroceryItems } from './types'
import { debounce, slugify } from './utils'
import { PREFIX } from './constants'
import settings from './settings.json'

const DEBOUNCE_SAVE_TIME = 1000

const App = () => {
    const [listName, setListName] = useState<string>(
        localStorage.getItem(`${PREFIX}-listName`) ?? ''
    )
    const [list, setList] = useState<GroceryItems | null>(null)
    const slugListName = slugify(listName ?? '')

    const loadOnline = useCallback(
        async (key: string) =>
            fetch(`${settings.saveUrl}/${key}.json`, {
                headers: {
                    Authorization: `Basic ${settings.authorization}`,
                },
            })
                .then((response) => {
                    if (response.ok) return response.json()
                    if (response.status === 404) {
                        return []
                    }
                })
                .catch((e) => {
                    console.error(e)
                    alert('error while loading json')
                }),
        []
    )

    const saveOnline = useCallback(
        debounce(
            (key: string, data: GroceryItems) =>
                fetch(`${settings.saveUrl}/${key}.json`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        Authorization: `Basic ${settings.authorization}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }),
            DEBOUNCE_SAVE_TIME
        ),
        []
    )

    const save = useCallback((slugListName: string, list: GroceryItems) => {
        localStorage.setItem(`${PREFIX}-${slugListName}`, JSON.stringify(list))
        if (settings.saveOnline) {
            const key = `${PREFIX}-${slugListName}`
            if (key) saveOnline(key, list)
        }
    }, [])

    useEffect(() => {
        if (list && list.length > 0) {
            save(slugListName, list)
        }
    }, [slugListName, list])

    const onSubmitListName = useCallback(
        async (listName: string) => {
            localStorage.setItem(`${PREFIX}-listName`, listName)
            setList(
                JSON.parse(
                    localStorage.getItem(`${PREFIX}-${slugListName}`) ?? '[]'
                )
            )
            if (settings.saveOnline) {
                const json = await loadOnline(`${PREFIX}-${slugListName}`)
                if (json && json instanceof Array) setList(json)
            }
        },
        [listName, slugListName, setList]
    )

    if (list) {
        return <List listName={listName} list={list} setList={setList} />
    }

    return (
        <Home
            listName={listName}
            setListName={setListName}
            onSubmitListName={onSubmitListName}
        />
    )
}

export default App
