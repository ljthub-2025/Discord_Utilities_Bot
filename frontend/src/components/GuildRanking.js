import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { db } from '../firebase';

const GuildRanking = () => {
  const { guildId, db_root } = useParams();
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuildRankings = async () => {
      try {
        console.log(`Loading guild rankings for ${guildId} in ${db_root} mode`);
        setLoading(true);
        const guildRef = ref(db, `${db_root}/guilds/${guildId}/users`);
        const snapshot = await get(guildRef);
        
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          // 轉換成陣列並排序
          const rankingArray = Object.entries(usersData)
            .map(([id, data]) => ({
              id,
              level: data.level || 1,
              exp: data.xp || 0,
              name: data.display_name || id, // 如果沒有名字就顯示 ID
              avatar: data.avatar || null
            }))
            .sort((a, b) => b.level - a.level || b.exp - a.exp);
          
          setRankings(rankingArray);
        } else {
          setRankings([]);
        }
        setLoading(false);
      } catch (err) {
        setError('無法載入公會排名資料');
        console.error('Error fetching guild rankings:', err);
        setLoading(false);
      }
    };

    fetchGuildRankings();
  }, [guildId, db_root]);

  return (
    <div className="guild-ranking container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          <span className="mr-2">🏰</span>
          公會 {guildId} 等級排名
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <div className="ranking-list space-y-4">
            {rankings.map((member, index) => (
              <div 
                key={member.id} 
                className={`ranking-item flex items-center p-4 rounded-lg ${
                  index < 3 ? 'bg-gradient-to-r from-gray-50 to-gray-100' : 'bg-gray-50'
                } hover:shadow-md transition-all duration-200`}
              >
                <div className={`rank-badge w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                  index === 0 ? 'bg-yellow-400 text-white' :
                  index === 1 ? 'bg-gray-300 text-white' :
                  index === 2 ? 'bg-amber-600 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                
                <div className="flex-shrink-0 mx-4">
                  {member.avatar ? (
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-xl text-white">{member.name[0]}</span>
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <div className="font-semibold text-gray-800">{member.name}</div>
                  <div className="text-sm text-gray-500">
                    Level {member.level} • {member.exp.toLocaleString()} EXP
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuildRanking;