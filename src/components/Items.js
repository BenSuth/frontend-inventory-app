import React, {useState} from 'react'
import Export from './Export'
import {useQuery, useMutation, gql} from '@apollo/client'
import { Collapse } from 'react-bootstrap'
import '../stylesheets/items.css'

const CREATE_ITEM_QUERY = gql`
    mutation($name: String!, $description: String!, $count: Int!, $tags: [String!]!){
        createItem(input: {
            params: {
                name: $name
                description: $description
                count: $count
                tags: $tags
            }
        }) {
            item {
                id
                name
                description
                count
                tags
            }
        }
    }
`

const UPDATE_ITEM_QUERY = gql`
    mutation($itemId: Int!, $name: String, $description: String, $count: Int, $tags: [String]) {
        updateItem(input: {
            itemId: $itemId
            params:{
                name: $name
                description: $description
                count: $count
                tags: $tags
            }
            }) {
            item {
                id
                name
                description
                count
                tags
            }
        }
    }
`

const DELETE_ITEM_QUERY = gql`
    mutation($itemId: ID!) {
        deleteItem(input: {itemId: $itemId}) {
        item {
            name
            description
            tags
            count
        }
        }
    }
`

const ITEMS_QUERY = gql`
    query {
        fetchItems {
            id
            name
            count
            description
            tags
          }
    }
`

const Items = () => {
    const {data: item_data, loading: item_loading, error: item_error, refetch: refetch} = useQuery(ITEMS_QUERY)
    const [createItem, {loading: create_loading, error: create_error}] = useMutation(CREATE_ITEM_QUERY)
    const [updateItem, {loading: update_loading, error: update_error}] = useMutation(UPDATE_ITEM_QUERY)
    const [deleteItem, {loading: delete_loading, error: delete_error}] = useMutation(DELETE_ITEM_QUERY)

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [count, setCount] = useState(0)
    const [tags, setTags] = useState("")
    const [isUpdate, setIsUpdate] = useState({})

    if (create_loading || update_loading || delete_loading) return "Loading..."
    if (create_error) return (<pre> {create_error.message} </pre>)    
    if (update_error) return (<pre> {update_error.message} </pre>)   
    if (delete_error) return (<pre> {delete_error.message} </pre>)   

    if (!item_loading) console.log(item_data.fetchItems)
    const handleSubmit = async (evt) => {
        evt.preventDefault();
        if (parseInt(count) < 0) {
            setCount(0)
            return
        }

        await createItem({variables: {name: name, description: description, count: parseInt(count), tags: tags}})

        setName("")
        setDescription("")
        setCount(0)
        setTags("")
        refetch()
    }

    const handleUpdateForm = async (id) => {
        let update = isUpdate
        if (update[id]) {
            update[id] = false
        } else {
            update[id] = true
        }
        setIsUpdate(update)
    }

    const handleUpdate = async (id) => {
        if (isUpdate[id]) {
            isUpdate[id] = false
        } else {
            isUpdate[id] = true
        }
        setIsUpdate(isUpdate)
    }
    
    const handleDelete = async (id) => {
        await deleteItem({variables:{itemId: id}})
        refetch()
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1> Create an Item! </h1>
                <label>
                    Name:
                    <input type="text" value={name} onChange={e=> setName(e.target.value)}/>
                </label>
                <label>
                    Count:
                    <input type="text" value={count} onChange={e=> setCount(e.target.value)}/>
                </label>
                <label>
                    Description:
                    <input type="textarea" value={description} onChange={e=> setDescription(e.target.value)} />
                </label>
                <label>
                    Tags:
                    <input type="text" value={tags} onChange={e=> setTags(e.target.value)}/>
                </label>
                <input type="submit" value="Submit" />
            </form>
            <div>
            <h1> Items </h1>
                {!item_loading &&
                    <ul>
                        {item_data.fetchItems.map(item => (
                            <li key={item.id}>
                                {item.name} <br/>
                                {"Count: " + parseInt(item.count)} <br/>
                                {item.description} <br/>
                                {item.tags} <br/>
                                <button onClick={() => handleDelete(item.id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                }
            </div>
            <Export />
        </div>
    )
}

export default Items