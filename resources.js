/** 오디오 객체 생성 및 설정 */
const jumpSound = new Audio(); // 점프 소리
jumpSound.src = "./sounds/jump.mp3";
const bgmSound = new Audio(); // 배경 음악
bgmSound.src = "./sounds/bgm.mp3";
const scoreSound = new Audio(); // 점수 획득 소리
scoreSound.src = "./sounds/score.mp3";
const defeatSound = new Audio(); // 게임 오버 소리
defeatSound.src = "./sounds/defeat1.mp3";

/** 오디오 모음 */
const sounds = { jump: jumpSound, bgm: bgmSound, score: scoreSound, defeat: defeatSound };

/** 이미지 객체 생성 및 설정 */
// (1) 배경
const bgImage = new Image();
bgImage.src = "./images/background.png";
// (2) 게임 시작
const startImage = new Image();
startImage.src = "./images/gamestart.png";
// (3) 게임 오버
const gameoverImage = new Image();
gameoverImage.src = "./images/gameover.png";
// (4) 게임 재시작
const restartImage = new Image();
restartImage.src = "./images/restart.png";
// (5) 달리는 르탄이 A
const rtanAImage = new Image();
rtanAImage.src = "./images/rtan_running_a.png";
// (6) 달리는 르탄이 B
const rtanBImage = new Image();
rtanBImage.src = "./images/rtan_running_b.png";
// (7) 게임 오버 르탄이
const rtanCrashImage = new Image();
rtanCrashImage.src = "./images/rtan_crash.png";
// (8) 장애물
const obstacleImage = new Image();
obstacleImage.src = "./images/obstacle1.png";
// (8) 보스
const bossImage = new Image();
bossImage.src = "./images/obstacle3.png";
// (8) 총알
const bulletImage = new Image();
bulletImage.src = "./images/obstacle2.png";
// (9) 게임 클리어
const gameclearImage = new Image();
gameclearImage.src = "./images/gameclear.png";

/** 이미지 모음 */
const images = {
    background: bgImage, start: startImage, gameover: gameoverImage, restart: restartImage, rtanA: rtanAImage,
    rtanB: rtanBImage, rtanCrash: rtanCrashImage, obstacle: obstacleImage, boss: bossImage, bullet: bulletImage, 
    gameclear : gameclearImage
};

export { sounds, images };
