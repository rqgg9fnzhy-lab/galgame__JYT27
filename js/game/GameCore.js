class GameCore {
    constructor(app, gameData) {
        this.app = app;
        this.gameData = gameData;
        this.currentScene = null;
        this.scenes = {};
        this.isLoading = false;
        
        // 对话系统
        this.currentDialogues = [];
        this.currentChoices = [];
        this.dialogueIndex = 0;
        this.typingTimer = null;
        
        // 键盘输入
        this.keys = {};
        this.setupInput();
    }
    
    // 设置输入处理
    setupInput() {
        // 键盘事件
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            // 处理游戏快捷键
            switch (e.key) {
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    this.handleContinue();
                    break;
                    
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                    const index = parseInt(e.key) - 1;
                    this.handleChoiceSelect(index);
                    break;
                    
                case 'Escape':
                    this.showPauseMenu();
                    break;
                    
                case 's':
                case 'S':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.gameData.save();
                        this.showMessage('游戏已保存');
                    }
                    break;
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }
    
    // 注册场景
    registerScene(name, scene) {
        this.scenes[name] = scene;
    }
    
    // 切换场景
    switchScene(name, params = {}) {
        if (this.currentScene) {
            this.currentScene.destroy();
            this.app.stage.removeChild(this.currentScene.container);
        }
        
        const scene = this.scenes[name];
        if (scene) {
            this.currentScene = scene;
            scene.init(params);
            this.app.stage.addChild(scene.container);
            this.gameData.currentState = name;
        }
    }
    
    // 处理继续
    handleContinue() {
        if (!this.currentScene) return;
        
        if (this.currentScene.type === 'dialogue') {
            const dialogueScene = this.currentScene;
            
            if (dialogueScene.isTyping) {
                dialogueScene.skipTyping();
            } else {
                dialogueScene.nextDialogue();
            }
        }
    }
    
    // 处理选择
    handleChoiceSelect(index) {
        if (!this.currentScene || this.currentScene.type !== 'dialogue') return;
        
        const dialogueScene = this.currentScene;
        if (dialogueScene.hasChoices() && index >= 0 && index < dialogueScene.choices.length) {
            dialogueScene.selectChoice(index);
        }
    }
    
    // 显示暂停菜单
    showPauseMenu() {
        // 创建暂停菜单UI
        const menu = new PIXI.Container();
        menu.zIndex = 1000;
        
        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.8);
        bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        bg.endFill();
        menu.addChild(bg);
        
        const title = new PIXI.Text('游戏暂停', {
            fontFamily: 'Arial',
            fontSize: 48,
            fill: 0xFFFFFF,
            align: 'center'
        });
        title.anchor.set(0.5);
        title.position.set(this.app.screen.width / 2, 200);
        menu.addChild(title);
        
        // 创建菜单选项
        const options = ['继续游戏', '保存游戏', '读取游戏', '返回标题'];
        const optionHeight = 60;
        const startY = 300;
        
        options.forEach((text, index) => {
            const option = new PIXI.Text(text, {
                fontFamily: 'Arial',
                fontSize: 32,
                fill: 0xFFFFFF,
                align: 'center'
            });
            option.anchor.set(0.5);
            option.position.set(this.app.screen.width / 2, startY + index * optionHeight);
            option.interactive = true;
            option.cursor = 'pointer';
            
            option.on('pointerover', () => {
                option.style.fill = 0x6A9EE5;
            });
            
            option.on('pointerout', () => {
                option.style.fill = 0xFFFFFF;
            });
            
            option.on('pointerdown', () => {
                switch (index) {
                    case 0: // 继续游戏
                        this.app.stage.removeChild(menu);
                        break;
                    case 1: // 保存游戏
                        if (this.gameData.save()) {
                            this.showMessage('游戏已保存');
                        }
                        break;
                    case 2: // 读取游戏
                        if (this.gameData.load()) {
                            this.showMessage('游戏已读取');
                            this.switchScene('game', { day: this.gameData.currentDay });
                        }
                        break;
                    case 3: // 返回标题
                        this.switchScene('title');
                        break;
                }
                
                this.app.stage.removeChild(menu);
            });
            
            menu.addChild(option);
        });
        
        this.app.stage.addChild(menu);
    }
    
    // 显示消息
    showMessage(text, duration = 2000) {
        const message = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xFFFFFF,
            align: 'center'
        });
        message.anchor.set(0.5);
        message.position.set(this.app.screen.width / 2, 50);
        message.zIndex = 1001;
        
        this.app.stage.addChild(message);
        
        setTimeout(() => {
            this.app.stage.removeChild(message);
        }, duration);
    }
    
    // 更新游戏逻辑
    update(delta) {
        if (this.currentScene) {
            this.currentScene.update(delta);
        }
        
        // 检查结局条件
        if (this.gameData.currentState === 'game' && 
            this.gameData.currentDay >= 3 && 
            !this.isLoading) {
            const ending = this.gameData.determineEnding();
            if (ending && this.gameData.currentState !== `ending_${ending}`) {
                this.switchScene(`ending_${ending}`);
            }
        }
    }
    
    // 开始新游戏
    startNewGame(playerName, playerGender) {
        this.gameData.reset();
        this.gameData.playerName = playerName;
        this.gameData.playerGender = playerGender;
        
        if (playerGender === 'male') {
            this.gameData.modifyCourage(5);
        } else {
            this.gameData.modifyIntuition(5);
        }
        
        this.switchScene('game', { day: 1 });
    }
    
    // 继续游戏
    continueGame() {
        if (this.gameData.load()) {
            this.switchScene('game', { day: this.gameData.currentDay });
            return true;
        }
        return false;
    }
    
    // 获取当前游戏数据
    getGameData() {
        return this.gameData;
    }
}