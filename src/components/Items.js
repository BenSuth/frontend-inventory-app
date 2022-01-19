import React, {useState} from 'react'
import Export from './Export'
import Item from './Item'
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
    const [createItem, {loading: create_loading, error: create_error}] = useMutation(CREATE_ITEM_QUERY, {errorPolicy: "none"})

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [count, setCount] = useState(0)
    const [tags, setTags] = useState("")
    const [error, setError] = useState("")

    if (create_loading) return "Loading..."

    const handleSubmit = async (evt) => {
        evt.preventDefault();

        createItem({variables: {name: name, description: description, count: parseInt(count), tags: tags}})
            .then(({data}) => {
                setError("")
                refetch()
            })
            .catch(e => {
                setError(e.toString())
            })
        setName("")
        setDescription("")
        setCount(0)
        setTags("")
    }

    return (
        <div>
            {error !== "" && <span> {error} </span>}
            <Form className="text" onSubmit={handleSubmit}>
                <span> Create an Item! </span><br/>
                <Row>
                    <Form.Group as={Col}>
                        <Form.Label>Name</Form.Label>
                        <div>
                            <Form.Control value={name} onChange={e => setName(e.target.value)}/>
                        </div>
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>Count</Form.Label>
                        <div>
                            <Form.Control value={count} onChange={e => setCount(e.target.value)}/>
                        </div>
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
            <span> Items </span>
                {!item_loading &&
                    <ListGroup variant="flush">
                        {item_data.fetchItems.map(item => (
                            <ListGroup.Item key={item.id}>
                                <Item item={item} refetch={refetch}/>
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