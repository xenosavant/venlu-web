import React, { useState, useEffect } from "react";

export const BASE_URL = 'http://localhost:3000';


const fetchData = <T,>(setData: React.Dispatch<React.SetStateAction<any>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string | undefined>>,
    fetchCall: () => Promise<Response>) => {

    setLoading(true);

    fetchCall().then(res => {
        return res.json()
    }
    ).then((data: T) => {
        setData(data);
        setLoading(false);
    }).catch(err => {
        setError(err.message);
        setLoading(false);
    })
}

export const useGet = <T,>(url: string) => {
    const [data, setData] = useState<T | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        fetchData<T>(setData, setLoading, setError, () => fetch(`${BASE_URL}/${url}`));
    }, [url]);

    return { data, loading, error };
}

export const usePost = <T,>(url: string, body: any) => {

    const [data, setData] = useState<T | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        fetchData<T>(setData, setLoading, setError, () => fetch(`${BASE_URL}/${url}`, {
            method: "POST",
            body: JSON.stringify(body)
        }));
    }, [url]);

    return { data, loading, error };
}