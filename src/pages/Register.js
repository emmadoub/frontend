import React from 'react'
import { Link, useNavigate } from 'react-router-dom';


function Register() {
  const navigate = useNavigate();
  const handleSubmitRegister = async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    //console.log(formData.get('email') + " " + formData.get('password'))
  
    try {
      const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        body: formData,
      });
  
      if (response.status === 200) {
        navigate('/login');
      } else {
        const data = await response.json();
        console.log(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

    return (
        <RegisterForm handleSubmitRegister={handleSubmitRegister}/>
    )
}

function RegisterForm ({handleSubmitRegister}) {
  return (
    <div className="container text-center text-lg-start" style={{ marginLeft: '27%', marginTop: '10%'}}> 
    <div className="card bg-glass" style={{ width: '60%' }}>
        <div className="card-body px-4 py-5 px-md-5">
        <form onSubmit={handleSubmitRegister}>
        <div className="row">
          
    

          <h1 className="mb-3 h3">Register</h1>
     
          <div className="col-md-12 mb-4">
            <div className="form-outline">
              <input type="text" name="name" className="form-control" />
              <label className="form-label">Full Name</label>
            </div>
          </div>
        </div>

      
        <div className="form-outline mb-4">
          <input type="email" name="email" className="form-control" />
          <label className="form-label">Email address</label>
        </div>

       
        <div className="form-outline mb-4">
          <input type="password" name="password" className="form-control" />
          <label className="form-label">Password</label>
        </div>

      
        <button type="submit" className="btn btn-primary btn-block mb-4">
          Sign up
        </button>

        
        <div className="text-center">
          <p>Already have an account?  <Link to="/Login">Login</Link></p>
        
         
        </div>
      </form>
    </div>
  </div>
  </div>
  )
}

export default Register