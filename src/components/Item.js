import React, {useState} from 'react'
import { Form, Row, Button, Col} from 'react-bootstrap'
import {useQuery, useMutation, gql} from '@apollo/client'
import '../stylesheets/item.css'

const UPDATE_ITEM_QUERY = gql`
    mutation($itemId: ID!, $name: String, $description: String, $count: Int, $tags: [String!]) {
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

const Item = ({item, refetch}) => {
    const [updateItem, {loading: update_loading, error: update_error}] = useMutation(UPDATE_ITEM_QUERY)
    const [deleteItem, {loading: delete_loading, error: delete_error}] = useMutation(DELETE_ITEM_QUERY)

    const [name, setName] = useState(item.name)
    const [description, setDescription] = useState(item.description)
    const [count, setCount] = useState(item.count)
    const [tags, setTags] = useState(item.tags)
    const [disable, setDisable] = useState(true)
    const [error, setError] = useState("")

    if (update_loading) return "Loading..." 
    if (delete_loading) return "Loading..."

    const handleClick = () => {
        setDisable(!disable)
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        updateItem({variables: {itemId: item.id, name: name, description: description, count: count, tags: tags}})
        .then(({data}) => {
            setError("")
            refetch()
        })
        .catch(e => {
            setError(e)
        })
    }

    const handleDelete = (id) => {
        deleteItem({variables:{itemId: id}})
        .then(({data}) => {
            setError("")
            refetch()
        })
        .catch(e => {
            setError(e.toString())
        })
        refetch()
    }

    return (
        <div className="item-width">
            <Form onSubmit={handleSubmit}>
                {error !== "" && <span> {error} </span>}            
                <fieldset disabled={disable}>
                <Row>
                    <Col>
                        <Form.Control as="textarea" value={name} onChange={e => setName(e.target.value)}/>
                    </Col>

                    <Col>
                        <Form.Control value={count} onChange={e => setCount(e.target.value)}/>
                    </Col>
                </Row>
                <Row>
                    <Form.Group>
                        <div>
                            <Form.Control as="textarea" value={description} onChange={ e => setDescription(e.target.value)}/>
                        </div>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col}>
                        <div>
                            <Form.Control as="textarea" value={tags} onChange={e => setTags(e.target.value)}/>
                        </div>
                    </Form.Group>
                </Row>
                <Button type="submit">
                    Update
                </Button>
                <legend>                
                    <Button onClick={handleClick}>
                        Edit
                    </Button>
                    <Button onClick={() => handleDelete(item.id)}> 
                        Delete 
                    </Button>
                </legend>
                </fieldset>
            </Form>
        </div>
    )
}

export default Item;