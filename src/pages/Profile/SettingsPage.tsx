import { useState, useEffect } from 'react';
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
import {
  useUpdateUserDataMutation,
  useUserData,
  ApiErrorResponse,
  useDeleteAddressMutation,
  Address
} from "@/api/User";
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from "sonner";
import AddressInput from '@/components/AddressInput';

interface AddressWithEditing extends Address {
  isEditing?: boolean;
}

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
  const [addresses, setAddresses] = useState<AddressWithEditing[]>([]);
  const [newAddress, setNewAddress] = useState<AddressWithEditing | null>(null);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  const { isLoading, data: userData } = useUserData();
  const updateUserMutation = useUpdateUserDataMutation();
  const deleteAddressMutation = useDeleteAddressMutation();

  // Initialize form data from userData when it loads
  useEffect(() => {
    if (userData) {
      setFirstName(userData.first_name || '');
      setLastName(userData.last_name || '');
      if (userData.address) {
        setAddresses(userData.address.map(addr => ({
          ...addr,
          isEditing: false
        })));
      }
    }
  }, [userData]);

  const addNewAddress = () => {
    const emptyAddress: AddressWithEditing = {
      id: 0,
      address: '',
      city: '',
      region: '',
      zipCode: '',
      latitude: 0,
      longitude: 0,
      isEditing: true,
    };
    setNewAddress(emptyAddress);
  };

  const validateAddress = (address: Address): boolean => {
    if (!address.address || !address.city || !address.zipCode || !address.region) {
      toast.error("Tous les champs d'adresse sont obligatoires");
      return false;
    }
    return true;
  };

  const cancelNewAddress = () => {
    setNewAddress(null);
  };

  const saveNewAddress = () => {
    if (!newAddress) return;
    if (!validateAddress(newAddress)) return;

    // Add new address to local state
    const addressToAdd = { ...newAddress, isEditing: false };
    setAddresses([...addresses, addressToAdd]);
    setNewAddress(null);
  };

  const deleteAddress = (id: number) => {
    // If it's a new unsaved address with temporary ID
    if (id === 0) {
      setAddresses(addresses.filter(addr => addr.id !== id));
      return;
    }

    // Otherwise delete on server
    deleteAddressMutation.mutate(id, {
      onSuccess: () => {
        setAddresses(addresses.filter(addr => addr.id !== id));
        toast.success('Adresse supprimée avec succès');
      },
      onError: (error) => {
        handleApiError(error, 'adresse');
      }
    });
  };

  const handleApiError = (error: unknown, context: string) => {
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
      console.error(`Error updating ${context}:`, error);
      toast.error(`Une erreur est survenue lors de la mise à jour de vos ${context}`);
    }
  };

  const onAddressSelect = (address: Address) => {
    if (newAddress) {
      setNewAddress({
        ...newAddress,
        ...address,
      });
    } else {
      setAddresses(addresses.map(addr => {
        if (addr.isEditing) {
          return {
            ...addr,
            ...address,
          };
        }
        return addr;
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    if (!userData) return;

    const updatedUserData = {
      ...userData,
      last_name: lastName,
      first_name: firstName,
      address: addresses.map(addr => {
        const addressData = { ...addr };
        delete addressData.isEditing;
        return addressData;
      }),
      allergen: userData?.allergen || []
    };

    if (updatedUserData && Object.keys(updatedUserData).length > 0) {
      updateUserMutation.mutate(updatedUserData, {
        onSuccess: (data) => {
          setFieldErrors({});
          if (data.success === true) {
            toast.success(data.message);
          } else {
            toast.error(data.message);
          }
        },
        onError: (error: unknown) => {
          handleApiError(error, 'informations');
        },
      });
    } else {
      toast.info('Aucune modification détectée');
    }
  };

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
            {isLoading ? (
              <Skeleton className="h-6 w-32 mx-auto" />
            ) : (
              `${userData?.last_name} ${userData?.first_name}`
            )}
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
                      type="text"
                      name="lastname"
                      id="lastname"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Dupont"
                      className="h-11"
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
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jean"
                      className="h-11"
                    />
                    {fieldErrors.firstname && (
                      <p className="mt-1 text-red-600 text-sm">{fieldErrors.firstname}</p>
                    )}
                  </div>
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
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : (
                  <Accordion type="multiple" className="w-full">
                    {addresses.map((address) => (
                      <AccordionItem key={address.id} value={address.id.toString()} className="border rounded-lg mb-2 shadow-sm">
                        <div className="flex items-center justify-between px-4 py-3 hover:bg-purple-50 transition-colors duration-200">
                          <AccordionTrigger className="flex-1">
                            <span className="font-medium">{formatAddressTitle(address)}</span>
                          </AccordionTrigger>
                          <Button
                            variant="ghost"
                            onClick={(e) => {
                              e.preventDefault(); // Add this to prevent form submission
                              e.stopPropagation();
                              deleteAddress(address.id);
                            }}
                            data-id={address.id}
                            className="text-red-500 p-1 hover:bg-red-50 hover:text-red-800"
                          >
                            <Delete sx={{ fontSize: 20 }} />
                          </Button>
                        </div>
                        <AccordionContent className="px-4 pb-4 pt-2">
                          <AddressInput placeholder={""} onSelect={onAddressSelect} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}

                    {newAddress && (
                      <AccordionItem value="new-address" className="border rounded-lg mb-2 shadow-sm">
                        <AccordionTrigger className="px-4 py-3 hover:bg-purple-50 transition-colors duration-200">
                          <span className="font-medium">{formatAddressTitle(newAddress)}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-2">
                          <AddressInput placeholder={""} onSelect={onAddressSelect} />
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                )}


                {!newAddress && (
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
                )}

                {newAddress && (
                  <div className="flex justify-end mt-4">
                    <Button
                      onClick={cancelNewAddress}
                      className="bg-gray-300 hover:bg-gray-400 w-1/2 flex-1/2"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={saveNewAddress}
                      className="bg-purple-dark hover:bg-purple-dark/90 flex-1/2 ml-2"
                    >
                      Enregistrer
                    </Button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              type='submit'
              className="bg-purple-dark hover:bg-purple-dark/90"
            >
              Enregistrer
            </Button>
          </div>
        </section>
      </div>
    </form>
  );
};

export default SettingsPage;