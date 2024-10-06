// 강의 관련
export const REGISTER_LECTURE_API = "/lecture/regist"  // 강의등록
export const FILTER_LECTURE_LIST_API ="/lecture/filteredList" // 전체 강의 목록 & 필터 조건 조회
export const LECTURE_LIST_API ="/lecture/list" // 완료되지않은 강의 목록 (셀렉트박스용)
export const LECTURE_HANDLE_API ="/lecture" // (+lCode) 강의 상세정보, 수정, 삭제
export const LECTURE_IMAGE_API = "/lecture/image/" // (+lCode) 이미지 불러오기
export const QRACTIVE_API = "/lecture/active" // 강의 활성화,비활성화
export const QUESTION_LIMIT_API = "/lecture/limit" // (+lCode) 질문 제한 시간, 강의 제목


// 질문 관련
export const QUESTION_LIST_API = "/question/list" // (+lCode) 사용자 질문 리스트
export const PICKED_QUESTION_LIST_API = "/question/picked" // (+lCode) 관리자 - 채택된 질문 리스트
export const TEMP_TOKEN_API = "/auth/tempToken" // 소셜로그인 없이 질문등록
export const ANSWER_LIST_API = "/answer/list" // (+qCode) 답변 리스트
export const QUESTION_ACTIVE_API = "/question/active" //(+lCode) 질문등록 버튼용

// 웹소켓 - 구독
export const QUESTION_SUBSCRIBE = "/qSub/question"  // (+lCode) 질문 구독 - 사용자
export const UPDATE_QUESTION_SUBSCRIBE = "/qSub/update"  // 질문 수정 구독 - 사용자
export const DELETE_QUESTION_SUBSCRIBE = "/qSub/delete"  // 질문 삭제 구독 - 사용자
export const LIKE_SUBSCRIBE = "/qSub/like"  // 좋아요 구독 - 사용자
export const PICK_SUBSCRIBE = "/pSub/question"  // 질문 채택 - 사용자
export const ANSWER_SUBSCRIBE = "/pSub/answer"  // (+qCode) 답변 구독
export const UPDATE_ANSWER_SUBSCRIBE = "/pSub/answer/update"  // (+qCode) 답변 수정
export const DELETE_ANSWER_SUBSCRIBE = "/pSub/answer/delete"  // (+qCode) 답변 삭제

// 웹소켓 - 전송
export const QUESTION_PUBLISH = "/pub/question" // 질문 전송
export const UPDATE_QUESTION_PUBLISH = "/pub/update" // 질문 수정
export const DELETE_QUESTION_PUBLISH = "/pub/delete"  // 질문 삭제
export const LIKE_PUBLISH = "/pub/like" // 좋아요 전송
export const PICK_PUBLISH = "/pub/pick" // 질문 채택 - 관리자
export const ANSWER_PUBLISH = "/pub/answer" // (+qCode)답변 등록
export const UPDATE_ANSWER_PUBLISH = "/pub/answer/update" // 답변 수정
export const DELETE_ANSWER_PUBLISH = "/pub/answer/delete" // 답변 삭제

// 계정 관련
export const LOGIN_API ="/auth/signin" // 관리자 로그인
export const SIGNUP_API ="/auth/signup" //관리자 회원가입
export const TOKEN_REFRESH_API ="/auth/refresh" //토큰 리프레쉬
export const ROLE_API = "/role/authorities" //권한 종류,멤버 정보
export const ROLE_UPDATE_API = "/role/update" // 권한 수정
export const ROLE_DELETE_API = "/role/delete" // (+memberId) 멤버 삭제

