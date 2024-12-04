import requests
import time
from datetime import datetime
import os
import json
import sys
from tqdm import tqdm   
import platform

def log(message):
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[Update Listener][{current_time}] {message}")
    # 將訊息寫入 log 文件
    with open('Update_Listener.log', 'a', encoding='utf-8') as f:
        f.write(f"[{current_time}] {message}\n")
    
def update_git_repo():
    try:
        commands = [
            "git pull",
            "pip install -r requirements.txt",
            "python Update_Listener.py",
            "cd backend",
        ]
        
        if platform.system() == "Windows":
            commands.append("start.bat")
        else:
            commands.append("start.sh")
        
        for command in commands:
            log(f"執行命令: {command}")
            if command == "python Update_Listener.py":
                python_path = sys.executable
                os.execv(python_path, [python_path, "Update_Listener.py"])
            else:
                result = os.system(command)
                if result != 0:
                    log(f"命令執行失敗: {command}")
                    return False
        return True
    except Exception as e:
        log(f"更新過程發生錯誤: {str(e)}")
        return False

def load_env():
    try:
        if not os.path.exists('.env'):
            log("找不到 .env 文件，將創建新文件")
            token = input("請輸入 GitHub API Token: ")
            with open('.env', 'w') as f:
                f.write(f'GITHUB_API_TOKEN={token}')
            os.environ['GITHUB_API_TOKEN'] = token
            return {}
            
        env_data = {}
        with open('.env', 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    key, value = line.split('=', 1)
                    env_data[key.strip()] = value.strip()
                    os.environ[key.strip()] = value.strip()
        return env_data
    except Exception as e:
        log(f"讀取 .env 文件時發生錯誤: {str(e)}")
        return {}
    
def write_env(key, value):
    try:
        # 讀取現有的環境變量
        env_vars = {}
        if os.path.exists('.env'):
            with open('.env', 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#'):
                        try:
                            k, v = line.split('=', 1)
                            env_vars[k.strip()] = v.strip()
                        except ValueError:
                            continue

        # 更新或添加新的鍵值對
        env_vars[key] = value

        # 重寫整個文件
        with open('.env', 'w', encoding='utf-8') as f:
            for k, v in env_vars.items():
                f.write(f"{k}={v}\n")

    except Exception as e:
        log(f"寫入 .env 文件時發生錯誤: {str(e)}")

def main(): 
    load_env()
    
    while True:
        try:
            update = False
            url = "https://api.github.com/repos/ljthub-2025/Discord_Utilities_Bot/activity"
            headers = {'Accept': 'application/vnd.github+json', 'Authorization': f'Bearer {os.getenv("GITHUB_API_TOKEN")}'}
            response = requests.get(url, headers=headers, params={'direction': 'desc', 'per_page': 1})
            response.raise_for_status()
            
            latest_commit = response.json()[0]
            latest_commit_timestamp = datetime.strptime(latest_commit['timestamp'], '%Y-%m-%dT%H:%M:%SZ')
            
            # 直接從環境變量獲取舊的時間戳，而不是重新載入文件
            old_timestamp = os.getenv('LATEST_COMMIT_TIMESTAMP')
            
            if old_timestamp:
                old_commit_timestamp = datetime.strptime(old_timestamp, '%Y-%m-%dT%H:%M:%SZ')
                if latest_commit_timestamp > old_commit_timestamp:
                    log("檢測到新的 commit")
                    update = True   
                else:
                    log("沒有新的 commit")
            else:
                log("首次運行，記錄當前 commit")
                update = False  # 確保首次運行不會觸發更新
            
            # 更新環境變量和文件
            print(latest_commit_timestamp)
            os.environ['LATEST_COMMIT_TIMESTAMP'] = latest_commit_timestamp.strftime("%Y-%m-%dT%H:%M:%SZ")
            write_env('LATEST_COMMIT_TIMESTAMP', latest_commit_timestamp.strftime("%Y-%m-%dT%H:%M:%SZ"))
                
            if update:
                if update_git_repo():
                    log("更新成功完成")
                    sys.exit(0)
                else:
                    log("更新失敗")
                    sys.exit(1)
            
        except requests.exceptions.RequestException as e:
            log(f"API 請求失敗: {str(e)}")
        except Exception as e:
            log(f"發生未預期的錯誤: {str(e)}")
        
        for _ in tqdm(range(60), desc="等待更新", unit="秒"):
            time.sleep(1)


if __name__ == "__main__":
    main() 