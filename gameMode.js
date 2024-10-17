/** 캔버스 설정 */
const canvas = document.getElementById("canvas"); // 캔버스 요소 가져오기
canvas.width = 800; // 캔버스 너비 설정
canvas.height = 500; // 캔버스 높이 설정
const ctx = canvas.getContext("2d"); // 2D 렌더링

/** 게임 상태 변수 */
let gameStarted = false; // 게임 시작 여부
const BG_MOVING_SPEED = 3; // 배경 이동 속도
let bgX = 0; // 배경 X 좌표
let scoreText = document.getElementById("score"); // 점수 표시 요소
let startTime = 0; // 시작 시간
let score = 0; // 현재 점수

/** 게임 변수 */
let timer = 0; // 장애물 생성 시간
let obstacleArray = []; // 장애물 배열
let bulletArray = []; // 총알 배열
let gameOver = false; // 게임 종료 여부
let gameClear = false; // 게임 클리어 여부
let jump = false; // 점프 여부
let jumpSpeed = 3; // 점프 속도
const OBSTACLE_FREQUENCY = 120; // 장애물 생성 빈도
const addFrequency = 20;
let obstacleFrequency = OBSTACLE_FREQUENCY;