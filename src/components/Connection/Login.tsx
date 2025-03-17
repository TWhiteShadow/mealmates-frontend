import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import logo from '../../assets/MealMatesLogo.png';
import { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    
      const response = await fetch("http://localhost:8000/api/v1/login_check'", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      localStorage.setItem("token", data.token);
    } 
  

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className='relative flex flex-col items-center space-y-4'>
        <img src={logo} alt='logo' className='w-[90vw] max-w-30 ' />
      </div>
      <h2 className="text-3xl font-bold text-center mb-4 font-['Lilita_One']">
        Connectez vous
      </h2>
      <form className="flex flex-col space-y-4 w-[500px] max-w-[90vw]" onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Mail"
          className="w-full p-3 bg-gray-300 rounded-lg"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          className="w-full p-3 bg-gray-300 rounded-lg"
          value={formData.password}
          onChange={handleChange}
        />
        <button className={cn(buttonVariants({ variant: 'default' }), 'w-full') }>

          Valider

        </button>
      </form>
      <div className="text-center mt-4 text-sm font-bold flex ">
        <a href="../login/register" className="text-purple-400 ">Créez un compte.</a>
        <a href="../login/register">mot de pass oublié</a>

      </div>
    </div>
  );
};

export default Login;