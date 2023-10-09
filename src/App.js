import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';



function App({ setUser }) {
const navigate = useNavigate();
  
const HandleSubmitLogIn = async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  try {
    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    const user = data.user;
    
    if (response.status === 200) {
      setUser(user);
      navigate('/', { state: { user: user} });
      
    } else {
      console.log(data.message);
    
    }
  } catch (error) {
    console.error('Error:', error);
  }
 
};
  return (
   
   <div className="container text-center text-lg-start" style={{ marginLeft: '27%', marginTop: '10%'}}> 
        <div className="card bg-glass" style={{ width: '60%' }}>
            <div className="card-body px-4 py-5 px-md-5">
              <form onSubmit={HandleSubmitLogIn}>
           
                <div className="row">
                  
                <h1 className="mb-3 h3">Login</h1>
                  
                </div>
  
        
                <div className="form-outline mb-4">
                  <input type="email" name="email" className="form-control" />
                  <label className="form-label">Email address</label>
                </div>
  
               
                <div className="form-outline mb-4">
                  <input type="password" name="password" className="form-control" />
                  <label className="form-label" >Password</label>
                </div>
  
  
              
                <button type="submit" className="btn btn-primary btn-block mb-4">
                  Sign In
                </button>
  
             
                <div className="text-center">
                  <p>Don't have an account yet? <Link to="/Register">Register</Link></p>
                
                </div>
              </form>
            </div>
          </div>
   </div>
   
  );
}

export default App;
