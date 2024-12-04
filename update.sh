#!/bin/bash

# 檢查是否已經運行
if pgrep -f "Update_Listener.py" > /dev/null; then
    echo "Update Listener 已在運行中"
    exit 1
fi

# Git 操作
echo "開始更新代碼..."
git fetch
git stash --include-untracked
if ! git pull; then
    echo "Git pull 失敗"
    exit 1
fi
git stash pop || true

# 安裝依賴
echo "更新 Python 依賴..."
if ! pip install -r requirements.txt; then
    echo "pip install 失敗"
    exit 1
fi

# 啟動 Update Listener
echo "啟動 Update Listener..."
nohup python Update_Listener.py > "Update_Listener.log" 2>&1 &

# 確認程序已啟動
sleep 2
if pgrep -f "Update_Listener.py" > /dev/null; then
    echo "Update Listener 已成功在背景啟動"
else
    echo "Update Listener 啟動失敗"
    exit 1
fi