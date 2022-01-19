import React, { useState } from "react";
import {useQuery, useMutation, gql } from "@apollo/client";
import {Form, Button, Card, ListGroup} from "react-bootstrap";
import '../stylesheets/export.css'

const EXPORT_QUERY = gql`
    {
        fetchExports {
            id
            externalName
            internalName
            path
            size
        }
    }
`
const CREATE_EXPORT_QUERY = gql`
    mutation($externalName: String!) {
        createExport(input: {
            params: {
                externalName: $externalName
            }
        }) {
            path
        }
    }
  
`

const Export = () => {
    const {data, loading: export_loading, refetch} = useQuery(EXPORT_QUERY)
    const [createExport, {loading: create_loading}] = useMutation(CREATE_EXPORT_QUERY)

    const [externalName, setExternalName] = useState("")
    const [error, setError] = useState("")

    if (export_loading || create_loading) return "Loading..."
    if (error) return <pre> {error.message} </pre>

    const handleSubmit = (evt) => {
        evt.preventDefault();

        createExport({variables: {externalName: externalName}})
            .then(({data}) => {
                setError("")
            })
            .catch(e => {
                setError(e.toString())
            })
            
        refetch()
        setExternalName("")
    }
    
    return (
        <div>
            <span> CSV Exports </span> <br/>
            {error !== "" && <span> {error} </span>}
            <Form onSubmit={handleSubmit}>
                <Form.Label>Name</Form.Label>
                <Form.Control value={externalName} onChange={e => setExternalName(e.target.value)}/>
                <Button type="submit">
                    Generate Report
                </Button>
            </Form>
            <ul>
                {data.fetchExports.map(file => (
                    <li key={file.id}>
                        <div>
                            <Card>
                                <Card.Header>{file.internalName}</Card.Header>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>{file.externalName}</ListGroup.Item>
                                    <ListGroup.Item>{file.size}</ListGroup.Item>
                                    <ListGroup.Item>
                                        <Card.Link href={file.path}> Download Here! </Card.Link>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Export;
