import React, { useState } from "react";
import {useQuery, useMutation, gql } from "@apollo/client";
import { Button } from "react-bootstrap";

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
    const {data, loading: export_loading, error: error_loading} = useQuery(EXPORT_QUERY)
    const [createExport, {loading: create_loading, error: create_error, refetch}] = useMutation(CREATE_EXPORT_QUERY)

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
            <Button onClick={handleSubmit}>
                Generate Report
            </Button>
            <ul>
                {data.fetchExports.map(file => (
                    <li key={file.id}>
                        {file.path}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Export;
