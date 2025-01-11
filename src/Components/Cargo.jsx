import React, { useState, useRef, useEffect } from 'react';
import Cargostyle from "../CSS Files/Cargo.module.css";

function Cargo({information}){
    const [show, setShow] = useState(false);
    const [del, setDel] = useState(false);
    const [position, setPosition] = useState(Cargostyle.cargo_informationright)
    const popupref = useRef(null);
    /*
    const handleDel = async (id) =>{
        try{
            await
        }catch(err){
            console.log(err)
        }
    }
    */
    const getPopupstyle = () =>{
        if(popupref.current){
            const rect = popupref.current.getBoundingClientRect();
            const spaceonright = window.innerWidth - rect.right;
            console.log(information.CargoID + spaceonright)
            if(spaceonright <= 300){
                setPosition(Cargostyle.cargo_informationleft);
            }
            else{
                setPosition(Cargostyle.cargo_informationright);
            }
        }
    }

    useEffect(()=>{
        window.addEventListener('resize',getPopupstyle);
        return()=>{
            window.removeEventListener('resize', getPopupstyle);
        };
    },[]);

    useEffect(()=>{
        if(show){
            getPopupstyle()
        }
    },[show])

    return (
        <>
            <div className={Cargostyle.cargo_container}>
                <button className={Cargostyle.btn} onClick={() => setShow(!show)}>
                    <h2>{information.CargoID}</h2>
                </button>

                {show ? 
                <div className={position} ref={popupref}>
                    <p>ID : {information.CargoID}</p>
                    <p>Destination : {information.Destination_Country}</p>
                    <p>Deadline : {information.Deadline}</p>
                    <p>Load : {information.Load}</p>
                    <p>Type : {information.Type}</p>
                </div> : null
                }
            </div>
        </>  
    )
}

export default Cargo