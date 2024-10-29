import { Fragment, useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./Button.jsx";
import { Container } from "./Container.jsx";
import NEWLOGO from '/assets/logo/wq2.png'
import {
  LECTURE_LIST_COMPONENT,
  LOGIN_COMPONENT,
  QR_CODE_COMPONENT,
  REGISTRATION_COMPONENT,
  AUTH_MANAGEMENT_COMPONENT,
} from "../../constants/component_constants.js";
import { ADMIN } from "../../constants/user_role.js";
import { USER_ROLE } from "../../constants/localstorage_constants.js";
import LogoutLink from "../../pages/auth/component/LogoutLink.jsx";

const LinkData = [
  { href: REGISTRATION_COMPONENT, menuName: "강의등록", adminOnly: true },
  { href: LECTURE_LIST_COMPONENT, menuName: "강의목록", adminOnly: true },
  { href: QR_CODE_COMPONENT, menuName: "강의 QR", adminOnly: true }
];

export function Header() {
  const [userRole, setUserRole]  = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem(USER_ROLE);
    if (role !== ADMIN) {
      navigate(LOGIN_COMPONENT);
    }
    setUserRole(role);
  }, []);

  return (
    <header className="py-10">
      <Container>
        <nav className="relative z-40 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <LogoLink href="/" aria-label="Home">
              <img src={NEWLOGO} className="w-40"></img>
            </LogoLink>
            <div className="flex gap-x-6 sm:hidden">
              {LinkData.map((data, index) => (
                <NavLink key={index} href={data.href}>
                  {data.menuName}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-x-5">
            <div className="block sm:hidden">
              <LogoutLink>로그아웃</LogoutLink>
            </div>
            {userRole === ADMIN && (
              <Link to={AUTH_MANAGEMENT_COMPONENT}>
                <Button color="blue">
                  <span>계정관리</span>
                </Button>
              </Link>
            )}
            <div className="hidden mr-1 sm:block">
              <MobileNavigation />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}

function MobileNavigation() {
  const userRole = localStorage.getItem(USER_ROLE);

  const MobileNavIcon = ({ open }) => {return (
      <svg
        aria-hidden="true"
        className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
        fill="none"
        strokeWidth={2}
        strokeLinecap="round">
        <path
          d="M0 1H14M0 7H14M0 13H14"
          className={clsx(
            "origin-center transition",
            open && "scale-90 opacity-0"
          )}/>
        <path
          d="M2 2L12 12M12 2L2 12"
          className={clsx(
            "origin-center transition",
            !open && "scale-90 opacity-0"
          )}/>
      </svg>
      )}

  return (
    <Popover>
      <Popover.Button
        className="relative z-10 flex h-8 w-8 items-center justify-center ui-not-focus-visible:outline-none"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
          >
            {LinkData.map(
              (data, index) =>
                (!data.adminOnly ||
                  (data.adminOnly && userRole === ADMIN)) && (
                  <NavLink key={index} href={data.href}>
                    {data.menuName}
                  </NavLink>
                )
            )}
            <hr className="m-2 border-slate-300/40" />
            <LogoutLink>로그아웃</LogoutLink>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
}


function LogoLink({ href, children }) {
  return (
    <Link
      to={href}
      className="inline-block px-2 py-1 text-sm text-slate-700 rounded-3xl hover:bg-slate-100 hover:text-slate-900"
    >
      {children}
    </Link>
  )
}

function NavLink({ href, children }) {
  return (
    <Popover>
      <Popover.Button as="div" className="block w-full p-2 rounded-lg hover:bg-slate-100">
        <Link className="block w-full" to={href}>{children}</Link>
      </Popover.Button>
    </Popover>
  );
}

