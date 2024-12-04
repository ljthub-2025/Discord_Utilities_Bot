@REM if yarn is not installed, install it
if not command -v yarn > /dev/null 2>&1
    npm install -g yarn
endif

@REM install dependencies
yarn install

@REM start the server
yarn start
