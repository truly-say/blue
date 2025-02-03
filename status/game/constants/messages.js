// constants/messages.js
export const GameMessages = {
    // 일반 메시지
    WELCOME: '크루즈 탐험을 시작합니다.',
    GAME_LOADED: '게임이 로드되었습니다.',
    SAVE_SUCCESS: '게임이 저장되었습니다.',
    
    // 이동 관련
    FLOOR_MOVE: '{floor}층으로 이동했습니다.',
    FLOOR_LOCKED: '이 층에 접근하기 위한 조건을 충족하지 못했습니다.',
    LOCATION_MOVE: '{location}에 도착했습니다.',
    LOCATION_LOCKED: '이 장소는 잠겨있습니다.',
    
    // 아이템 관련
    INVENTORY_FULL: '인벤토리가 가득 찼습니다!',
    ITEM_ACQUIRED: '{item}을(를) 획득했습니다.',
    ITEM_USED: '{item}을(를) 사용했습니다.',
    ITEM_DROPPED: '{item}을(를) 버렸습니다.',
    ITEM_REQUIRED: '{item}이(가) 필요합니다.',
    
    // 상호작용 관련
    INTERACTION_SUCCESS: '상호작용에 성공했습니다.',
    INTERACTION_FAILED: '상호작용에 실패했습니다.',
    LOCATION_UNLOCKED: '{location}이(가) 해금되었습니다!',
  
    // 메시지 포맷팅 헬퍼
    format(key, replacements = {}) {
      let message = this[key];
      Object.entries(replacements).forEach(([key, value]) => {
        message = message.replace(`{${key}}`, value);
      });
      return message;
    }
  };