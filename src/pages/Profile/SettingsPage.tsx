import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import UserAvatar from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProfileAppBar from '@/components/ProfileAppBar';
import {
  useUpdateUserDataMutation,
  useUserData,
  ApiErrorResponse,
  useDeleteAddressMutation,
  Address,
} from '@/api/User';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import AddressInput from '@/components/AddressInput';
import { ChevronLeft, LogOut } from 'lucide-react';
import { useAuth } from '@/utils/auth';
import {
  AddCircleOutline,
  Home,
  Person,
  Delete,
  RestaurantMenu,
  NoFood,
} from '@mui/icons-material';

import { useAllergens } from '@/api/Allergen';
import { useFoodPreferences } from '@/api/FoodPreference';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MultiSelect, Option } from '@/components/ui/multi-select';
import { useNavigate, useSearchParams } from 'react-router';

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
  const [selectedAllergens, setSelectedAllergens] = useState<number[]>([]);
  const [selectedFoodPreferences, setSelectedFoodPreferences] = useState<
    number[]
  >([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { isLoading, data: userData } = useUserData();
  const updateUserMutation = useUpdateUserDataMutation();
  const deleteAddressMutation = useDeleteAddressMutation();
  const { data: allergens } = useAllergens();
  const { data: foodPreferences } = useFoodPreferences();

  const [redirectURI, setRedirectURI] = useState<string | null>(null);

  // Initialize form data from userData when it loads
  useEffect(() => {
    if (userData) {
      setFirstName(userData.first_name || '');
      setLastName(userData.last_name || '');
      if (userData.address) {
        setAddresses(
          userData.address.map((addr) => ({
            ...addr,
            isEditing: false,
          }))
        );
      }
      if (userData.allergen) {
        setSelectedAllergens(userData.allergen.map((a) => a.id));
      }

      if (userData.foodPreference) {
        setSelectedFoodPreferences(
          userData.foodPreference.map((fp) => fp.id)
        );
      }
    }
  }, [userData]);

  useEffect(() => {
    const redirectURI = searchParams.get('redirectURI');
    if (redirectURI) {
      setRedirectURI(redirectURI);
    }
  }, [searchParams]);

  const addNewAddress = () => {
    const emptyAddress: AddressWithEditing = {
      id: null,
      address: '',
      city: '',
      region: '',
      zipCode: '',
      latitude: null,
      longitude: null,
      isEditing: true,
    };
    setNewAddress(emptyAddress);
  };

  const validateAddress = (address: Address): boolean => {
    if (
      !address.address ||
      !address.city ||
      !address.zipCode ||
      !address.region
    ) {
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

    // Add new address to local state without an id
    const addressToAdd: AddressWithEditing = {
      ...newAddress,
      id: null,
      isEditing: false,
    };
    setAddresses([...addresses, addressToAdd]);
    setNewAddress(null);
  };

  const deleteAddress = async (id: number | null) => {
    if (id === null) {
      setAddresses(addresses.filter((addr) => addr.id !== null));
      return;
    }

    // Otherwise delete on server
    deleteAddressMutation.mutate(id, {
      onSuccess: () => {
        setAddresses(addresses.filter((addr) => addr.id !== id));
      },
      onError: (error) => {
        handleApiError(error, 'adresse');
      },
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
      toast.error(
        `Une erreur est survenue lors de la mise à jour de vos ${context}`
      );
    }
  };

  const onAddressSelect = (address: Address) => {
    if (newAddress) {
      setNewAddress({
        ...newAddress,
        ...address,
      });
    } else {
      setAddresses(
        addresses.map((addr) => {
          if (addr.isEditing) {
            return {
              ...addr,
              ...address,
            };
          }
          return addr;
        })
      );
    }
  };

  const { logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    if (!userData) return;

    const processedAddresses = addresses.map((addr) => {
      const addressData = { ...addr } as Address;
      delete (addressData as any).isEditing;
      // For new addresses, make sure id is null not undefined
      if (addressData.id === undefined) addressData.id = null;
      return addressData;
    });

    const updatedUserData = {
      first_name: firstName,
      last_name: lastName,
      addresses: processedAddresses,
      allergenIds: selectedAllergens,
      foodPreferenceIds: selectedFoodPreferences,
    };

    updateUserMutation.mutate(updatedUserData as any, {
      onSuccess: () => {
        setFieldErrors({});
        if (redirectURI) {
          navigate(redirectURI, { replace: true });
        }
      },
      onError: (error: unknown) => {
        handleApiError(error, 'informations');
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='h-screen relative bg-gray-100 overflow-x-hidden pb-20'
    >
      <ProfileAppBar>
        <div className='relative flex items-center size-full justify-center'>
          <Button
            type='button'
            variant='ghost'
            className='absolute left-3 p-1'
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className='size-8 text-purple-dark' />
          </Button>
          <span className='text-lg font-Lilita font-bold text-purple-dark'>
            Votre compte
          </span>
          <Button
            type='button'
            variant='ghost'
            className='absolute right-3 p-1'
            onClick={handleLogout}
          >
            <LogOut className='!text-purple-dark !h-7 !w-7' />
          </Button>
        </div>
      </ProfileAppBar>
      <div className='max-w-md mx-auto px-4'>
        <div className='max-w-xl m-auto'>
          <UserAvatar
            user={userData}
            size='xl'
            className='my-7 mx-auto drop-shadow-lg'
          />
          <span className='font-semibold text-lg text-purple-dark mx-auto block text-center'>
            {isLoading ? (
              <Skeleton className='h-6 w-32 mx-auto' />
            ) : (
              `${userData?.last_name} ${userData?.first_name}`
            )}
          </span>
        </div>
        <section className='my-8'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold'>Informations personnelles</h2>
          </div>
          <Accordion type='multiple' className='w-full'>
            <AccordionItem
              value='name'
              className='border rounded-lg mb-4 shadow-sm bg-white'
            >
              <AccordionTrigger className='px-4 py-3 hover:bg-purple-50 transition-colors duration-200'>
                <div className='flex items-center'>
                  <Person
                    sx={{ width: 24, height: 24 }}
                    className='!text-purple-dark !bg-transparent mr-2'
                  />
                  <span className='font-medium'>Nom et prénom</span>
                  {isLoading ? (
                    <Skeleton className='h-4 w-[150px] ml-2' />
                  ) : (
                    <span className='text-gray-500 text-sm ml-2'>
                      {userData?.last_name} {userData?.first_name}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className='px-4 pb-4 pt-2'>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <label
                      htmlFor='lastname'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Nom <span className='text-red-500'>*</span>
                    </label>
                    <Input
                      type='text'
                      name='lastname'
                      id='lastname'
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder='Dupont'
                      className='h-11'
                    />
                    {fieldErrors.lastname && (
                      <p className='mt-1 text-red-600 text-sm'>
                        {fieldErrors.lastname}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <label
                      htmlFor='firstname'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Prénom <span className='text-red-500'>*</span>
                    </label>
                    <Input
                      type='text'
                      name='firstname'
                      id='firstname'
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder='Jean'
                      className='h-11'
                    />
                    {fieldErrors.firstname && (
                      <p className='mt-1 text-red-600 text-sm'>
                        {fieldErrors.firstname}
                      </p>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value='addresses'
              className='border rounded-lg mb-4 shadow-sm bg-white'
            >
              <AccordionTrigger className='px-4 py-3 hover:bg-purple-50 transition-colors duration-200'>
                <div className='flex items-center'>
                  <Home
                    sx={{ width: 24, height: 24 }}
                    className='!text-purple-dark !bg-transparent mr-2'
                  />
                  <span className='font-medium'>
                    Adresses <span className='text-red-500'>*</span>
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className='px-4 pb-4 pt-2'>
                {isLoading ? (
                  <div className='space-y-2'>
                    <Skeleton className='h-16 w-full' />
                    <Skeleton className='h-16 w-full' />
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {/* Existing addresses */}
                    {addresses.map((address) => (
                      <div
                        key={address.id?.toString() || `new-${Math.random()}`}
                        className='flex items-center justify-between px-4 py-3 border rounded-lg shadow-sm bg-white hover:bg-purple-50 transition-colors duration-200'
                      >
                        <span className='font-medium'>
                          {formatAddressTitle(address)}
                        </span>
                        <Button
                          variant='ghost'
                          onClick={(e) => {
                            e.preventDefault();
                            deleteAddress(address.id || null);
                          }}
                          className='text-red-500 p-1 hover:bg-red-50 hover:text-red-800'
                        >
                          <Delete sx={{ fontSize: 20 }} />
                        </Button>
                      </div>
                    ))}

                    {/* New address accordion */}
                    {newAddress && (
                      <Accordion type='single' className='w-full'>
                        <AccordionItem
                          value='new-address'
                          className='border rounded-lg shadow-sm'
                        >
                          <AccordionTrigger className='px-4 py-3 hover:bg-purple-50 transition-colors duration-200'>
                            <span className='font-medium'>
                              {formatAddressTitle(newAddress)}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className='px-4 pb-4 pt-2'>
                            <AddressInput
                              placeholder={''}
                              onSelect={onAddressSelect}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}

                    {!newAddress && (
                      <Button
                        onClick={addNewAddress}
                        disabled={!!newAddress}
                        className={`w-full bg-purple-dark text-white hover:bg-white hover:text-purple-dark hover:border-2 hover:border-purple-dark group py-2 px-6 ${newAddress ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <AddCircleOutline
                          sx={{ fontSize: '2rem' }}
                          className='group-hover:text-purple-dark'
                        />
                      </Button>
                    )}

                    {newAddress && (
                      <div className='flex justify-end'>
                        <Button
                          onClick={cancelNewAddress}
                          className='bg-gray-300 hover:bg-gray-400 w-1/2 flex-1/2'
                        >
                          Annuler
                        </Button>
                        <Button
                          onClick={saveNewAddress}
                          className='bg-purple-dark hover:bg-purple-dark/90 flex-1/2 ml-2'
                        >
                          Enregistrer
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value='preferences'
              className='border rounded-lg mb-4 shadow-sm bg-white'
            >
              <AccordionTrigger className='px-4 py-3 hover:bg-purple-50 transition-colors duration-200'>
                <div className='flex items-center'>
                  <RestaurantMenu
                    sx={{ width: 24, height: 24 }}
                    className='!text-purple-dark !bg-transparent mr-2'
                  />
                  <span className='font-medium'>Préférences alimentaires</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className='px-4 pb-4 pt-2'>
                <div className='space-y-4'>
                  {isLoading ? (
                    <Skeleton className='h-10 w-full' />
                  ) : (
                    <MultiSelect
                      options={
                        foodPreferences?.map((foodPref) => ({
                          id: foodPref.id,
                          label: foodPref.name,
                          value: foodPref.id,
                        })) || []
                      }
                      selected={
                        foodPreferences
                          ?.filter((foodPref) =>
                            selectedFoodPreferences.includes(foodPref.id)
                          )
                          .map((foodPref) => ({
                            id: foodPref.id,
                            label: foodPref.name,
                            value: foodPref.id,
                          })) || []
                      }
                      onChange={(selected: Option[]) => {
                        setSelectedFoodPreferences(
                          selected.map((item) => item.id)
                        );
                      }}
                      placeholder='Vos préférences alimentaires...'
                      className='border-gray-300'
                    />
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value='allergens'
              className='border rounded-lg mb-4 shadow-sm bg-white'
            >
              <AccordionTrigger className='px-4 py-3 hover:bg-purple-50 transition-colors duration-200'>
                <div className='flex items-center'>
                  <NoFood
                    sx={{ width: 24, height: 24 }}
                    className='!text-purple-dark !bg-transparent mr-2'
                  />
                  <span className='font-medium'>Allergènes</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className='px-4 pb-4 pt-2'>
                <div className='space-y-4'>
                  {isLoading ? (
                    <Skeleton className='h-10 w-full' />
                  ) : (
                    <MultiSelect
                      options={
                        allergens?.map((allergen) => ({
                          id: allergen.id,
                          label: allergen.name,
                          value: allergen.id,
                        })) || []
                      }
                      selected={
                        allergens
                          ?.filter((allergen) =>
                            selectedAllergens.includes(allergen.id)
                          )
                          .map((allergen) => ({
                            id: allergen.id,
                            label: allergen.name,
                            value: allergen.id,
                          })) || []
                      }
                      onChange={(selected: Option[]) => {
                        setSelectedAllergens(selected.map((item) => item.id));
                      }}
                      placeholder='Sélectionner des allergènes...'
                      className='border-gray-300'
                    />
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className='flex justify-end space-x-2 mt-4'>
            <Button
              type='submit'
              className='bg-purple-dark hover:bg-purple-dark/90'
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
