import './App.css'
import { useCallback, useEffect, useState } from 'react'
import Home from './components/Home'
import List from './components/List'
import { GroceryItems } from './types'
import { slugify } from './utils'
import { PREFIX } from './constants'

const App = () => {
    const [listName, setListName] = useState<string>(
        localStorage.getItem(`${PREFIX}-listName`) ?? ''
    )
    const [list, setList] = useState<GroceryItems | null>(null)
    const slugListName = slugify(listName ?? '')

    const onSubmitListName = useCallback(
        (listName: string) => {
            localStorage.setItem(`${PREFIX}-listName`, listName)
            setList(
                JSON.parse(
                    localStorage.getItem(`${PREFIX}-${slugListName}`) ?? '[]'
                )
            )
        },
        [listName, slugListName]
    )

    const save = useCallback((slugListName: string, list: GroceryItems) => {
        localStorage.setItem(`${PREFIX}-${slugListName}`, JSON.stringify(list))
    }, [])

    useEffect(() => {
        if (list && list.length > 1) {
            save(slugListName, list)
        }
    }, [slugListName, list])

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
