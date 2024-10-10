import { useNavigate } from "react-router-dom";
import fetcher from "../../../fetcher";
import { LOGOUT_API } from "../../../constants/api_constants";
import { TYPE_GOOGLE, TYPE_KAKAO, TYPE_OWN, USER_TYPE } from "../../../constants/localstorage_constants";
import { LOGIN_COMPONENT } from "../../../constants/component_constants";

export default function LogoutLink({ children }) {
    const navigate = useNavigate();
    const { 
        VITE_REACT_APP_API_BASE_URL,
        VITE_REACT_APP_REST_API_KEY,
        VITE_REACT_APP_LOGOUT_REDIRECT_URL
    } = import.meta.env;
  
    const logoutHandler = async (event) => {
        event.preventDefault();
        const type = localStorage.getItem(USER_TYPE);
        if(type === TYPE_OWN) {
            await fetcher.delete(VITE_REACT_APP_API_BASE_URL + LOGOUT_API).then((res) => {
                localStorage.clear();
            }).catch((err) => {
                console.err(err);
            })
            navigate(LOGIN_COMPONENT);
        }
        if(type === TYPE_KAKAO) {
          const url = 'https://kauth.kakao.com/oauth/logout';
          await fetcher.delete(VITE_REACT_APP_API_BASE_URL + LOGOUT_API).then((res) => {
            localStorage.clear();
            window.location.href = `${url}?client_id=${VITE_REACT_APP_REST_API_KEY}&logout_redirect_uri=${VITE_REACT_APP_LOGOUT_REDIRECT_URL}`;
          }).catch((err) => {
            console.err(err);
          })
        }
        if(type === TYPE_GOOGLE) {
          await fetcher.delete(VITE_REACT_APP_API_BASE_URL + LOGOUT_API).then((res) => {
            localStorage.clear();
          }).catch((err) => {
            console.err(err);
          })
        }
      }
  
    return (
      <a
        href="#"
        onClick={logoutHandler}
        className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
      >
        {children}
      </a>
    );
  }