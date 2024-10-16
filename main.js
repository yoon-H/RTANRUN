/** Import */
import { sounds, images } from './resources.js';

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

/** 1-1 르탄이 그리기 */
const RTAN_WIDTH = 100; // 르탄이 가로 너비
const RTAN_HEIGHT = 100; // 르탄이 세로 높이
const RTAN_X = 10; // 르탄이의 초기 X 좌표
const RTAN_Y = 380; // 르탄이의 초기 Y 좌표

/** 르탄이 객체 정의 */
const rtan = {
    x: RTAN_X,
    y: RTAN_Y,
    width: RTAN_WIDTH,
    height: RTAN_HEIGHT,
    draw() {      // 달리는 애니메이션 구현
        if (gameOver) {
            // 게임 오버 시 충돌 이미지 그리기
            ctx.drawImage(images.rtanCrash, this.x, this.y, this.width, this.height);
        } else {
            // 달리는 애니메이션 구현
            if (timer % 60 > 30) {
                ctx.drawImage(images.rtanA, this.x, this.y, this.width, this.height);
            } else {
                ctx.drawImage(images.rtanB, this.x, this.y, this.width, this.height);
            }
        }
    },
};
/** end of 1-1 르탄이 그리기 */

const BULLET_WIDTH = 20; // 총알 가로 너비
const BULLET_HEIGHT = 20; // 총알 세로 높이
const BULLET_SPEED = 2; // 총알 속도
const BULLET_DAMAGE = 10; // 총알 데미지

/** 총알 클래스 정의 */
class Bullet {
    constructor(dir_x, dir_y) {
        this.x = RTAN_X + RTAN_WIDTH;
        this.y = rtan.y + (RTAN_HEIGHT / 2);
        this.width = BULLET_WIDTH;
        this.height = BULLET_HEIGHT;
        this.dirX = (dir_x - this.x) / 70;
        this.dirY = (dir_y - this.y) / 70;
        this.damage = BULLET_DAMAGE;
    }
    draw() {
        ctx.drawImage(images.bullet, this.x, this.y, this.width, this.height); // 총알 이미지 그리기
    }
    move() {
        this.x += this.dirX * BULLET_SPEED;
        this.y += this.dirY * BULLET_SPEED;
    }
}
/** end of 2-1 총알 설정 */


/** 2-1 장애물 설정 */
const OBSTACLE_WIDTH = 50; // 장애물 너비
const OBSTACLE_HEIGHT = 50; // 장애물 높이
const OBSTACLE_FREQUENCY = 90; // 장애물 생성 빈도
const OBSTACLE_SPEED = 4; // 장애물 이동 속도

/** 장애물 클래스 정의 */
class Obstacle {
    constructor() {
        this.x = canvas.width;
        this.y =
            Math.floor(Math.random() * (canvas.height - OBSTACLE_HEIGHT - 30)) + 30; // 장애물이 canvas의 상단과 하단에서 30px 이내에 생성되지 않도록 조정
        this.width = OBSTACLE_WIDTH;
        this.height = OBSTACLE_HEIGHT;
    }
    draw() {
        ctx.drawImage(images.obstacle, this.x, this.y, this.width, this.height); // 장애물 이미지 그리기
    }
}
/** end of 2-1 장애물 설정 */

/** 보스 설정 */
const BOSS_WIDTH = 150;     // 보스 너비
const BOSS_HEIGHT = 150;    // 보스 높이
const BOSS_X = 600;         // 보스 X 위치
const BOSS_Y = 100;         // 보스 Y 위치
const BOSS_MAXHP = 100;     // 보스 최대 체력
const BOSS_SPEED = 1;     // 보스 최대 체력

/** 보스 정의 */
const boss = {
    x: BOSS_X,
    y: BOSS_Y,
    width: BOSS_WIDTH,
    height: BOSS_HEIGHT,
    hp: BOSS_MAXHP,
    moveDir: 1,
    moveSpeed: BOSS_SPEED,
    draw() {
        ctx.drawImage(images.boss, this.x, this.y, this.width, this.height); // 보스 이미지 그리기
    },
    takeDamage(damage) {
        this.hp -= damage;
        HPBar.health -= damage;
        //HPBar.show();
        if (this.hp <= 0) {
            gameClear = true;
        }
    },
    move() {

        this.y += this.moveDir * this.moveSpeed;
        HPBar.y += this.moveDir * this.moveSpeed;

        if (this.y - 50 <= 0) {
            this.moveDir = 1;
        }

        if (this.y + 50 >= 400) {
            this.moveDir = -1;
        }
    }
}
/** end of 보스 설정 */

/** 체력 바 설정 */
const HPBAR_WIDTH = 100
const HPBAR_HEIGHT = 10;
const HPBAR_X = (BOSS_X + BOSS_WIDTH / 2) - HPBAR_WIDTH / 2;
const HPBAR_Y = BOSS_Y - 20;
const HPBAR_COLOR = "red";

/** 체력 바 정의 */
const HPBar = {
    y: HPBAR_Y,
    maxHealth: BOSS_MAXHP,
    health: BOSS_MAXHP,
    color: HPBAR_COLOR,
    moveDir: 1,
    moveSpeed: BOSS_SPEED,
    show() {
        ctx.fillStyle = HPBAR_COLOR;
        ctx.fillRect(HPBAR_X, this.y, (boss.hp / BOSS_MAXHP) * HPBAR_WIDTH, HPBAR_HEIGHT);
        ctx.strokeRect(HPBAR_X, this.y, HPBAR_WIDTH, HPBAR_HEIGHT)
    },
    move() {
        boss.y - 20;
    }
}



/** 3-1 배경 화면 그리기 */
function backgroundImg(bgX) {
    ctx.drawImage(images.background, bgX, 0, canvas.width, canvas.height);
}
// 시작 화면 그리기
function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    backgroundImg(0);
    const imageWidth = 473;
    const imageHeight = 316;
    const imageX = canvas.width / 2 - imageWidth / 2;
    const imageY = canvas.height / 2 - imageHeight / 2;
    ctx.drawImage(images.start, imageX, imageY, imageWidth, imageHeight);
}

// 게임 오버 화면 그리기
function drawGameOverScreen() {
    ctx.drawImage(
        images.gameover,
        canvas.width / 2 - 100,
        canvas.height / 2 - 50,
        200,
        100
    );
    ctx.drawImage(
        images.restart,
        canvas.width / 2 - 50,
        canvas.height / 2 + 50,
        100,
        50
    );
}

// 게임 클리어 화면 그리기
function drawGameClearScreen() {
    ctx.drawImage(
        images.gameclear,
        canvas.width / 2 - 100,
        canvas.height / 2 - 150,
        200,
        200
    );
    ctx.drawImage(
        images.restart,
        canvas.width / 2 - 50,
        canvas.height / 2 + 50,
        100,
        50
    );
}

//이미지 로딩 완료 시 게임 시작 화면 그리기
let bgImageLoaded = new Promise((resolve) => {
    images.background.onload = resolve;
});

let startImageLoaded = new Promise((resolve) => {
    images.start.onload = resolve;
});

Promise.all([bgImageLoaded, startImageLoaded]).then(drawStartScreen);
/** end of 3-1 게임 시작 화면을 그리는 함수 */

/** 게임 애니메이션 함수 */
function animate() {
    /** 게임 클리어 */
    if (gameClear) {
        timer = 0;
        jump = false;
        sounds.bgm.pause(); // 배경 음악 중지
        drawGameClearScreen();
        return;
    }

    /** 2-3 장애물 조건 설정(게임 오버) */
    if (gameOver) {
        drawGameOverScreen(); // 3-2 에서 다룰 게임오버 그리기
        return;
    }
    /** end of 2-3 장애물 조건 설정(게임 오버) */

    // 타이머 증가 및 다음 프레임 요청
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    timer++;

    /** 배경 이미지 */
    // 3-1 배경 이미지 그리기 (무한 스크롤 효과)
    backgroundImg(bgX);
    backgroundImg(bgX + canvas.width);
    bgX -= BG_MOVING_SPEED;
    if (bgX < -canvas.width) bgX = 0;
    // 배경 음악 재생
    sounds.bgm.play();
    /** end of 배경 이미지 */

    /**-- 보스 --*/
    boss.draw();
    boss.move();

    /**-- 장애물 --*/
    /** 2-2 장애물 움직이기 */
    if (timer % OBSTACLE_FREQUENCY === 0) {
        const obstacle = new Obstacle();
        obstacleArray.push(obstacle);
    }
    // 장애물 처리
    obstacleArray.forEach((obstacle) => {
        obstacle.draw();
        obstacle.x -= OBSTACLE_SPEED; // 장애물 왼쪽으로 이동
        /** end of 2-2 장애물 움직이기 */

        /** 2-3 장애물 조건 설정(충돌하기) */
        // 화면 밖으로 나간 장애물 제거 및 점수 증가
        if (obstacle.x < -OBSTACLE_WIDTH) {
            obstacleArray.shift(); // 장애물 제거
        }

        // 충돌 검사
        if (collision(rtan, obstacle)) {
            timer = 0;
            gameOver = true;
            jump = false;
            sounds.bgm.pause(); // 배경 음악 중지
            sounds.defeat.play(); // 게임 오버 소리 재생
        }
    });
    /** end of 2-3 장애물 조건 설정(충돌하기)*/
    /** end of 장애물 */

    /**-- 총알 --*/
    bulletArray.forEach((bullet, index) => {
        bullet.draw();
        bullet.move(); // 총알 마우스 방향으로 이동
        /** end of 총알 움직이기 */

        /** 2-3 총알 조건 설정(충돌하기) */
        // 화면 밖으로 나간 총알 제거
        if (bullet.x < -BULLET_WIDTH) {
            bulletArray.splice(index, 1); // 총알 제거
            return;
        }

        // 충돌 검사
        if (collision(boss, bullet)) {
            boss.takeDamage(bullet.damage);
            bulletArray.splice(index, 1); // 총알 제거

            //score += 10; // 점수 증가
            //scoreText.innerHTML = "현재점수: " + boss.hp;
            sounds.score.pause(); // 현재 재생 중인 점수 소리 중지
            sounds.score.currentTime = 0; // 소리 재생 위치를 시작으로 초기화
            sounds.score.play(); // 점수 획득 소리 재생

        }

    });
    /** end of 총알 */

    /**-- 르탄이 --*/
    // 1-2 르탄이 그리기
    rtan.draw();

    // 1-3 르탄이 점프 조건 설정하기
    if (jump) {
        rtan.y -= 3; // 스페이스바를 누르고 있으면 rtan의 y값 감소
        if (rtan.y < 20) rtan.y = 20; // rtan이 canvas 상단을 넘지 않도록 조정
    } else {
        if (rtan.y < RTAN_Y) {
            rtan.y += 3; // 스페이스바를 떼면 rtan의 y값 증가
            if (rtan.y > RTAN_Y) rtan.y = RTAN_Y; // rtan이 초기 위치 아래로 내려가지 않도록 조정
        }
    }
    /** end of 르탄이 */

    /** 체력 바 */
    HPBar.show();
    HPBar.move();

    scoreText.innerHTML = "소요시간: " + Math.floor((Date.now() - startTime) / 500);
}
/** end of 게임 애니메이션 */

/** 1-3 르탄이 점프하기 */
// 키보드 이벤트 처리 (스페이스바 점프)
document.addEventListener("keydown", function (e) {
    if (e.code === "Space" && !jump) {
        jump = true; // 스페이스바를 누르고 있을 때 점프 상태 유지
        sounds.jump.play(); // 점프 소리 재생
    }
});

document.addEventListener("keyup", function (e) {
    if (e.code === "Space") {
        jump = false; // 스페이스바를 떼면 점프 상태 해제
    }
});
/** end of 1-3 르탄이 점프하기 */

/** 2-3 장애물 조건1 충돌함수 */
/** 충돌 체크 함수 */
function collision(rtan, obstacle) {
    return !(
        rtan.x > obstacle.x + obstacle.width ||
        rtan.x + rtan.width < obstacle.x ||
        rtan.y > obstacle.y + obstacle.height ||
        rtan.y + rtan.height < obstacle.y
    );
}
/** end of 2-3 장애물 조건1 충돌함수 */


/** 3-3 게임 시작 조건 설정하기 */
canvas.addEventListener("click", function (e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 게임 시작 조건 확인
    if (
        !gameStarted &&
        x >= 0 &&
        x <= canvas.width &&
        y >= 0 &&
        y <= canvas.height
    ) {
        gameStarted = true;
        startTime = Date.now();
        animate();
        return;
    }

    if ( // 게임 재시작 버튼 클릭 확인
        (gameOver || gameClear) &&
        x >= canvas.width / 2 - 50 &&
        x <= canvas.width / 2 + 50 &&
        y >= canvas.height / 2 + 50 &&
        y <= canvas.height / 2 + 100
    ) {
        restartGame();
        return;
    }

    if (gameStarted && !gameOver && !gameClear) {
        const bullet = new Bullet(x, y);
        bulletArray.push(bullet);
        return;
    }
});

/** 게임 재시작 함수 */
function restartGame() {
    gameOver = false;
    gameClear = false;
    obstacleArray = [];
    bulletArray = [];
    timer = 0;
    score = 0;
    scoreText.innerHTML = "현재점수: " + score;
    // 게임 오버 시 르탄이 위치 초기화
    rtan.x = RTAN_X;
    rtan.y = RTAN_Y;
    boss.hp = BOSS_MAXHP;
    HPBar.health = HPBar.maxHealth;
    startTime = Date.now();
    animate();
}
/** end of 3-3 마우스 클릭 이벤트 처리 (게임 시작 및 재시작) */

/** 4. 꾸미기 */
/** 마우스 이동 이벤트 처리 (커서 스타일 변경) */
canvas.addEventListener("mousemove", function (e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 게임오버 재시작 버튼 위에 있을 때
    if (
        (gameOver || gameClear) &&
        x >= canvas.width / 2 - 50 &&
        x <= canvas.width / 2 + 50 &&
        y >= canvas.height / 2 + 50 &&
        y <= canvas.height / 2 + 100
    ) {
        canvas.style.cursor = "pointer";
    }
    // 게임 시작 전 캔버스 위에 있을 때
    else if (
        !gameStarted &&
        x >= 0 &&
        x <= canvas.width &&
        y >= 0 &&
        y <= canvas.height
    ) {
        canvas.style.cursor = "pointer";
    }
    // 그 외의 경우
    else {
        canvas.style.cursor = "default";
    }
});
/** end of 4.꾸미기 */

// 자동 정렬 단축키
// win : alt+shift+F
// mac : shift+option+F