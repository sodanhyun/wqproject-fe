import { Fragment, useEffect } from "react";
import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./Button.jsx";
import { Container } from "./Container.jsx";
import NEWLOGO from '../../assets/wq2.png'
import {
  LECTURE_LIST_COMPONENT,
  LOGIN_COMPONENT,
  QR_CODE_COMPONENT,
  REGISTRATION_COMPONENT,
  AUTH_MANAGEMENT_COMPONENT,
} from "../../constants/component_constants.js";
import { ADMIN } from "../../constants/user_role.js";
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_ID, USER_ROLE } from "../../constants/localstorage_constants.js";

function MobileNavLink({ href, children }) {
  return (
    <Popover>
      <Popover.Button as="div" className="block w-full p-2">
        <Link to={href}>{children}</Link>
      </Popover.Button>
    </Popover>
  );
}

function MobileLogoutLink({ children }) {
  const navigate = useNavigate();

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(USER_ROLE);
    localStorage.removeItem(USER_ID);
    navigate(LOGIN_COMPONENT);
  };

  return (
    <a href="#" onClick={handleLogout} className="block w-full p-2">
      {children}
    </a>
  );
}

function MobileNavIcon({ open }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          "origin-center transition",
          open && "scale-90 opacity-0"
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          "origin-center transition",
          !open && "scale-90 opacity-0"
        )}
      />
    </svg>
  );
}

const LinkData = [
  { href: REGISTRATION_COMPONENT, menuName: "강의등록", adminOnly: true },
  { href: LECTURE_LIST_COMPONENT, menuName: "강의목록", adminOnly: true },
  { href: QR_CODE_COMPONENT, menuName: "강의 활성화", adminOnly: true }
];

function MobileNavigation() {
  const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN);
  const userRole = localStorage.getItem(USER_ROLE);

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
                  <MobileNavLink key={index} href={data.href}>
                    {data.menuName}
                  </MobileNavLink>
                )
            )}
            <hr className="m-2 border-slate-300/40" />
            {isLoggedIn ? (
              <MobileLogoutLink>로그아웃</MobileLogoutLink>
            ) : (
              <MobileNavLink href={LOGIN_COMPONENT}>로그인</MobileNavLink>
            )}
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
}

function LogoutLink({ children }) {
  const navigate = useNavigate();

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(USER_ROLE);
    navigate(LOGIN_COMPONENT);
  };

  return (
    <a
      href="#"
      onClick={handleLogout}
      className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
    >
      {children}
    </a>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      to={href}
      className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
    >
      {children}
    </Link>
  )
}


export function Header() {
  const isLoggedIn = !!localStorage.getItem(ACCESS_TOKEN);
  const userRole = localStorage.getItem(USER_ROLE);

  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem(USER_ROLE);
    if (userRole !== ADMIN) {
      navigate(LOGIN_COMPONENT);
    }
  });

  return (
    <header className="py-10">
      <Container>
        <nav className="relative z-100 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <NavLink href="/" aria-label="Home">
              {/* <Logo className="h-10 w-auto" /> */}
              <img src={NEWLOGO} className="w-40"></img>
            </NavLink>
            <div className="hidden md:flex md:gap-x-6">
              {LinkData.map((data, index) => (
                <MobileNavLink key={index} href={data.href}>
                  {data.menuName}
                </MobileNavLink>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:block">
              {isLoggedIn ? (
                <LogoutLink>로그아웃</LogoutLink>
              ) : (
                <NavLink href={LOGIN_COMPONENT}>로그인</NavLink>
              )}
            </div>
            {userRole === ADMIN && (
              <Link to={AUTH_MANAGEMENT_COMPONENT}>
                <Button color="blue">
                  <span>권한관리</span>
                </Button>
              </Link>
            )}
            <div className="-mr-1 md:hidden">
              <MobileNavigation />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}
