import ProfileAppBar from "@/components/ProfileAppBar";
import { ArrowBackIosOutlined, Mail, Person } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import AccordionItem from "@/components/AccordionItem";

const SettingsPage = () => {

  return (
    <div className="h-screen relative bg-gray-100 overflow-hidden">
        <ProfileAppBar>
            <div className="relative flex items-center w-full h-full justify-center">
              <button className="absolute left-3" onClick={() => window.history.back()}>
                <ArrowBackIosOutlined sx={{ fontSize: 28 }} className='!text-purple-dark'/>
              </button>
              <span className="text-lg font-Lilita font-bold text-purple-dark">Votre compte</span>
            </div>
        </ProfileAppBar>
        <div className="max-w-md mx-auto px-4 pb-20">
            <div className="max-w-xl m-auto">
              <Avatar
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                  sx={{ width: 100, height: 100 }}
                  className="my-7 mx-auto drop-shadow-lg"
              />
            </div>
            <section className="my-8">
              <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Informations personnelles</h2>
              </div>
              <div>
                <AccordionItem title="Nom et prénom" icon={<Person sx={{ width: 24, height: 24 }} className="!text-purple-dark !bg-transparent" />}>
                  <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Nom</label>
                  <input type="text" name="lastname" id="lastname" className="mt-1 py-2 px-2 block w-full h-11 bg-neutral-100 border-gray-400 rounded-md shadow-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mt-4">Prénom</label>
                  <input type="text" name="firstname" id="firstname" className="mt-1 block w-full h-11 bg-neutral-100 border-gray-400 rounded-md shadow-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </AccordionItem>
              </div>
              <div>
                <AccordionItem title="Adresse mail" required={true} icon={<Mail sx={{ width: 24, height: 24 }} className="!text-purple-dark !bg-transparent" />}>
                  <input type="email" name="email" id="email" placeholder="azerty@gmail.com" className="mt-1 py-2 px-2 block w-full h-11 bg-neutral-100 border-gray-400 rounded-md shadow-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </AccordionItem>
              </div>
            </section>
        </div>
    </div>
);
};

export default SettingsPage;
