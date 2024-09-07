'use client'
import { Coolshape } from "coolshapes-react";
import { useGeneralState } from '@/context/GeneralStateContext';

interface MyCoolshapeProps {
  size: number;
}

const MyCoolshape : React.FC<MyCoolshapeProps> = ({ size }) => {

  const { randomIndex, randomType } = useGeneralState()

  return (
    <Coolshape
      type={randomType}
      index={randomIndex}
      noise={true}
      size={size}
    />
  );
};

export default MyCoolshape;
