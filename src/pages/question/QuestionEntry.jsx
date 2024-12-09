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
        <SocialLoginLink/>
      </SlimLayout>
    </div>
  );
}
