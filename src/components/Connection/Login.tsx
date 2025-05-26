import { useState } from 'react';
import { loginUser } from '@/api/User';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';
import logo from '@/assets/MealMatesLogo.webp';
import { useNavigate } from 'react-router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      localStorage.setItem('jwt_token', data.token);
      navigate('/app/discover', { replace: true });
    } catch (err) {
      console.error(err);
      setError('Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <div className='relative flex flex-col items-center space-y-4'>
        <img src={logo} alt='logo' className='w-[90vw] max-w-30' />
      </div>
      <h2 className="text-3xl font-bold text-center mb-4 font-['Lilita_One']">
        Connectez-vous
      </h2>
      <form
        className='flex flex-col space-y-4 w-[500px] max-w-[90vw]'
        onSubmit={handleSubmit}
      >
        <input
          type='email'
          name='email'
          placeholder='Mail'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full p-3 bg-gray-300 rounded-lg'
          required
        />
        <input
          type='password'
          name='password'
          placeholder='Mot de passe'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full p-3 bg-gray-300 rounded-lg'
          required
        />
        {error && <p className='text-red-500 text-center'>{error}</p>}
        <button
          type='submit'
          className={cn(buttonVariants({ variant: 'default' }), 'w-full')}
          disabled={loading}
        >
          {loading ? 'Connexion...' : 'Valider'}
        </button>
      </form>
      <div className='text-center mt-4 text-sm font-bold flex space-x-4'>
        <a href='../login/register' className='text-purple-400'>
          Créez un compte.
        </a>
        <a href='../login/register'>Mot de passe oublié</a>
      </div>
    </div>
  );
};

export default Login;
