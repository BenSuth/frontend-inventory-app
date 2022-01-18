import React, {useState} from 'react'
import Export from './Export'
import {useQuery, useMutation, gql} from '@apollo/client'
import { Form, Row, Button, Col, ListGroup, Card } from 'react-bootstrap'
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
    
    const handleDelete = async (id) => {
        await deleteItem({variables:{itemId: id}})
        refetch()
    }

    return (
        <div>
            <Form className="text" onSubmit={handleSubmit}>
                <span> Create an Item! </span><br/>
                <Row>
                    <Form.Group as={Col}>
                        <Form.Label>Name</Form.Label>
                        <Form.Control value={name} onChange={e => setName(e.target.value)}/>
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>Count</Form.Label>
                        <Form.Control value={count} onChange={e => setCount(e.target.value)}/>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <div>
                            <Form.Control as="textarea" value={description} onChange={ e => setDescription(e.target.value)}/>
                        </div>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group as={Col}>
                        <Form.Label>Tags</Form.Label>
                        <div>
                            <Form.Control as="textarea" value={tags} onChange={e => setTags(e.target.value)}/>
                        </div>
                    </Form.Group>
                </Row>
                <Button type="submit">
                    Submit
                </Button>
            </Form>
            <div>
            <h1> Items </h1>
                {!item_loading &&
                    <ListGroup variant="flush">
                        {item_data.fetchItems.map(item => (
                            <ListGroup.Item key={item.id}>
                                    <Card>
                                        <div className="card-text">
                                            <Card.Header>{item.name}</Card.Header>
                                            <Card.Title>{"Count: " + parseInt(item.count)}</Card.Title>
                                            <Card.Body>{item.description} </Card.Body>
                                            <Card.Footer>{item.tags} <br/></Card.Footer>
                                            <button variant="primary" onClick={() => handleDelete(item.id)}>Delete</button>
                                        </div>
                                    </Card>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                }
            </div>
            <Export />
        </div>
    )
}

export default Items