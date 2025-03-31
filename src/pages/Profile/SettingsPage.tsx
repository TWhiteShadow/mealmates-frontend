import ProfileAppBar from '@/components/ProfileAppBar';
import {
  AddCircleOutline,
  ArrowBackIosOutlined,
  Home,
  Mail,
  Person,
  Delete,
} from '@mui/icons-material';
import { Avatar } from '@mui/material';
import AccordionItem from '@/components/AccordionItem';
import { useState } from 'react';

type Address = {
  id: string;
  address: string | null;
  city: string | null;
  region: string | null;
  zipCode: string | null;
  isEditing?: boolean;
};

const formatAddressTitle = (address: Address | null): string => {
  if (!address) {
    return 'Nouvelle adresse';
  }

  const parts: string[] = [];

  if (address.address) {
    parts.push(address.address);
  }
  if (address.city) {
    parts.push(address.city);
  }
  if (address.zipCode) {
    parts.push(address.zipCode);
  }
  if (address.region) {
    parts.push(address.region);
  }

  return parts.length > 0 ? parts.join(', ') : 'Nouvelle adresse';
};

const SettingsPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      address: '30 rue de Meaux',
      city: 'Senlis',
      region: 'Hauts-de-France',
      zipCode: '60300',
      isEditing: false,
    },
  ]);
  
  const [newAddress, setNewAddress] = useState<Address | null>(null);

  const addNewAddress = () => {
    const emptyAddress: Address = {
      id: Date.now().toString(),
      address: null,
      city: null,
      region: null,
      zipCode: null,
      isEditing: true,
    };
    setNewAddress(emptyAddress);
  };

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!newAddress) 
    {
      return;
    }

    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setAddresses(addresses.map(addr => {
      if (addr.id === id) 
      {
        return {
          ...addr,
          [e.target.name]: e.target.value,
        };
      }
      return addr;
    }));
  };

  const saveNewAddress = () => {
    if (!newAddress) 
    {
      return;
    }
    
    setAddresses([...addresses, { ...newAddress, isEditing: false }]);
    setNewAddress(null);
  };

  const cancelNewAddress = () => {
    setNewAddress(null);
  };

  const toggleEditMode = (id: string) => {
    setAddresses(addresses.map(addr => {
      if (addr.id === id) 
      {
        return {
          ...addr,
          isEditing: !addr.isEditing,
        };
      }
      return addr;
    }));
  };

  const saveExistingAddress = (id: string) => {
    setAddresses(addresses.map(addr => {
      if (addr.id === id) 
      {
        return {
          ...addr,
          isEditing: false,
        };
      }
      return addr;
    }));
  };

  const deleteAddress = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  return (
    <div className='h-screen relative bg-gray-100 overflow-x-hidden'>
      <ProfileAppBar>
        <div className='relative flex items-center w-full h-full justify-center'>
          <button
            className='absolute left-3'
            onClick={() => window.history.back()}
          >
            <ArrowBackIosOutlined
              sx={{ fontSize: 28 }}
              className='!text-purple-dark'
            />
          </button>
          <span className='text-lg font-Lilita font-bold text-purple-dark'>
            Votre compte
          </span>
        </div>
      </ProfileAppBar>
      <div className='max-w-md mx-auto px-4 pb-20'>
        <div className='max-w-xl m-auto'>
          <Avatar
            src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
            alt='Profile'
            sx={{ width: 100, height: 100 }}
            className='my-7 mx-auto drop-shadow-lg'
          />
        </div>
        <section className='my-8'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold'>Informations personnelles</h2>
          </div>
          <div>
            <AccordionItem
              title='Nom et prénom'
              icon={
                <Person
                  sx={{ width: 24, height: 24 }}
                  className='!text-purple-dark !bg-transparent'
                />
              }
            >
              <label
                htmlFor='lastname'
                className='block text-sm font-medium text-gray-700'
              >
                Nom
              </label>
              <input
                type='text'
                name='lastname'
                id='lastname'
                className='mt-1 py-2 px-2 block w-full h-11 element-base focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
              <label
                htmlFor='firstname'
                className='block text-sm font-medium text-gray-700 mt-4'
              >
                Prénom
              </label>
              <input
                type='text'
                name='firstname'
                id='firstname'
                className='mt-1 block w-full h-11 element-base focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </AccordionItem>
          </div>
          <div>
            <AccordionItem
              title='Adresse mail'
              required={true}
              icon={
                <Mail
                  sx={{ width: 24, height: 24 }}
                  className='!text-purple-dark !bg-transparent'
                />
              }
            >
              <input
                type='email'
                name='email'
                id='email'
                placeholder='azerty@gmail.com'
                className='mt-1 py-2 px-2 block w-full h-11 element-base focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </AccordionItem>
          </div>
          <div>
            <AccordionItem
              title='Adresses'
              required={true}
              icon={
                <Home
                  sx={{ width: 24, height: 24 }}
                  className='!text-purple-dark !bg-transparent'
                />
              }
            >
              {addresses.map((address) => (
                <AccordionItem 
                  key={address.id} 
                  title={formatAddressTitle(address)}
                  actions={
                    <button 
                      onClick={() => {
                        deleteAddress(address.id);
                      }}
                      className="text-red-500"
                    >
                      <Delete sx={{ fontSize: 20 }} />
                    </button>
                  }
                >
                  <div className='flex justify-between gap-4'>
                    <input
                      type='text'
                      name='address'
                      value={address.address || ''}
                      onChange={(e) => handleAddressChange(address.id, e)}
                      placeholder='30 rue de Meaux'
                      className='mt-1 py-2 px-2 block w-full h-11 element-base focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    />
                    <input
                      type='text'
                      name='city'
                      value={address.city || ''}
                      onChange={(e) => handleAddressChange(address.id, e)}
                      placeholder='Senlis'
                      className='mt-1 py-2 px-2 block w-full h-11 element-base focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    />
                  </div>
                  <div className='flex justify-between gap-4 mt-2'>
                    <input
                      type='text'
                      name='region'
                      value={address.region || ''}
                      onChange={(e) => handleAddressChange(address.id, e)}
                      placeholder='Hauts-de-France'
                      className='mt-1 py-2 px-2 block w-full h-11 element-base focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    />
                    <input
                      type='text'
                      name='zipCode'
                      value={address.zipCode || ''}
                      onChange={(e) => handleAddressChange(address.id, e)}
                      placeholder='60300'
                      className='mt-1 py-2 px-2 block w-full h-11 element-base focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    />
                  </div>
                  {address.isEditing && (
                    <div className="flex justify-end space-x-2 mt-4">
                      <button 
                        onClick={() => toggleEditMode(address.id)} 
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                      >
                        Annuler
                      </button>
                      <button 
                        onClick={() => saveExistingAddress(address.id)} 
                        className="px-4 py-2 bg-purple-dark text-white rounded-md"
                      >
                        Enregistrer
                      </button>
                    </div>
                  )}
                </AccordionItem>
              ))}

              {newAddress && (
                <AccordionItem title={formatAddressTitle(newAddress)}>
                  <div className='flex justify-between gap-4'>
                    <input
                      type='text'
                      name='address'
                      value={newAddress.address || ''}
                      onChange={handleNewAddressChange}
                      placeholder='30 rue de Meaux'
                      className='mt-1 py-2 px-2 block w-full h-11 element-base focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    />
                    <input
                      type='text'
                      name='city'
                      value={newAddress.city || ''}
                      onChange={handleNewAddressChange}
                      placeholder='Senlis'
                      className='mt-1 py-2 px-2 block w-full h-11 element-base focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    />
                  </div>
                  <div className='flex justify-between gap-4 mt-2'>
                    <input
                      type='text'
                      name='region'
                      value={newAddress.region || ''}
                      onChange={handleNewAddressChange}
                      placeholder='Hauts-de-France'
                      className='mt-1 py-2 px-2 block w-full h-11 element-base focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    />
                    <input
                      type='text'
                      name='zipCode'
                      value={newAddress.zipCode || ''}
                      onChange={handleNewAddressChange}
                      placeholder='60300'
                      className='mt-1 py-2 px-2 block w-full h-11 element-base focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                    />
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button 
                      onClick={cancelNewAddress} 
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                    >
                      Annuler
                    </button>
                    <button 
                      onClick={saveNewAddress} 
                      className="px-4 py-2 bg-purple-dark text-white rounded-md"
                    >
                      Enregistrer
                    </button>
                  </div>
                </AccordionItem>
              )}

              <button
                onClick={addNewAddress}
                disabled={!!newAddress}
                className={`w-full bg-purple-dark text-white hover:bg-white hover:outline-2 hover:outline-purple-dark group py-2 px-6 rounded-lg shadow-lg flex items-center justify-center ${
                  newAddress ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <AddCircleOutline
                  sx={{ fontSize: '2rem' }}
                  className='group-hover:text-purple-dark'
                />
              </button>
            </AccordionItem>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
