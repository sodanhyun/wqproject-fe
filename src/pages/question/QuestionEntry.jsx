import { useParams } from 'react-router-dom';
import { Link} from "react-router-dom";
import { SlimLayout } from "../../components/common/SlimLayout";
import WqLogo from "/assets/logo/wq2.png"
import SocialLoginLink from '../auth/component/SocialLoginLink';
import { LECTURE_CODE } from '../../constants/localstorage_constants';
import { useState } from 'react';

export default function QuestionEntry() {
  const { lCode } = useParams();
  const [pendding, setPendding] = useState(false);
  localStorage.removeItem(LECTURE_CODE);
  localStorage.setItem(LECTURE_CODE, lCode);

  return (
    <div className="h-screen">
      <SlimLayout>
      {pendding && 
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="spinner w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mt-4 mx-auto"></div>
      </div>
      }
        <div className="flex justify-center">
          <Link href="/" aria-label="Home">
          <img src={WqLogo} className="w-40"/>
          </Link>
        </div>
        <h2 className="mt-20 text-lg font-semibold text-gray-900 flex justify-center">로그인</h2>
        <SocialLoginLink
          setPendding={setPendding}
        />
      </SlimLayout>
    </div>
  );
}
