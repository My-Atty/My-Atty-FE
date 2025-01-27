import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/Logo.png';
import DrawBoxBtn from '../../assets/DrawBoxBtn.svg';
import HamburgerBtn from '../../assets/HamburgerBtn.svg';
import XBtn from '../../assets/XBoxBtn.svg';
import {
  StyledBoxBtn,
  StyledBoxBtnContainer,
  StyledContainer,
  StyledLogo,
  StyledMenuDropDown,
  StyledText,
  StyledTextBox,
} from './Header.style';
import { postLogout } from '../../apis/postLogout';

interface HeaderProps {
  isDrawing: boolean;
  isTotal?: boolean;
}

export const Header = ({ isDrawing, isTotal }: HeaderProps) => {
  const [isHamburgerClicked, setIsHamburgerClicked] = useState(false);
  const id = localStorage.getItem('memberId');
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoDrawing = () => {
    navigate(`/my/select/${id}`);
  };

  const handleGoNewDiary = () => {
    navigate('/register');
  };

  const handleClickedHamburger = () => {
    setIsHamburgerClicked((prev) => !prev);
  };

  const handleGoMy = () => {
    navigate(`/my/${id}`);
  };

  const handleLogout = () => {
    postLogout();
    navigate('/landing');
  };

  return (
    <StyledContainer $isTotal={isTotal}>
      <StyledLogo src={Logo} onClick={handleGoHome} />
      <StyledBoxBtnContainer>
        {!isDrawing && !isTotal && <StyledBoxBtn src={DrawBoxBtn} onClick={handleGoDrawing} />}
        {isHamburgerClicked ? (
          <>
            <StyledBoxBtn src={XBtn} onClick={handleClickedHamburger} />
            <StyledMenuDropDown $isDrawing={isDrawing} $isTotal={isTotal}>
              <StyledTextBox>
                <StyledText onClick={handleGoMy}>내 일기장</StyledText>
                <StyledText onClick={handleGoNewDiary}>새 일기장</StyledText>
                <StyledText onClick={handleLogout}>로그아웃</StyledText>
              </StyledTextBox>
            </StyledMenuDropDown>
          </>
        ) : (
          <StyledBoxBtn src={HamburgerBtn} onClick={handleClickedHamburger} />
        )}
      </StyledBoxBtnContainer>
    </StyledContainer>
  );
};
