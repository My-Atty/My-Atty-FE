import { useEffect, useState } from 'react';
import {
  StyledBtnContainer,
  StyledContainer,
  StyledDayContainer,
  StyledHeader,
  StyledIcon,
  StyledImg,
  StyledLine,
  StyledLineContainer,
  StyledLogo,
  StyledMobileContainer,
  StyledSaveBtn,
  StyledStamp,
  StyledText,
  UnderlinedChar,
} from './MobileView.style';
import { useParams } from 'react-router-dom';
import { getDiary } from '../../apis/getDiary';
import { ResultDiaryType } from '../../types/ResultDiary.type';

import Sunny from '../../assets/weathers/Sunny.png';
import Cloud from '../../assets/weathers/Cloud.png';
import Moon from '../../assets/weathers/Moon.png';
import Rainbow from '../../assets/weathers/Rainbow.png';
import Rainy from '../../assets/weathers/Rainy.png';
import Snow from '../../assets/weathers/Snow.png';
import Stamp from '../../assets/Stamps/GoodStamp.png';
import Save from '../../assets/buttons/SaveBtn.svg';
import Logo from '../../assets/Logo.png';
import { getToken } from '../../apis/getToken';
import html2canvas from 'html2canvas';
import { getImgUrl } from '../../apis/getImgUrl';

export const MobileView = () => {
  const { diarybookid, diaryid } = useParams<{
    diarybookid: string | undefined;
    diaryid: string | undefined;
  }>();
  const [diaryData, setDiaryData] = useState<ResultDiaryType>();
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenAndDiary = async () => {
      try {
        await getToken();
        setIsLoading(true);
        if (diarybookid && diaryid) {
          const data: ResultDiaryType = await getDiary(diarybookid, diaryid);
          const base64 = await getImgUrl(data.imageUrl);
          setImageSrc(base64);
          setDiaryData(data);
          setIsLoading(false);
        } else {
          console.error('Diary data not found');
        }
      } catch (error) {
        console.error('Error fetching token or diary:', error);
      }
    };

    fetchTokenAndDiary();
  }, [diarybookid, diaryid]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const dateString = diaryData?.date;

  let year: number | undefined;
  let month: number | undefined;
  let day: number | undefined;

  if (dateString) {
    const [yearStr, monthStr, dayStr] = dateString.split('-');
    year = parseInt(yearStr, 10);
    month = parseInt(monthStr, 10);
    day = parseInt(dayStr, 10);
  }

  const saveAs = (uri: any, filename: string) => {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
      link.href = uri;
      link.download = filename;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
    } else {
      window.open(uri);
    }
  };

  const download = () => {
    window.scrollTo(0, 0);
    const captureImg: any = document.querySelector('#captureImg');
    html2canvas(captureImg, {
      allowTaint: false,
      useCORS: true,
      ignoreElements: (element) => {
        return element.classList.contains('excludeCapture');
      },
    }).then(function (canvas) {
      saveAs(canvas.toDataURL(), 'captureImg');
      // document.body.appendChild(canvas);
    });
  };

  return (
    <>
      {isLoading ? (
        <div>로딩 중입니다...</div>
      ) : (
        <StyledContainer id="captureImg">
          {diaryData && (
            <StyledMobileContainer>
              <StyledLogo src={Logo} />
              <StyledHeader>
                <div>
                  {year}. {String(month).padStart(2, '0')}. {String(day).padStart(2, '0')}
                </div>
                <StyledLine />
                <StyledDayContainer>
                  {diaryData?.weather &&
                    (diaryData?.weather === 'SUNNY' ? (
                      <div>해가 쨍쨍</div>
                    ) : diaryData?.weather === 'CLOUDY' ? (
                      <div>구름이 많아요</div>
                    ) : diaryData?.weather === 'MOON' ? (
                      <div>별이 빛나는 밤에</div>
                    ) : diaryData?.weather === 'RAINBOW' ? (
                      <div>일곱빛깔 무지개</div>
                    ) : diaryData?.weather === 'RAINY' ? (
                      <div>비가 주륵주륵</div>
                    ) : (
                      <div>눈이 펑펑</div>
                    ))}
                  {diaryData?.weather && (
                    <StyledIcon
                      type={diaryData?.weather}
                      src={
                        diaryData?.weather === 'SUNNY'
                          ? Sunny
                          : diaryData?.weather === 'CLOUDY'
                            ? Cloud
                            : diaryData?.weather === 'MOON'
                              ? Moon
                              : diaryData?.weather === 'RAINBOW'
                                ? Rainbow
                                : diaryData?.weather === 'RAINY'
                                  ? Rainy
                                  : Snow
                      }
                    />
                  )}
                </StyledDayContainer>
              </StyledHeader>
              <StyledImg src={`data:image/png;base64,${imageSrc}`} />
              <StyledLineContainer>
                <StyledText>{diaryData?.content}</StyledText>
                <StyledStamp src={Stamp} />
                {Array.from({ length: 10 }).map((_, index) => (
                  <UnderlinedChar key={index} />
                ))}
              </StyledLineContainer>
            </StyledMobileContainer>
          )}
          <StyledBtnContainer className="excludeCapture">
            <StyledSaveBtn src={Save} onClick={download} />
          </StyledBtnContainer>
        </StyledContainer>
      )}
    </>
  );
};
