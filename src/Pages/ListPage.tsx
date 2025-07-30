import List from '../components/List'
import { useNavigate, useParams } from 'react-router-dom'

const ListPage = () => {
    const { listName } = useParams()
    const navigate = useNavigate()

    if (!listName) {
        navigate('/')
    }

    return listName && <List listName={listName} />
}

export default ListPage
