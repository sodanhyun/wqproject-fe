import { useParams } from 'react-router-dom';
import { Link} from "react-router-dom";
import { SlimLayout } from "../../components/common/SlimLayout";
import WqLogo from "/assets/logo/wq2.png"
import SocialLoginLink from '../auth/component/SocialLoginLink';

export default function QuestionEntry() {
  const { lCode } = useParams();
  localStorage.removeItem(LECTURE_CODE);
  localStorage.setItem(LECTURE_CODE, lCode);

  return (
    <div className="h-screen">
      <SlimLayout>
        <div className="flex justify-center">
          <Link href="/" aria-label="Home">
          <img src={WqLogo} className="w-40"/>
          </Link>
        </div>
        <h2 className="mt-20 text-lg font-semibold text-gray-900 flex justify-center">로그인</h2>
        <p className="mt-2 text-sm text-gray-700 flex justify-center ">
          로그인 없이
          <Link
            to={`/question/${lCode}`}
            className="font-medium text-blue-600 hover:underline"
          >
            질문등록
          </Link>
          하러가기
        </p>
        <SocialLoginLink/>
      </SlimLayout>
    </div>
  );
}
