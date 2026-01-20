class TitleScene {
    constructor(app, gameCore, uiManager) {
        this.app = app;
        this.gameCore = gameCore;
        this.uiManager = uiManager;
        this.container = new PIXI.Container();
        this.type = 'title';
        
        this.titleText = null;
        this.subtitleText = null;
        this.menuButtons = [];
        this.background = null;
        this.particles = [];
    }
    
    init(params = {}) {
        this.container.removeChildren();
        this.createBackground();
        this.createTitle();
        this.createMenu();
        this.createParticles();
        
        // 播放背景音乐
        this.playBackgroundMusic();
    }
    
    createBackground() {
        // 创建渐变背景
        const bg = new PIXI.Graphics();
        const gradient = [
            { offset: 0, color: 0x1A1A2E },
            { offset: 0.5, color: 0x16213E },
            { offset: 1, color: 0x0F3460 }
        ];
        
        for (let i = 0; i < gradient.length - 1; i++) {
            const start = gradient[i];
            const end = gradient[i + 1];
            
            bg.beginFill(start.color);
            bg.drawRect(0, 
                this.app.screen.height * start.offset,
                this.app.screen.width,
                this.app.screen.height * (end.offset - start.offset));
            bg.endFill();
        }
        
        this.container.addChild(bg);
        this.background = bg;
        
        // 添加星空效果
        this.createStars();
    }
    
    createStars() {
        for (let i = 0; i < 100; i++) {
            const star = new PIXI.Graphics();
            const size = Math.random() * 2 + 0.5;
            const x = Math.random() * this.app.screen.width;
            const y = Math.random() * this.app.screen.height;
            const alpha = Math.random() * 0.5 + 0.3;
            
            star.beginFill(0xFFFFFF, alpha);
            star.drawCircle(0, 0, size);
            star.endFill();
            star.position.set(x, y);
            
            this.container.addChild(star);
            
            // 添加闪烁动画
            const twinkle = () => {
                const targetAlpha = Math.random() * 0.5 + 0.3;
                const duration = Math.random() * 1000 + 500;
                
                star.tween = {
                    startAlpha: star.alpha,
                    targetAlpha,
                    duration,
                    startTime: Date.now()
                };
            };
            
            twinkle();
            setInterval(twinkle, Math.random() * 3000 + 2000);
        }
    }
    
    createTitle() {
        // 主标题
        this.titleText = new PIXI.Text('二十七班的时间循环', {
            fontFamily: 'Ma Shan Zheng',
            fontSize: 72,
            fill: 0x6A9EE5,
            align: 'center',
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowBlur: 10,
            dropShadowDistance: 0,
            dropShadowAlpha: 0.8
        });
        
        this.titleText.anchor.set(0.5);
        this.titleText.position.set(
            this.app.screen.width / 2,
            this.app.screen.height * 0.25
        );
        
        this.container.addChild(this.titleText);
        
        // 副标题
        this.subtitleText = new PIXI.Text('时间、记忆与命运的交织', {
            fontFamily: 'Noto Sans SC',
            fontSize: 28,
            fill: 0xAAAAAA,
            align: 'center',
            fontStyle: 'italic'
        });
        
        this.subtitleText.anchor.set(0.5);
        this.subtitleText.position.set(
            this.app.screen.width / 2,
            this.titleText.y + 80
        );
        
        this.container.addChild(this.subtitleText);
        
        // 添加标题闪烁效果
        this.app.ticker.add(() => {
            const time = Date.now() / 1000;
            this.titleText.alpha = 0.8 + Math.sin(time * 2) * 0.2;
        });
    }
    
    createMenu() {
        const menuItems = [
            { text: '开始新的循环', action: 'newGame' },
            { text: '继续游戏', action: 'continue' },
            { text: '游戏设置', action: 'settings' },
            { text: '制作人员', action: 'credits' },
            { text: '退出游戏', action: 'exit' }
        ];
        
        const startY = this.app.screen.height * 0.5;
        const spacing = 70;
        
        menuItems.forEach((item, index) => {
            const button = this.createMenuButton(
                item.text,
                this.app.screen.width / 2,
                startY + index * spacing,
                item.action
            );
            
            this.container.addChild(button);
            this.menuButtons.push(button);
        });
    }
    
    createMenuButton(text, x, y, action) {
        const button = new PIXI.Container();
        button.position.set(x, y);
        
        // 按钮背景
        const bg = new PIXI.Graphics();
        bg.beginFill(0x2D3047, 0.8);
        bg.lineStyle(2, 0x4A4E8C);
        bg.drawRoundedRect(-150, -25, 300, 50, 10);
        bg.endFill();
        
        // 按钮文本
        const buttonText = new PIXI.Text(text, {
            fontFamily: 'Noto Sans SC',
            fontSize: 28,
            fill: 0xFFFFFF,
            align: 'center'
        });
        buttonText.anchor.set(0.5);
        
        button.addChild(bg);
        button.addChild(buttonText);
        
        // 交互效果
        button.interactive = true;
        button.cursor = 'pointer';
        
        button.on('pointerover', () => {
            bg.clear();
            bg.beginFill(0x3A3E6C, 0.9);
            bg.lineStyle(3, 0x6A9EE5);
            bg.drawRoundedRect(-150, -25, 300, 50, 10);
            bg.endFill();
            
            buttonText.style.fill = 0x6A9EE5;
            button.scale.set(1.05);
        });
        
        button.on('pointerout', () => {
            bg.clear();
            bg.beginFill(0x2D3047, 0.8);
            bg.lineStyle(2, 0x4A4E8C);
            bg.drawRoundedRect(-150, -25, 300, 50, 10);
            bg.endFill();
            
            buttonText.style.fill = 0xFFFFFF;
            button.scale.set(1.0);
        });
        
        button.on('pointerdown', () => {
            this.handleMenuAction(action);
        });
        
        return button;
    }
    
    handleMenuAction(action) {
        switch (action) {
            case 'newGame':
                this.showNameInput();
                break;
                
            case 'continue':
                if (this.gameCore.continueGame()) {
                    // 切换到游戏场景
                    this.gameCore.switchScene('game', { 
                        day: this.gameCore.getGameData().currentDay 
                    });
                } else {
                    this.uiManager.showToast('没有找到存档', 2000);
                }
                break;
                
            case 'settings':
                this.showSettings();
                break;
                
            case 'credits':
                this.showCredits();
                break;
                
            case 'exit':
                if (confirm('确定要退出游戏吗？')) {
                    window.close();
                }
                break;
        }
    }
    
    showNameInput() {
        // 隐藏游戏界面，显示HTML模态框
        document.getElementById('name-modal').style.display = 'flex';
        
        const nameInput = document.getElementById('player-name');
        nameInput.focus();
        
        // 处理确认按钮
        document.getElementById('confirm-name').onclick = () => {
            const playerName = nameInput.value.trim();
            
            if (playerName.length >= 2 && playerName.length <= 10) {
                // 隐藏姓名输入框
                document.getElementById('name-modal').style.display = 'none';
                
                // 显示性别选择
                this.showGenderSelect(playerName);
            } else {
                alert('请输入2-10个字符的名字');
            }
        };
        
        // 允许按回车确认
        nameInput.onkeypress = (e) => {
            if (e.key === 'Enter') {
                document.getElementById('confirm-name').click();
            }
        };
    }
    
    showGenderSelect(playerName) {
        document.getElementById('gender-modal').style.display = 'flex';
        
        const genderButtons = document.querySelectorAll('.gender-btn');
        
        genderButtons.forEach(button => {
            button.onclick = () => {
                const gender = button.dataset.gender;
                document.getElementById('gender-modal').style.display = 'none';
                
                // 开始新游戏
                this.gameCore.startNewGame(playerName, gender);
            };
        });
    }
    
    showSettings() {
        // 创建设置界面
        const settingsContainer = new PIXI.Container();
        settingsContainer.zIndex = 100;
        
        // 背景
        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.8);
        bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        bg.endFill();
        settingsContainer.addChild(bg);
        
        // 标题
        const title = new PIXI.Text('游戏设置', {
            fontFamily: 'Ma Shan Zheng',
            fontSize: 48,
            fill: 0x6A9EE5,
            align: 'center'
        });
        title.anchor.set(0.5);
        title.position.set(this.app.screen.width / 2, 100);
        settingsContainer.addChild(title);
        
        // 音量设置
        const volumeText = new PIXI.Text('音量:', {
            fontFamily: 'Noto Sans SC',
            fontSize: 28,
            fill: 0xFFFFFF
        });
        volumeText.position.set(200, 200);
        settingsContainer.addChild(volumeText);
        
        // 返回按钮
        const backButton = this.createMenuButton(
            '返回标题',
            this.app.screen.width / 2,
            500,
            'backToTitle'
        );
        backButton.on('pointerdown', () => {
            this.app.stage.removeChild(settingsContainer);
        });
        settingsContainer.addChild(backButton);
        
        this.app.stage.addChild(settingsContainer);
    }
    
    showCredits() {
        // 创建制作人员界面
        const creditsContainer = new PIXI.Container();
        creditsContainer.zIndex = 100;
        
        // 背景
        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.9);
        bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        bg.endFill();
        creditsContainer.addChild(bg);
        
        // 标题
        const title = new PIXI.Text('制作人员', {
            fontFamily: 'Ma Shan Zheng',
            fontSize: 48,
            fill: 0x6A9EE5,
            align: 'center'
        });
        title.anchor.set(0.5);
        title.position.set(this.app.screen.width / 2, 100);
        creditsContainer.addChild(title);
        
        // 制作人员列表
        const credits = [
            '制作人: 模拟战争工作室',
            '策划: 爱姜TV董事会',
            '程序: 侯子鸣',
            '美术: 还没有',
            '音乐: 也没有',
            '特别感谢: 所有参与内部测试玩家'
        ];
        
        credits.forEach((text, index) => {
            const creditText = new PIXI.Text(text, {
                fontFamily: 'Noto Sans SC',
                fontSize: 28,
                fill: 0xFFFFFF,
                align: 'center'
            });
            creditText.anchor.set(0.5);
            creditText.position.set(
                this.app.screen.width / 2,
                200 + index * 50
            );
            creditsContainer.addChild(creditText);
        });
        
        // 返回按钮
        const backButton = this.createMenuButton(
            '返回标题',
            this.app.screen.width / 2,
            500,
            'backToTitle'
        );
        backButton.on('pointerdown', () => {
            this.app.stage.removeChild(creditsContainer);
        });
        creditsContainer.addChild(backButton);
        
        this.app.stage.addChild(creditsContainer);
    }
    
    createParticles() {
        // 创建背景粒子效果
        for (let i = 0; i < 50; i++) {
            const particle = new PIXI.Graphics();
            const size = Math.random() * 3 + 1;
            const x = Math.random() * this.app.screen.width;
            const y = Math.random() * this.app.screen.height;
            const speed = Math.random() * 0.5 + 0.1;
            const direction = Math.random() * Math.PI * 2;
            
            particle.beginFill(0x6A9EE5, Math.random() * 0.3 + 0.1);
            particle.drawCircle(0, 0, size);
            particle.endFill();
            particle.position.set(x, y);
            
            this.container.addChild(particle);
            this.particles.push({
                graphics: particle,
                speed,
                direction,
                originalX: x,
                originalY: y
            });
        }
    }
    
    playBackgroundMusic() {
        // 这里可以添加背景音乐
        // 实际开发中需要加载音频文件
        console.log('播放背景音乐');
    }
    
    update(delta) {
        // 更新粒子动画
        const time = Date.now() / 1000;
        
        this.particles.forEach(particle => {
            const { graphics, speed, direction, originalX, originalY } = particle;
            
            // 让粒子缓慢移动
            const offsetX = Math.sin(time * speed + direction) * 50;
            const offsetY = Math.cos(time * speed * 0.5 + direction) * 30;
            
            graphics.x = originalX + offsetX;
            graphics.y = originalY + offsetY;
            
            // 轻微闪烁
            graphics.alpha = 0.5 + Math.sin(time * 2 + direction) * 0.3;
        });
    }
    
    destroy() {
        // 清理资源
        this.container.removeChildren();
        this.particles = [];
        this.menuButtons = [];
        
        // 移除事件监听器
        const nameInput = document.getElementById('player-name');
        if (nameInput) {
            nameInput.onkeypress = null;
        }
        
        const confirmBtn = document.getElementById('confirm-name');
        if (confirmBtn) {
            confirmBtn.onclick = null;
        }
        
        const genderButtons = document.querySelectorAll('.gender-btn');
        genderButtons.forEach(button => {
            button.onclick = null;
        });
    }
}