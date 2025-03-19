import { useState } from 'react';
import { registerUser } from '@/api/User';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';
import { useNavigate } from 'react-router';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await registerUser(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );
      setSuccess(
        'Inscription réussie. Vérifiez votre email pour valider votre compte.'
      );
      setTimeout(() => navigate('/app/login/login', { replace: true }), 2000);
    } catch (err) {
      console.error(err);
      setError("Échec de l'inscription. Vérifiez vos informations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <h2 className="text-3xl font-bold text-center mb-4 font-['Lilita_One']">
        Créez votre compte
      </h2>
      <form
        className='flex flex-col space-y-4 w-[500px] max-w-[90vw]'
        onSubmit={handleSubmit}
      >
        <div className='flex space-x-4'>
          <input
            type='text'
            name='lastName'
            placeholder='Nom'
            value={formData.lastName}
            onChange={handleChange}
            className='w-1/2 p-3 bg-gray-300 rounded-lg'
            required
          />
          <input
            type='text'
            name='firstName'
            placeholder='Prénom'
            value={formData.firstName}
            onChange={handleChange}
            className='w-1/2 p-3 bg-gray-300 rounded-lg'
            required
          />
        </div>
        <input
          type='email'
          name='email'
          placeholder='Mail'
          value={formData.email}
          onChange={handleChange}
          className='w-full p-3 bg-gray-300 rounded-lg'
          required
        />
        <input
          type='password'
          name='password'
          placeholder='Mot de passe'
          value={formData.password}
          onChange={handleChange}
          className='w-full p-3 bg-gray-300 rounded-lg'
          required
        />
        {error && <p className='text-red-500 text-center'>{error}</p>}
        {success && <p className='text-green-500 text-center'>{success}</p>}
        <button
          type='submit'
          className={cn(buttonVariants({ variant: 'default' }), 'w-full')}
          disabled={loading}
        >
          {loading ? 'Inscription...' : 'Valider'}
        </button>
      </form>
      <div className='text-center mt-4 text-purple-400 text-sm font-bold'>
        <a href='/app/login/login'>Vous avez déjà un compte ? Se connecter</a>
      </div>
    </div>
  );
};

export default Register;
