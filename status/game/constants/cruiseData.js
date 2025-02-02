// constants/cruiseData.js
import { LocationType } from './gameTypes.js';

// 층별 잠금해제 조건
export const floorUnlockConditions = {
  '7': null,
  '6': (inventory) => true, // 처음부터 열려있음
  '5': (inventory) => inventory.includes('작은 열쇠'),
  '4': (inventory) => inventory.includes('비상 열쇠'),
  '3': (inventory) => inventory.includes('미로 열쇠')
};

export const floorData = {
  '7': {
    name: '최상층',
    description: '크루즈의 최상층. 전망과 식사를 즐길 수 있는 공간.',
    unlockCondition: floorUnlockConditions['7'],
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
          },
          {
            name: '주방 살펴보기',
            description: '주방 안을 살펴본다.',
            result: '주방에서 이상한 영수증을 발견했다.',
            requiresItem: null,
            givesItem: '수상한 영수증'
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
      }
    }
  },
  '6': {
    name: '객실층',
    description: '승객들의 객실이 있는 층. 일부 객실은 잠겨있다.',
    unlockCondition: floorUnlockConditions['6'],
    locations: {
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
};

// Default export for convenience
export default floorData;