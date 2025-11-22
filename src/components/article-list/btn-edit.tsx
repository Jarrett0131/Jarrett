import type { FC } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const BtnEditAritcle: FC<{ id: number }> = ({ id }) => {
  const navigate = useNavigate() ;
  return (
    <Button type="link" size="small" onClick={() => navigate('/art-edit/' + id)}>
      修改
    </Button>
  )
}

export default BtnEditAritcle ;