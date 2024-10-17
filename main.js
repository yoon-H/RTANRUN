/** Import */
import { rtan, Bullet, Obstacle, boss, HPBar } from './objects.js';
import { sounds, images } from './resources.js';

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
    boss.draw(ctx);
    boss.move();

    /**-- 장애물 --*/
    /** 2-2 장애물 움직이기 */
    if (timer % obstacleFrequency === 0) {
        const obstacle = new Obstacle();
        obstacleArray.push(obstacle);
    }
    // 장애물 처리
    obstacleArray.forEach((obstacle) => {
        obstacle.draw(ctx);
        obstacle.x -= obstacle.speed; // 장애물 왼쪽으로 이동
        /** end of 2-2 장애물 움직이기 */

        /** 2-3 장애물 조건 설정(충돌하기) */
        // 화면 밖으로 나간 장애물 제거 및 점수 증가
        if (obstacle.x < -obstacle.width) {
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
        bullet.draw(ctx);
        bullet.move(); // 총알 마우스 방향으로 이동
        /** end of 총알 움직이기 */

        /** 2-3 총알 조건 설정(충돌하기) */
        // 화면 밖으로 나간 총알 제거
        if (bullet.x < -bullet.width) {
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
    rtan.draw(ctx);

    // 1-3 르탄이 점프 조건 설정하기
    if (jump) {
        rtan.y -= 3; // 스페이스바를 누르고 있으면 rtan의 y값 감소
        if (rtan.y < 20) rtan.y = 20; // rtan이 canvas 상단을 넘지 않도록 조정
    } else {
        if (rtan.y < rtan.initY) {
            rtan.y += 3; // 스페이스바를 떼면 rtan의 y값 증가
            if (rtan.y > rtan.initY) rtan.y = rtan.initY; // rtan이 초기 위치 아래로 내려가지 않도록 조정
        }
    }
    /** end of 르탄이 */

    /** 체력 바 */
    HPBar.draw(ctx);
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
    rtan.init();
    boss.init();
    HPBar.init();
    obstacleFrequency = OBSTACLE_FREQUENCY;
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