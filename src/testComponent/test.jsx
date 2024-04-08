import { useEffect } from 'react';

const Test = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // 토큰O
      console.log('토큰이 있습니다:', token);
      // 원하는 작업 수행
    } else {
      // 토큰X
      console.log('토큰이 없습니다.');
    }
  }, []);

  return (
    <div className="Test">
      <div className="notice">
        <p>토큰 전달 걸~</p>
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default Test;
