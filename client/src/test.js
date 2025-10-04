import {useState,useEffect} from "react";

const server_url = process.env.REACT_APP_SERVER_URL;

export default function Test(){
    const [data,setData] = useState(null);

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const response = await fetch(server_url+"/api/user",{
                    method:"GET",
                    credentials:"include",
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                console.log({response});
                const body = await response.json();
                console.log({body});
                setData(body);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setData(null);
            }
        }
        fetchData();
    },[])
    return (
        <>
            <br/>
            <br/>
            <br/>
            <br/>
            <h1>
                {data ? JSON.stringify(data) : null}
            </h1>
            <h1>
                {data ? "Your Session is Authenticated and Saved on Server!...." : "Your Not Authenticated!...."}
            </h1>
        </>
    );
}; 