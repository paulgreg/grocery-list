import { FormEvent, useCallback } from 'react'

type HomeProps = {
    listName: string
    setListName: (name: string) => void
    onSubmitListName: (listName: string) => void
}

const Home: React.FC<HomeProps> = ({
    listName,
    setListName,
    onSubmitListName,
}) => {
    const onSubmitListNameForm = useCallback(
        (e: FormEvent) => {
            e.preventDefault()
            if (listName) {
                onSubmitListName(listName)
            }
        },
        [listName]
    )

    return (
        <>
            <h1>Grocery list</h1>
            <form className="ListNameForm" onSubmit={onSubmitListNameForm}>
                <input
                    type="text"
                    placeholder="market"
                    required
                    autoFocus
                    minLength={2}
                    maxLength={10}
                    value={listName ?? ''}
                    onChange={(e) => setListName(e.target.value)}
                ></input>
                <button>go</button>
            </form>
        </>
    )
}

export default Home
