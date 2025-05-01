import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { IoMdPower } from "react-icons/io";
import { useLocation } from "react-router-dom";
import useStore from "../../store/index";
import Modal from "../Modal";
import { useEffect, useState } from "react";
import api from "../../libs/apiCall";
import { FaUserCircle } from "react-icons/fa";

const navigation = [
  { name: "Dashboard", href: "/overview", current: true },
  { name: "Transaction", href: "/transactions", current: false },
  { name: "Account", href: "/account", current: false },
  // { name: "Settings", href: "/settings", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const { user, token, signOut, setCredentials } = useStore((state) => state);

  const [isOpen, setIsOpen] = useState(false);

  const [firstname, setFirstName] = useState(`${user.firstname}`);
  const [lastname, setLastName] = useState(`${user.lastname}`);
  const [contact, setContact] = useState(`${user.contact}`);
  const [updatedData, setupdatedData] = useState([]);

  const location = useLocation();

  const updateSubmit = async () => {
    try {
      const res = await api.put("/user/update", {
        firstname,
        lastname,
        contact,
      });
      setCredentials(res.data.user);

      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Disclosure as="nav" className="bg-white items-center  shadow-md/5">
      <div className="mx-auto max-w-full  sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center md:justify-between sm:justify-between px-5 ">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>
          <div className="hidden md:flex sm:flex shrink-0 items-center  align-middle ">
            <a href="/" className="">
              <h2 className="  font-bold text-3xl bg-sky-500 px-3.5 w-full  text-center text-white  shadow-sm/80 shadow-sky-600">
                exp.
              </h2>
            </a>
          </div>
          <div className="flex md:hidden sm:hidden shrink-0 justify-center w-full  items-center   ">
            <a href="/" className="">
              <h2 className="  font-bold text-3xl bg-sky-500 px-3.5 w-full  text-center text-white  shadow-sm/80 shadow-sky-600">
                exp.
              </h2>
            </a>
          </div>
          <div className="flex  items-center justify-between sm:items-stretch sm:justify-start">
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-5">
                {navigation.map((item) => {
                  let isActive = location.pathname === item.href;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={classNames(
                        isActive
                          ? "bg-sky-500 text-white"
                          : "text-gray-800 hover:bg-sky-200 hover:text-gray-700",
                        "rounded-4xl px-3 py-2 text-sm font-medium"
                      )}
                    >
                      {item.name}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex items-center justify-center size-9 rounded-full z-10 bg-gray-200 text-sm ring-2 ring-white ring-offset-2 hover:ring-offset-sky-600 focus:outline-hidden overflow-hidden">
                  <span className="sr-only">Open user menu</span>
                  <FaUserCircle className="text-sky-500" size={32} />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute  items-center inline-flex -right-2 -top-3  mt-2 w-auto origin-top-right rounded-full bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <a
                    onClick={() => {
                      setIsOpen(true);
                      console.log("isOpen: ", isOpen);
                    }}
                    className=" px-3 ml-2 py-2 text-sm font-medium whitespace-nowrap inline-flex  text-gray-700  data-focus:outline-hidden"
                  >
                    {`${user.firstname} ${user.lastname ? user.lastname : ""}`}
                  </a>
                </MenuItem>
                {/* <MenuItem>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                  >
                    Settings
                  </a>
                </MenuItem> */}
                <MenuItem>
                  <a
                    onClick={() => signOut()}
                    className=" px-3 py-2 mr-12 text-sm text-gray-700  data-focus:outline-hidden"
                  >
                    <IoMdPower
                      size={24}
                      className="bg-red-500/90  text-white rounded-full p-0.5 transition duration-400 ease-in-out hover:scale-115"
                    />
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <div>
          <div className="flex">
            <h2 className="text-3xl font-semibold mb-5 text-center w-full">
              Add Acount
            </h2>
          </div>

          <div className="flex flex-col md:flex-row  gap-4  ">
            <div className="flex flex-col my-2  ">
              <label className="font-medium mb-1">First Name</label>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-auto transition delay-100 duration-800 focus:scale-105 bg-gray-100  focus:bg-white text-gray-700  font-medium py-2 px-4 outline-2 outline-gray-300 shadow-md rounded  "
              />
            </div>

            <div className="flex flex-col my-2">
              <label className="font-medium mb-1">Last Name</label>
              <input
                onChange={(e) => setLastName(e.target.value)}
                value={lastname}
                type="text"
                className="w-auto transition delay-100 duration-800 focus:scale-105 bg-gray-100  focus:bg-white text-gray-700  font-medium py-2 px-4 outline-2 outline-gray-300 shadow-md rounded  "
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row  gap-4  ">
          <div className="flex flex-col my-2">
            <label className="font-medium mb-1">Email</label>
            <input
              disabled="true"
              placeholder={user.email}
              type="number"
              className="w-auto transition delay-100 duration-800 hover:scale-105 bg-gray-100  focus:bg-white text-gray-700  font-medium py-2 px-4 outline-2 outline-gray-300 shadow-md rounded  "
            />
          </div>

          <div className="flex flex-col my-2">
            <label className="font-medium mb-1">Contact</label>
            <input
              onChange={(e) => setContact(e.target.value)}
              value={contact}
              type="number"
              className="w-auto transition delay-100 duration-800 focus:scale-105 bg-gray-100  focus:bg-white text-gray-700  font-medium py-2 px-4 outline-2 outline-gray-300 shadow-md rounded  "
            />
          </div>
        </div>

        <button
          onClick={updateSubmit}
          className="my-5 w-full bg-sky-500  text-white text-center font-medium py-2 px-4  shadow-md rounded items-center hover:cursor-pointer "
        >
          Submit
        </button>
      </Modal>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-gray-200 text-gray-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
