import { REDIRECT_COMPONENT } from "../../../constants/component_constants";
import { TYPE_GOOGLE, TYPE_KAKAO, USER_TYPE } from "../../../constants/localstorage_constants";
import kakao from "/assets/kakao/kakao_login_medium_wide.png";
import googleSignIn from "/assets/google/web_neutral_sq_SI@4x.png";
const { VITE_REACT_APP_API_BASE_URL } = import.meta.env;

export default function SocialLoginLink(setPendding) {
    const GOOGLE_AUTH_URL = `${VITE_REACT_APP_API_BASE_URL}/oauth2/authorization/google?redirect_uri=${REDIRECT_COMPONENT}&type=google`
    const KAKAO_AUTH_URL = `${VITE_REACT_APP_API_BASE_URL}/oauth2/authorization/kakao?redirect_uri=${REDIRECT_COMPONENT}&type=kakao`

    const handleSocialLogin = (type) => {
        localStorage.setItem(USER_TYPE, type);
        if(type === TYPE_KAKAO) {
            setPendding(true);
            window.location.href = KAKAO_AUTH_URL;
        }
        if(type === TYPE_GOOGLE) {
            setPendding(true);
            window.location.href = GOOGLE_AUTH_URL;
        }
    }

    return(
        <>
        <a onClick={() => {handleSocialLogin(TYPE_KAKAO);}} className="flex justify-center">
          <img src={kakao} className="w-70 mt-2 cursor-pointer hover:brightness-75" />
        </a>
        <a onClick={() => {handleSocialLogin(TYPE_GOOGLE);}} className="flex justify-center">
            <img src={googleSignIn} className="w-60 mt-2 cursor-pointer hover:brightness-75"/>
        </a>
        </>
    )
}