const { ref, get, update } = require("firebase/database");
const { db } = require('./firebase.js');
const { db_root } = require('../config.json');

const nextLevelXP = (level) => {
    return Math.floor(100 * Math.pow(level, 1.5));
}

const UpdateXP = async (userRef) => {
  // 獲取當前用戶數據
  const userData = (await get(userRef)).val();
  
  const currentXP = userData.xp || 0;
  const currentLevel = userData.level || 1;
  
  // 檢查是否可以升級（使用while循環來處理多次升級）
  let newLevel = currentLevel;
  let remainingXP = currentXP;
  let leveledUp = false;
  
  while (remainingXP >= nextLevelXP(newLevel)) {
    newLevel += 1;
    remainingXP -= nextLevelXP(newLevel - 1);
    leveledUp = true;
  }
  
  // 更新用戶數據
  await update(userRef, {
    xp: remainingXP,
    level: newLevel,
    lastUpdated: new Date()
  });
  
  // 返回升級相關信息
  return {
    leveledUp,
    oldLevel: currentLevel,
    newLevel,
    currentXP: remainingXP,
    nextLevelXP: nextLevelXP(newLevel)
  };
};

const addXpByVoiceDuration = async (userRef, duration) => {
    const userData = (await get(userRef)).val();
    const currentXP = userData.xp || 0;
    const currentLevel = userData.level || 1;

    const addXP = Math.floor(duration / 1000);
    
    // 先更新 XP
    await update(userRef, {
        xp: currentXP + addXP,
    });
    
    // 調用 UpdateXP 來檢查和處理升級
    return await UpdateXP(userRef);
}

const resetXp = async (guildId) => {
    const guildRef = ref(db, `${db_root}/guilds/${guildId}`);
    const guildData = (await get(guildRef)).val();
    // 使用 Object.keys() 來遍歷用戶
    const users = guildData.users || {};
    for (const userId of Object.keys(users)) {
        const userRef = ref(db, `${db_root}/guilds/${guildId}/users/${userId}`);
        await update(userRef, {
            xp: 0,
            level: 1
        });
    }
}

const getUserLevel = async (guildId, userId) => {
    const guildRef = ref(db, `${db_root}/guilds/${guildId}`);
    const guildData = (await get(guildRef)).val();
    const userData = guildData.users[userId] || {};
    return userData.level || 1;
}

const getUserXP = async (guildId, userId) => {
    const guildRef = ref(db, `${db_root}/guilds/${guildId}`);
    const guildData = (await get(guildRef)).val();
    const userData = guildData.users[userId] || {};
    return userData.xp || 0;
}

module.exports = {
  UpdateXP,
  addXpByVoiceDuration,
  resetXp,
  getUserLevel,
  getUserXP,
  nextLevelXP
}