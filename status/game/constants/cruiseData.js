// constants/cruiseData.js
import { LocationType } from './gameTypes.js';

export const floorData = {
  '7': {
    name: '최상층',
    description: '크루즈의 최상층. 전망과 식사를 즐길 수 있는 공간.',
    locations: {
      restaurant: {
        name: '레스토랑',
        type: LocationType.FACILITY,
        description: '고급 레스토랑. 바다를 바라보며 식사할 수 있다.',
        isLocked: false,
        interactions: [
          {
            name: '테이블 조사하기',
            description: '레스토랑 테이블들을 살펴본다.',
            result: '테이블 위에 수상한 메모가 있다.',
            requiresItem: null,
            givesItem: '수상한 메모'
          }
        ]
      },
      observatory: {
        name: '전망대',
        type: LocationType.OBSERVATION,
        description: '360도 파노라마 뷰를 감상할 수 있는 공간.',
        isLocked: false,
        interactions: [
          {
            name: '망원경으로 바다 보기',
            description: '망원경을 통해 바다를 관찰한다.',
            result: '멀리서 깜빡이는 불빛이 보인다. 모스 부호 같다...',
            requiresItem: null,
            givesItem: '모스 부호 기록'
          }
        ]
      },
      stairs_down: {
        name: '계단 (아래층으로)',
        type: LocationType.STAIRS,
        description: '6층으로 내려가는 계단.',
        isLocked: false,
        targetFloor: '6',
        interactions: [
          {
            name: '6층으로 내려가기',
            description: '계단을 통해 6층으로 이동한다.',
            result: '계단을 내려가 6층에 도착했다.',
            requiresItem: null,
            moveToFloor: '6'
          }
        ]
      }
    }
  },
  '6': {
    name: '객실층',
    description: '승객들의 객실이 있는 층.',
    locations: {
      stairs_up: {
        name: '계단 (위층으로)',
        type: LocationType.STAIRS,
        description: '7층으로 올라가는 계단.',
        isLocked: false,
        targetFloor: '7',
        interactions: [
          {
            name: '7층으로 올라가기',
            description: '계단을 통해 7층으로 이동한다.',
            result: '계단을 올라가 7층에 도착했다.',
            requiresItem: null,
            moveToFloor: '7'
          }
        ]
      },
      stairs_down: {
        name: '계단 (아래층으로)',
        type: LocationType.STAIRS,
        description: '5층으로 내려가는 계단.',
        isLocked: false,
        requiresItem: '작은 열쇠',
        targetFloor: '5',
        interactions: [
          {
            name: '5층으로 내려가기',
            description: '계단을 통해 5층으로 이동한다.',
            result: '계단을 내려가 5층에 도착했다.',
            requiresItem: '작은 열쇠',
            moveToFloor: '5'
          }
        ]
      },
      corridor: {
        name: '복도',
        type: LocationType.ROOM,
        description: '길고 어두운 복도. 양쪽으로 객실이 늘어서 있다.',
        isLocked: false,
        interactions: [
          {
            name: '복도 끝 확인하기',
            description: '복도 끝으로 이동한다.',
            result: '복도 끝에서 작은 비명 소리가 들린다...',
            requiresItem: null,
            givesItem: '비명 소리 녹음'
          }
        ]
      },
      room601: {
        name: '601호 객실',
        type: LocationType.ROOM,
        description: '평범해 보이는 객실',
        isLocked: true,
        unlockRequirement: '작은 열쇠',
        interactions: [
          {
            name: '침대 밑 확인',
            description: '침대 밑을 살펴본다.',
            result: '침대 밑에서 금고를 발견했다.',
            requiresItem: null,
            givesItem: '금고 발견'
          }
        ]
      }
    }
  }
  // 추가 층들도 같은 형식으로 구성...
};

export default floorData;