import s from './App.module.css'
import { Outlet, useParams } from 'react-router-dom'
import DataContextProvider from './DataContextProvider'
import { slugify } from './utils'

const InnerApp = () => (
    <div className={s.root}>
        <Outlet />
    </div>
)

const App = () => {
    const { listName } = useParams()

    if (listName) {
        return (
            <DataContextProvider listName={slugify(listName)}>
                <InnerApp />
            </DataContextProvider>
        )
    }

    return <InnerApp />
}

export default App
