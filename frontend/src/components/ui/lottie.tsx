import Lottie from "lottie-react";
import winnerAnimation from '../../assets/winner.json'; 
import '../../style/Lottie.css';

const LottieAnimation = () => {
  return (
      <Lottie className="lottie-wrapper" animationData={winnerAnimation} loop={true} />
  );
};

export default LottieAnimation;
