// 游戏主程序
// 导入游戏数据类
import { GameData } from './game/GameData.js';
// 导入游戏核心类
import { GameCore } from './game/GameCore.js';
// 导入UI管理器类
import { UIManager } from './game/UIManager.js';
class TimeLoopGame {
    constructor() {
        this.app = null;
        this.gameData = null;
        this.gameCore = null;
        this.uiManager = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    async init() {
        try {
            // 显示加载屏幕
            this.showLoadingScreen();
            
            // 初始化Pixi应用
            await this.initPixiApp();
            
            // 初始化游戏数据
            await this.initGameData();
            
            // 初始化游戏核心
            await this.initGameCore();
            
            // 初始化UI管理器
            await this.initUIManager();
            
            // 注册场景
            await this.registerScenes();
            
            // 隐藏加载屏幕
            this.hideLoadingScreen();
            
            // 启动游戏
            this.startGame();
            
            this.isInitialized = true;
            console.log('游戏初始化完成');
            
        } catch (error) {
            console.error('游戏初始化失败:', error);
            this.showErrorScreen(error);
        }
    }
    
    showLoadingScreen() {
        document.getElementById('loading-overlay').style.display = 'flex';
        document.getElementById('loading-text').textContent = '加载游戏资源...';
    }
    
    hideLoadingScreen() {
        document.getElementById('loading-overlay').style.display = 'none';
    }
    
    showErrorScreen(error) {
        document.getElementById('loading-text').textContent = `加载失败: ${error.message}`;
        document.getElementById('loading-text').style.color = '#FF4444';
        
        // 添加重试按钮
        const loadingContent = document.querySelector('.loading-content');
        const retryButton = document.createElement('button');
        retryButton.textContent = '重试';
        retryButton.style.marginTop = '20px';
        retryButton.onclick = () => {
            window.location.reload();
        };
        loadingContent.appendChild(retryButton);
    }
    
    async initPixiApp() {
        return new Promise((resolve) => {
            // 获取游戏容器
            const gameContainer = document.getElementById('game-container');
            
            // 创建Pixi应用
            this.app = new PIXI.Application({
                width: 1024,
                height: 768,
                backgroundColor: 0x1A1A2E,
                resolution: window.devicePixelRatio || 1,
                autoDensity: true,
                resizeTo: gameContainer
            });
            
            // 添加到DOM
            gameContainer.appendChild(this.app.view);
            
            // 处理窗口大小变化
            window.addEventListener('resize', () => {
                this.app.renderer.resize(gameContainer.clientWidth, gameContainer.clientHeight);
            });
            
            resolve();
        });
    }
    
    async initGameData() {
        this.gameData = new GameData();
        
        // 尝试加载存档
        if (!this.gameData.load()) {
            console.log('没有找到存档，开始新游戏');
        }
    }
    
    async initGameCore() {
        this.gameCore = new GameCore(this.app, this.gameData);
    }
    
    async initUIManager() {
        this.uiManager = new UIManager(this.app, this.gameData);
    }
    
    async registerScenes() {
        // 创建场景实例
        const titleScene = new TitleScene(this.app, this.gameCore, this.uiManager);
        const gameScene = new GameScene(this.app, this.gameCore, this.uiManager);
        const endingScene = new EndingScene(this.app, this.gameCore, this.uiManager);
        
        // 注册到游戏核心
        this.gameCore.registerScene('title', titleScene);
        this.gameCore.registerScene('game', gameScene);
        this.gameCore.registerScene('ending_romantic', endingScene);
        this.gameCore.registerScene('ending_tragic', endingScene);
        this.gameCore.registerScene('ending_escape', endingScene);
        this.gameCore.registerScene('ending_eternal', endingScene);
        this.gameCore.registerScene('ending_nightmare', endingScene);
    }
    
    startGame() {
        // 根据当前游戏状态切换到相应场景
        const currentState = this.gameData.currentState;
        
        if (currentState.startsWith('ending_')) {
            this.gameCore.switchScene(currentState);
        } else if (currentState === 'game') {
            this.gameCore.switchScene('game', { day: this.gameData.currentDay });
        } else {
            this.gameCore.switchScene('title');
        }
        
        // 启动游戏循环
        this.app.ticker.add((delta) => {
            if (this.gameCore) {
                this.gameCore.update(delta);
            }
            
            // 更新UI
            if (this.uiManager) {
                // UI更新逻辑
            }
        });
    }
}

// 游戏启动
window.addEventListener('DOMContentLoaded', () => {
    // 隐藏加载提示
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // 创建游戏实例
    const game = new TimeLoopGame();
    
    // 全局访问（用于调试）
    window.game = game;
    
    // 处理页面可见性变化
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // 页面隐藏时自动保存
            if (game.gameData) {
                game.gameData.save();
            }
        }
    });
    
    // 页面卸载前保存
    window.addEventListener('beforeunload', () => {
        if (game.gameData) {
            game.gameData.save();
        }
    });
});