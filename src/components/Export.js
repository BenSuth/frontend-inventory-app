import React from "react";
import {useQuery, gql } from "@apollo/client";

const EXPORT_QUERY = gql`
    {
        fetchExports {
            path
          }
    }
`

const Export = () => {
    const {data, loading, error} = useQuery(EXPORT_QUERY)

    if (loading) return "Loading..."
    if (error) return <pre> {error.message} </pre>
    
    return (
        <div>
            <h1> CSV Exports </h1>
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
