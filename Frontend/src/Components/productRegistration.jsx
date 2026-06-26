import React, { useState } from 'react'
import axios from 'axios'
function productRegistration() {
    const [formData, setFormData] = useState({
        sku:"",
        name:"",
        price:"",
        quantity:""
    })
    const [error, setError] = useState("")
    const [sucess, setSuccess] = useState("")
    const handleChange = (e) =>{
        setFormData({
            ...formData, [e.targrt.name]: e.targrt.value
        })
    }
    const handleSubmit =async (e)=>{
        e.preventDefault()
    }
  return (
    <div>productRegistration</div>
  )
}

export default productRegistration