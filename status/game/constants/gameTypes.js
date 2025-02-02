// constants/gameTypes.js
export const LocationType = {
    ROOM: 'room',         // 방
    FACILITY: 'facility', // 시설
    STORAGE: 'storage',   // 창고
    OBSERVATION: 'observation', // 관찰 공간
    DECK: 'deck',        // 갑판
    MAZE: 'maze'         // 미로
  };
  
  export const InteractionType = {
    EXAMINE: 'examine',   // 조사하기
    USE: 'use',          // 사용하기
    COMBINE: 'combine',   // 조합하기
    TALK: 'talk'         // 대화하기
  };
  
  export const MessageType = {
    INFO: 'info',       // 일반 정보
    SUCCESS: 'success', // 성공
    WARNING: 'warning', // 경고
    ERROR: 'error'      // 오류
  };