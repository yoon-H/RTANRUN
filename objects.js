/** Import */
import { images } from './resources.js';

/** 1-1 르탄이 그리기 */
const RTAN_WIDTH = 100; // 르탄이 가로 너비
const RTAN_HEIGHT = 100; // 르탄이 세로 높이
const RTAN_X = 10; // 르탄이의 초기 X 좌표
const RTAN_Y = 380; // 르탄이의 초기 Y 좌표

/** 르탄이 객체 정의 */
const rtan = {
    x: RTAN_X,
    y: RTAN_Y,
    initX: RTAN_X,
    initY: RTAN_Y,
    width: RTAN_WIDTH,
    height: RTAN_HEIGHT,
    init() {
        this.x = this.initX;
        this.y = this.initY;
    },
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
    draw(ctx) {
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
const OBSTACLE_SPEED = 4; // 장애물 이동 속도

/** 장애물 클래스 정의 */
class Obstacle {
    constructor() {
        this.x = boss.x;
        this.y = boss.y; // 장애물이 canvas의 상단과 하단에서 30px 이내에 생성되지 않도록 조정
        this.width = OBSTACLE_WIDTH;
        this.height = OBSTACLE_HEIGHT;
        this.speed = OBSTACLE_SPEED;
    }
    draw(ctx) {
        ctx.drawImage(images.obstacle, this.x, this.y, this.width, this.height); // 장애물 이미지 그리기
    }
}
/** end of 2-1 장애물 설정 */

/** 보스 설정 */
const BOSS_WIDTH = 150;     // 보스 너비
const BOSS_HEIGHT = 150;    // 보스 높이
const BOSS_X = 600;         // 보스 X 위치
const BOSS_Y = 100;         // 보스 Y 위치
const BOSS_MAXHP = 200;     // 보스 최대 체력
const BOSS_SPEED = 1;     // 보스 스피드

/** 보스 정의 */
const boss = {
    x: BOSS_X,
    y: BOSS_Y,
    initX: BOSS_X,
    initY: BOSS_Y,
    width: BOSS_WIDTH,
    height: BOSS_HEIGHT,
    maxHp: BOSS_MAXHP,
    hp: BOSS_MAXHP,
    moveDir: 1,
    moveSpeed: BOSS_SPEED,
    init() {
        this.x = this.initX;
        this.y = this.initY;
        this.hp = this.maxHp;
    },
    draw(ctx) {
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
    y: BOSS_Y - 20,
    maxHealth: BOSS_MAXHP,
    health: BOSS_MAXHP,
    color: HPBAR_COLOR,
    moveDir: 1,
    moveSpeed: BOSS_SPEED,
    init() {
        this.health = this.maxHealth;
    },
    draw(ctx) {
        ctx.fillStyle = HPBAR_COLOR;
        ctx.fillRect(HPBAR_X, this.y, (boss.hp / boss.maxHp) * HPBAR_WIDTH, HPBAR_HEIGHT);
        ctx.strokeRect(HPBAR_X, this.y, HPBAR_WIDTH, HPBAR_HEIGHT)
    },
    move() {
        this.y = boss.y - 20;
    }
}

export { rtan, Bullet, Obstacle, boss, HPBar };