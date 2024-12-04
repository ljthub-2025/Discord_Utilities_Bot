#!/bin/bash

# 檢查是否正在運行
if ! pgrep -f "Update_Listener.py" > /dev/null; then
    echo "Update Listener 未在運行"
    exit 0
fi

# 終止程序
echo "正在停止 Update Listener..."
pkill -f "Update_Listener.py"

# 確認程序已停止
sleep 2
if pgrep -f "Update_Listener.py" > /dev/null; then
    echo "Update Listener 停止失敗"
    exit 1
else
    echo "Update Listener 已成功停止"
fi 