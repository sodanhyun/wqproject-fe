import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import { Button } from '../components/Button'
import { Logo } from '../components/Logo'
import { SlimLayout } from '../components/SlimLayout'
import { LOGIN_COMPONENT } from '../constants/component_constants'

export default function NotFound() {

  const navigate = useNavigate();

  const goback = () => {
    navigate(-2)
  }

  return (
    <div className='h-screen'>

    <SlimLayout>
      <div className="flex">
        <Link href="/" aria-label="Home">
          <Logo className="h-10 w-auto" />
        </Link>
      </div>
      <p className="mt-20 text-sm font-medium text-gray-700">401</p>
      
      <h1 className="mt-3 text-lg font-semibold text-gray-900">
      접근이 제한된 페이지입니다. 관리자 로그인 후 접근바랍니다.
      </h1>
      {/* <p className="mt-3 text-sm text-gray-700">
      관리자 로그인 후 접근바랍니다.
      </p> */}
      <p className="mt-2 text-sm text-gray-700">
          관리자이신가요?{" "}
          <Link
            to={`${LOGIN_COMPONENT}`}
            className="font-medium text-blue-600 hover:underline"
          >
            로그인
          </Link>{" "}
          하러가기
        </p>
      
      <Button  className="mt-10" onClick={goback}>
        돌아가기
      </Button>
      
    </SlimLayout>
    </div>
  )
}
