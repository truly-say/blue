// constants/cruiseData.js
import { LocationType } from './gameTypes.js';

export const floorData = {
  '7': {
    name: '최상층',
    description: '크루즈의 최상층입니다. 전망과 식사를 즐길 수 있는 공간입니다.',
    locations: {
      observatory: {
        name: '전망대',
        type: LocationType.OBSERVATION,
        description: '넓은 바다를 한눈에 볼 수 있는 전망대입니다.',
        isLocked: false,
        interactions: [
          {
            name: '망원경으로 관찰하기',
            scripts: [
              '멀리 수평선을 바라봅니다.',
              '수평선 너머로 이상한 불빛이 보입니다.',
              '불빛이 모스 부호처럼 깜빡입니다.'
            ],
            choices: {
              2: [
                {
                  text: '모스 부호를 해독해본다',
                  result: '모스 부호를 해독했습니다.',
                  givesItem: '모스 부호 해독'
                },
                {
                  text: '무시한다',
                  result: '불빛은 계속 깜빡입니다.'
                }
              ]
            }
          },
          {
            name: '주변을 둘러보기',
            scripts: [
              '전망대는 한적하고 조용합니다.',
              '전망대 구석에 수상한 자국이 있습니다.',
              '자국 뒤에서 작은 메모를 발견했습니다.'
            ],
            givesItem: '수상한 메모'
          }
        ]
      },
      restaurant: {
        name: '레스토랑',
        type: LocationType.FACILITY,
        description: '고급스러운 레스토랑입니다. 지금은 문이 닫혀있습니다.',
        isLocked: false,
        interactions: [
          {
            name: '테이블 확인하기',
            scripts: [
              '식사 후 치워지지 않은 테이블들이 있습니다.',
              '한 테이블 위에 누군가의 소지품이 있습니다.',
              '소지품 사이에서 열쇠를 발견했습니다.'
            ],
            choices: {
              2: [
                {
                  text: '열쇠를 가져간다',
                  result: '작은 열쇠를 획득했습니다.',
                  givesItem: '작은 열쇠'
                },
                {
                  text: '그대로 둔다',
                  result: '열쇠를 그대로 두었습니다.'
                }
              ]
            }
          }
        ]
      },
      deck: {
        name: '갑판',
        type: LocationType.DECK,
        description: '최상층의 넓은 갑판입니다.',
        isLocked: false,
        interactions: [
          {
            name: '바다 보기',
            scripts: [
              '차가운 바닷바람이 불어옵니다.',
              '파도 소리가 들립니다.',
              '멀리서 무언가가 떠다니는 것이 보입니다.'
            ]
          }
        ]
      }
    }
  },
  '6': {
    name: '객실층',
    description: '승객들의 객실이 있는 층입니다. 학생들이 묵고 있습니다.',
    locations: {
      broken_room: {
        name: '부서진 객실',
        type: LocationType.ROOM,
        description: '방문이 부서진 객실입니다.',
        isLocked: false,
        interactions: [
          {
            name: '노크하기',
            scripts: [
              '노크했지만 아무도 없는 것 같습니다.',
              '다시 노크해보지만 응답이 없습니다.',
              '문이 살짝 열려있는 것을 발견했습니다.'
            ]
          },
          {
            name: '방 안으로 들어가기',
            scripts: [
              '방 안은 어둡고 차갑습니다.',
              '누군가 급하게 나간 듯한 흔적이 있습니다.',
              '방이 엉망진창입니다.'
            ],
            choices: {
              2: [
                {
                  text: '방을 수색한다',
                  result: '비상 열쇠를 발견했습니다.',
                  givesItem: '비상 열쇠'
                },
                {
                  text: '나간다',
                  result: '방을 나왔습니다.'
                }
              ]
            }
          }
        ]
      },
      lounge: {
        name: '휴게실',
        type: LocationType.FACILITY,
        description: '조용한 휴게실입니다.',
        isLocked: false,
        interactions: [
          {
            name: '주변 살피기',
            scripts: [
              '소파와 잡지가 있습니다.',
              '누군가 읽다 만 잡지를 발견했습니다.',
              '잡지 사이에서 쪽지를 발견했습니다.'
            ],
            givesItem: '수상한 쪽지'
          }
        ]
      },
      deck6: {
        name: '6층 갑판',
        type: LocationType.DECK,
        description: '6층의 갑판입니다.',
        isLocked: false,
        interactions: [
          {
            name: '아래층 내려다보기',
            scripts: [
              '바다가 넓게 펼쳐져 있습니다.',
              '차가운 바닷바람이 불어옵니다.',
              '아래층 갑판에서 무언가 반짝입니다.'
            ]
          }
        ]
      }
    }
  },
  '5': {
    name: '편의시설층',
    description: '다양한 편의시설이 있는 층입니다.',
    isLocked: true,
    unlockRequirement: '작은 열쇠',
    locations: {
      convenience_store: {
        name: '편의점',
        type: LocationType.FACILITY,
        description: '간단한 물품을 살 수 있는 편의점입니다.',
        isLocked: false,
        interactions: [
          {
            name: '물건 둘러보기',
            scripts: [
              '진열대에 과자와 음료수가 있습니다.',
              '카운터 아래에서 무언가 반짝입니다.',
              '반짝이는 것은 열쇠였습니다.'
            ],
            givesItem: '편의점 열쇠'
          }
        ]
      },
      movie_theater: {
        name: '영화관',
        type: LocationType.FACILITY,
        description: '작은 영화관입니다.',
        isLocked: false,
        interactions: [
          {
            name: '상영관 확인하기',
            scripts: [
              '상영관은 텅 비어있습니다.',
              '스크린에 흰 노이즈만 보입니다.',
              '갑자기 스크린에 무언가 비칩니다.'
            ]
          }
        ]
      },
      auditorium: {
        name: '강당',
        type: LocationType.FACILITY,
        description: '큰 강당입니다.',
        isLocked: true,
        unlockRequirement: '5층 갑판 열쇠',
        interactions: [
          {
            name: '강당 살펴보기',
            scripts: [
              '강당은 텅 비어있습니다.',
              '무대 위에 무언가 있습니다.',
              '중요해 보이는 서류를 발견했습니다.'
            ],
            givesItem: '비밀 서류'
          }
        ]
      },
      deck5: {
        name: '5층 갑판',
        type: LocationType.DECK,
        description: '5층의 갑판입니다.',
        isLocked: false,
        interactions: [
          {
            name: '주변 수색하기',
            scripts: [
              '갑판은 바람이 세게 붑니다.',
              '구석에 무언가가 있습니다.',
              '강당으로 들어가는 열쇠를 발견했습니다.'
            ],
            givesItem: '5층 갑판 열쇠'
          }
        ]
      }
    }
  },
  '4': {
    name: '주차장',
    description: '차량이 주차되어 있는 층입니다.',
    isLocked: true,
    unlockRequirement: '비상 열쇠',
    locations: {
      parking_area: {
        name: '주차구역',
        type: LocationType.FACILITY,
        description: '여러 대의 차가 주차되어 있습니다.',
        isLocked: false,
        interactions: [
          {
            name: '차량 확인하기',
            scripts: [
              '대부분의 차가 비어있습니다.',
              '한 차량의 트렁크가 열려있습니다.',
              '트렁크 안에서 의문의 가방을 발견했습니다.'
            ],
            givesItem: '의문의 가방'
          }
        ]
      }
    }
  },
  '3': {
    name: '미로층',
    description: '미스터리한 미로가 있는 층입니다.',
    isLocked: true,
    unlockRequirement: '미로 열쇠',
    locations: {
      maze_entrance: {
        name: '미로 입구',
        type: LocationType.MAZE,
        description: '복잡한 미로의 입구입니다.',
        isLocked: false,
        interactions: [
          {
            name: '미로 들어가기',
            scripts: [
              '미로는 어둡고 음산합니다.',
              '벽에 이상한 표시들이 있습니다.',
              '미로 속에서 이상한 소리가 들립니다.'
            ]
          }
        ]
      }
    }
  }
};

export default floorData;