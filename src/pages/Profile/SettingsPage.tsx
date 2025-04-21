import { useState } from 'react';
import { AxiosError } from 'axios';
import {
  AddCircleOutline,
  ArrowBackIosOutlined,
  Home,
  Person,
  Delete,
} from '@mui/icons-material';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import ProfileAppBar from '@/components/ProfileAppBar';
import { useUpdateUserDataMutation, useUserData, ApiErrorResponse } from "@/api/User";
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from "sonner"



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

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    if (!newAddress) {
      return;
    }

    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setAddresses(addresses.map(addr => {
      if (addr.id === id) {
        return {
          ...addr,
          [e.target.name]: e.target.value,
        };
      }
      return addr;
    }));
  };

  const saveNewAddress = () => {
    if (!newAddress) {
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
      if (addr.id === id) {
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
      if (addr.id === id) {
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

  const { isLoading, data: userData } = useUserData();

  const mutation = useUpdateUserDataMutation();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);

    const updatedUserData = {
      ...userData,
      last_name: formData.get('lastname') as string,
      first_name: formData.get('firstname') as string,
    };

    if (updatedUserData && Object.keys(updatedUserData).length > 0) {
      mutation.mutate(updatedUserData, {
        onSuccess: (data) => {
          setFieldErrors({});
          if (data.success === true) {
            toast.success(data.message);
          } else {
            toast.error(data.message);
          }
        },
        onError: (error: unknown) => {
          const axiosError = error as AxiosError<ApiErrorResponse>;
          const apiErrs = axiosError?.response?.data?.errors;
          if (apiErrs) {
            const formatted: Record<string, string> = {};
            Object.entries(apiErrs).forEach(([apiKey, msg]) => {
              const fieldName = apiKey.replace('_', '').toLowerCase();
              formatted[fieldName] = msg;
            });
            setFieldErrors(formatted);
          } else {
            console.error('Error updating user data:', error);
            toast.error('Une erreur est survenue lors de la mise à jour de vos informations');
          }
        },

      });
    } else {
      toast.info('Aucune modification détectée');
    }
  }

  return (
    <form onSubmit={handleSubmit} className='h-screen relative bg-gray-100 overflow-x-hidden'>
      <ProfileAppBar>
        <div className='relative flex items-center w-full h-full justify-center'>
          <Button
            type="button"
            variant="ghost"
            className='absolute left-3 p-1'
            onClick={() => window.history.back()}
          >
            <ArrowBackIosOutlined
              sx={{ fontSize: 28 }}
              className='!text-purple-dark'
            />
          </Button>
          <span className='text-lg font-Lilita font-bold text-purple-dark'>
            Votre compte
          </span>
        </div>
      </ProfileAppBar>
      <div className='max-w-md mx-auto px-4 pb-20'>
        <div className='max-w-xl m-auto'>
          <Avatar className='my-7 mx-auto w-24 h-24 drop-shadow-lg'>
            <AvatarImage
              src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
              alt="Profile"
            />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
          <span className='font-semibold text-lg text-purple-dark mx-auto block text-center'>

          </span>
        </div>
        <section className='my-8'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold'>Informations personnelles</h2>
          </div>
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="name" className="border rounded-lg mb-4 shadow-sm bg-white">
              <AccordionTrigger className="px-4 py-3 hover:bg-purple-50 transition-colors duration-200">
                <div className="flex items-center">
                  <Person
                    sx={{ width: 24, height: 24 }}
                    className='!text-purple-dark !bg-transparent mr-2'
                  />
                  <span className="font-medium">Nom et prénom</span>
                  {isLoading ? (
                    <Skeleton className="h-4 w-[150px] ml-2" />
                  ) : (
                    <span className="text-gray-500 text-sm ml-2">
                      {userData?.last_name} {userData?.first_name}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor='lastname'
                      className='block text-sm font-medium text-gray-700'
                    >

                      Nom <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type='text'
                      name='lastname'
                      id='lastname'
                      className='h-11'
                      defaultValue={userData?.last_name}
                      placeholder='Dupont'

                    />
                    {fieldErrors.lastname && (
                      <p className="mt-1 text-red-600 text-sm">{fieldErrors.lastname}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="firstname"
                      id="firstname"
                      defaultValue={userData?.first_name}
                      placeholder="Jean"
                      className="h-11"
                    />
                    {fieldErrors.firstname && (
                      <p className="mt-1 text-red-600 text-sm">{fieldErrors.firstname}</p>
                    )}
                  </div>

                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    type='submit'
                    className="bg-purple-dark hover:bg-purple-dark/90"
                  >
                    Enregistrer
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>


            <AccordionItem value="addresses" className="border rounded-lg mb-4 shadow-sm bg-white">
              <AccordionTrigger className="px-4 py-3 hover:bg-purple-50 transition-colors duration-200">
                <div className="flex items-center">
                  <Home
                    sx={{ width: 24, height: 24 }}
                    className='!text-purple-dark !bg-transparent mr-2'
                  />
                  <span className="font-medium">Adresses <span className="text-red-500">*</span></span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <Accordion type="multiple" className="w-full">
                  {addresses.map((address) => (
                    <AccordionItem key={address.id} value={address.id} className="border rounded-lg mb-2 shadow-sm">
                      <div className="flex items-center justify-between px-4 py-3 hover:bg-purple-50 transition-colors duration-200">
                        <AccordionTrigger className="flex-1">
                          <span className="font-medium">{formatAddressTitle(address)}</span>
                        </AccordionTrigger>
                        <Button
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAddress(address.id);
                          }}
                          className="text-red-500 p-1 hover:bg-red-50 hover:text-red-800"
                        >
                          <Delete sx={{ fontSize: 20 }} />
                        </Button>
                      </div>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <Input
                              type='text'
                              name='address'
                              value={address.address || ''}
                              onChange={(e) => handleAddressChange(address.id, e)}
                              placeholder='30 rue de Meaux'
                              className='h-11'
                            />
                          </div>
                          <div>
                            <Input
                              type='text'
                              name='city'
                              value={address.city || ''}
                              onChange={(e) => handleAddressChange(address.id, e)}
                              placeholder='Senlis'
                              className='h-11'
                            />
                          </div>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2'>
                          <div>
                            <Input
                              type='text'
                              name='region'
                              value={address.region || ''}
                              onChange={(e) => handleAddressChange(address.id, e)}
                              placeholder='Hauts-de-France'
                              className='h-11'
                            />
                          </div>
                          <div>
                            <Input
                              type='text'
                              name='zipCode'
                              value={address.zipCode || ''}
                              onChange={(e) => handleAddressChange(address.id, e)}
                              placeholder='60300'
                              className='h-11'
                            />
                          </div>
                        </div>
                        {address.isEditing && (
                          <div className="flex justify-end space-x-2 mt-4">
                            <Button
                              variant="outline"
                              onClick={() => toggleEditMode(address.id)}
                            >
                              Annuler
                            </Button>
                            <Button
                              onClick={() => saveExistingAddress(address.id)}
                              className="bg-purple-dark hover:bg-purple-dark/90"
                            >
                              Enregistrer
                            </Button>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}

                  {newAddress && (
                    <AccordionItem value="new-address" className="border rounded-lg mb-2 shadow-sm">
                      <AccordionTrigger className="px-4 py-3 hover:bg-purple-50 transition-colors duration-200">
                        <span className="font-medium">{formatAddressTitle(newAddress)}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <Input
                              type='text'
                              name='address'
                              value={newAddress.address || ''}
                              onChange={handleNewAddressChange}
                              placeholder='30 rue de Meaux'
                              className='h-11'
                            />
                          </div>
                          <div>
                            <Input
                              type='text'
                              name='city'
                              value={newAddress.city || ''}
                              onChange={handleNewAddressChange}
                              placeholder='Senlis'
                              className='h-11'
                            />
                          </div>
                        </div>
                        <div className='grid grid-cols-2 gap-4 mt-2'>
                          <div>
                            <Input
                              type='text'
                              name='region'
                              value={newAddress.region || ''}
                              onChange={handleNewAddressChange}
                              placeholder='Hauts-de-France'
                              className='h-11'
                            />
                          </div>
                          <div>
                            <Input
                              type='text'
                              name='zipCode'
                              value={newAddress.zipCode || ''}
                              onChange={handleNewAddressChange}
                              placeholder='60300'
                              className='h-11'
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button
                            variant="outline"
                            onClick={cancelNewAddress}
                          >
                            Annuler
                          </Button>
                          <Button
                            onClick={saveNewAddress}
                            className="bg-purple-dark hover:bg-purple-dark/90"
                          >
                            Enregistrer
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>

                <Button
                  onClick={addNewAddress}
                  disabled={!!newAddress}
                  className={`w-full bg-purple-dark text-white hover:bg-white hover:text-purple-dark hover:border-2 hover:border-purple-dark group py-2 px-6 mt-4 ${newAddress ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <AddCircleOutline
                    sx={{ fontSize: '2rem' }}
                    className='group-hover:text-purple-dark'
                  />
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </form>
  );
};

export default SettingsPage;