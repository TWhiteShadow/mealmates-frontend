import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

const Register = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 ">
      <h2 className="text-3xl font-bold text-center mb-4 font-['Lilita_One']">
        Créez votre compte
      </h2>
      <form className="flex flex-col space-y-4 w-[500px] max-w-[90vw]">
        <div className="flex space-x-4">
          <input
            type="text"
            name="lastname"
            placeholder="Nom"
            className="w-1/2 p-3 bg-gray-300 rounded-lg"
          />
          <input
            type="text"
            name="firstname"
            placeholder="Prénom"
            className="w-1/2 p-3 bg-gray-300 rounded-lg"
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Mail"
          className="w-full p-3 bg-gray-300 rounded-lg"
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          className="w-full p-3 bg-gray-300 rounded-lg"
        />
        <button className={cn(buttonVariants({ variant: 'default' }), 'w-full')}>

          Valider

        </button>
      </form>
      <div className="text-center mt-4 text-purple-400 text-sm font-bold">
        <a href="/app/login/login">Vous avez déjà un compte ? Se connecter</a>
      </div>
    </div>
  );
};

export default Register;