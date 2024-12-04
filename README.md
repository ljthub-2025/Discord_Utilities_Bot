# Discord_Utilities_Bot

## 目標
- 在 Discord 用戶進入和離開語音頻道時，傳送訊息到指定頻道
- 在 GitHub 有新 commit 時，自動更新 前端 和 後端

## 自動更新
```bash
git clone https://github.com/ljthub-2025/Discord_Utilities_Bot.git
cd Discord_Utilities_Bot
# Use virtual environment
python -m venv venv
source venv/bin/activate
# Use Conda
conda create -n discord_utilities_bot python=3.10 -y
conda activate discord_utilities_bot
pip install -r requirements.txt
python Update_Listener.py
```
