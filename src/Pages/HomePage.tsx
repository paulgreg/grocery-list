import { useCallback } from 'react'
import Home from '../components/Home'
import { slugify } from '../utils'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
    const navigate = useNavigate()

    const onSubmitListName = useCallback(
        (name: string) => {
            navigate(`/list/${slugify(name)}`)
        },
        [navigate]
    )

    return <Home onSubmitListName={onSubmitListName} />
}

export default HomePage
