class EndingScene {
    constructor(app, gameCore, uiManager) {
        this.app = app;
        this.gameCore = gameCore;
        this.uiManager = uiManager;
        this.gameData = gameCore.getGameData();
        this.container = new PIXI.Container();
        this.type = 'ending';
        
        this.endingType = '';
        this.currentTextIndex = 0;
        this.endingTexts = [];
        this.isTyping = false;
        this.background = null;
    }
    
    init(params = {}) {
        this.container.removeChildren();
        this.endingType = params.type || 'eternal';
        
        // 隐藏状态UI
        this.uiManager.setStatusVisible(false);
        this.uiManager.setDialogueVisible(false);
        
        // 创建结局背景
        this.createEndingBackground();
        
        // 加载结局文本
        this.loadEndingTexts();
        
        // 显示结局文本
        this.showNextText();
    }
    
    createEndingBackground() {
        const bg = new PIXI.Graphics();
        
        // 根据结局类型设置不同的背景
        switch (this.endingType) {
            case 'romantic':
                // 浪漫结局：粉色渐变
                bg.beginFill(0xFF69B4);
                bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
                bg.endFill();
                break;
                
            case 'tragic':
                // 悲剧结局：深灰色
                bg.beginFill(0x2F4F4F);
                bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
                bg.endFill();
                break;
                
            case 'escape':
                // 逃脱结局：金色
                bg.beginFill(0xFFD700);
                bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
                bg.endFill();
                break;
                
            case 'nightmare':
                // 噩梦结局：暗红色
                bg.beginFill(0x8B0000);
                bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
                bg.endFill();
                break;
                
            default:
                // 永恒结局：深蓝色
                bg.beginFill(0x1A1A2E);
                bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
                bg.endFill();
        }
        
        this.container.addChild(bg);
        this.background = bg;
    }
    
    loadEndingTexts() {
        this.endingTexts = [];
        
        switch (this.endingType) {
            case 'romantic':
                this.endingTexts = [
                    { type: 'title', text: '【浪漫结局：永恒的陪伴】' },
                    { type: 'narrative', text: `经历了${this.gameData.loopCount}次循环后...` },
                    { type: 'dialogue', speaker: 'yutong', text: '我决定了...与其冒险让大家消失，' },
                    { type: 'dialogue', speaker: 'yutong', text: '不如就维持这个循环。' },
                    { type: 'dialogue', speaker: 'yutong', text: '因为这样...就能永远和你在一起了。' },
                    { type: 'dialogue', speaker: 'player', text: '（握住她的手）即使时间永远停留在这一天...' },
                    { type: 'dialogue', speaker: 'player', text: '只要有你在身边，就够了。' },
                    { type: 'narrative', text: '你们牵着手，看着永远停留在八点十五分的夕阳。' },
                    { type: 'narrative', text: '在这个永恒的九月二十七日，' },
                    { type: 'narrative', text: '你们找到了属于彼此的永恒。' }
                ];
                break;
                
            case 'tragic':
                this.endingTexts = [
                    { type: 'title', text: '【悲剧结局：无法改变的过去】' },
                    { type: 'narrative', text: '你知道了三年前的真相...' },
                    { type: 'dialogue', speaker: 'yutong', text: '（跪倒在地，失声痛哭）为什么...为什么就是救不了大家...' },
                    { type: 'narrative', text: '最终，你们决定维持这个悲伤的循环。' },
                    { type: 'narrative', text: '在永远的九月二十七日里，' },
                    { type: 'narrative', text: '守护着那些早已消逝的笑容。' }
                ];
                break;
                
            case 'escape':
                this.endingTexts = [
                    { type: 'title', text: '【逃脱结局：打破循环的勇者】' },
                    { type: 'narrative', text: '你们找到了打破循环的关键...' },
                    { type: 'dialogue', speaker: 'yutong', text: '根据侯子鸣的计算，要打破循环需要满足三个条件：' },
                    { type: 'narrative', text: '在所有人的共同努力下，循环开始出现裂痕...' },
                    { type: 'narrative', text: '时间开始流动，九月的风终于吹向了二十八日。' },
                    { type: 'narrative', text: '虽然大家终究要分别，' },
                    { type: 'narrative', text: '但至少...他们可以真正地安息了。' }
                ];
                break;
                
            case 'nightmare':
                this.endingTexts = [
                    { type: 'title', text: '【噩梦结局：破碎的理智】' },
                    { type: 'narrative', text: '你的理智已经崩溃了...' },
                    { type: 'dialogue', speaker: 'player', text: '（自言自语）谁是真的？谁是假的？' },
                    { type: 'narrative', text: '世界开始扭曲变形。' },
                    { type: 'narrative', text: '同学的脸变成了模糊的面具。' },
                    { type: 'narrative', text: '最终，你发现自己站在空无一人的教室里。' },
                    { type: 'narrative', text: '而你的面前，是一面破碎的镜子。' },
                    { type: 'narrative', text: '镜中的你，正在对你微笑...' }
                ];
                break;
                
            default: // eternal
                this.endingTexts = [
                    { type: 'title', text: '【永恒结局：无尽的轮回】' },
                    { type: 'narrative', text: `第${this.gameData.MAX_LOOPS}次循环...` },
                    { type: 'dialogue', speaker: 'yutong', text: '（表情空洞）我累了...' },
                    { type: 'dialogue', speaker: 'yutong', text: '真的...太累了。' },
                    { type: 'narrative', text: '循环还在继续，但有些东西已经消失了。' },
                    { type: 'narrative', text: '姜雨彤的记忆在逐渐褪色，' },
                    { type: 'narrative', text: '连带着整个世界的真实感。' },
                    { type: 'narrative', text: '也许有一天，你们都会变成' },
                    { type: 'narrative', text: '连自己是谁都忘记的投影。' }
                ];
        }
        
        this.currentTextIndex = 0;
    }
    
    showNextText() {
        if (this.currentTextIndex >= this.endingTexts.length) {
            // 显示结局完成后的选项
            this.showEndingOptions();
            return;
        }
        
        const textData = this.endingTexts[this.currentTextIndex];
        this.displayText(textData);
        this.currentTextIndex++;
    }
    
    displayText(textData) {
        // 创建文本容器
        const textContainer = new PIXI.Container();
        textContainer.position.set(
            this.app.screen.width / 2,
            100 + (this.currentTextIndex * 80)
        );
        
        let textStyle;
        let textContent;
        
        switch (textData.type) {
            case 'title':
                textStyle = {
                    fontFamily: 'Ma Shan Zheng',
                    fontSize: 48,
                    fill: 0xFFFFFF,
                    align: 'center',
                    dropShadow: true,
                    dropShadowColor: 0x000000,
                    dropShadowBlur: 4,
                    dropShadowDistance: 0
                };
                textContent = textData.text;
                break;
                
            case 'dialogue':
                const speakerName = Dialogue.CharacterNames[textData.speaker] || '???';
                const color = Dialogue.CharacterColors[textData.speaker] || 0xFFFFFF;
                
                textStyle = {
                    fontFamily: 'Noto Sans SC',
                    fontSize: 28,
                    fill: color,
                    align: 'left'
                };
                textContent = `${speakerName}: ${textData.text}`;
                break;
                
            default: // narrative
                textStyle = {
                    fontFamily: 'Noto Sans SC',
                    fontSize: 24,
                    fill: 0xDDDDDD,
                    align: 'center',
                    fontStyle: 'italic'
                };
                textContent = textData.text;
        }
        
        const text = new PIXI.Text(textContent, textStyle);
        text.anchor.set(0.5);
        
        // 添加淡入动画
        text.alpha = 0;
        const fadeIn = () => {
            if (text.alpha < 1) {
                text.alpha += 0.02;
                requestAnimationFrame(fadeIn);
            } else {
                // 淡入完成后，等待一段时间显示下一段文本
                setTimeout(() => {
                    this.showNextText();
                }, 1500);
            }
        };
        
        fadeIn();
        
        textContainer.addChild(text);
        this.container.addChild(textContainer);
    }
    
    showEndingOptions() {
        // 创建结局后的选择按钮
        const optionsContainer = new PIXI.Container();
        optionsContainer.position.set(
            this.app.screen.width / 2,
            this.app.screen.height - 200
        );
        
        const options = [
            { text: '返回标题', action: 'returnToTitle' },
            { text: '重新开始', action: 'restart' },
            { text: '查看统计', action: 'stats' }
        ];
        
        options.forEach((option, index) => {
            const button = this.createEndingButton(
                option.text,
                index * 220 - 220,
                0,
                option.action
            );
            optionsContainer.addChild(button);
        });
        
        this.container.addChild(optionsContainer);
    }
    
    createEndingButton(text, x, y, action) {
        const button = new PIXI.Container();
        button.position.set(x, y);
        
        // 按钮背景
        const bg = new PIXI.Graphics();
        bg.beginFill(0x2D3047, 0.8);
        bg.lineStyle(2, 0x4A4E8C);
        bg.drawRoundedRect(-100, -25, 200, 50, 10);
        bg.endFill();
        
        // 按钮文本
        const buttonText = new PIXI.Text(text, {
            fontFamily: 'Noto Sans SC',
            fontSize: 24,
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
            bg.drawRoundedRect(-100, -25, 200, 50, 10);
            bg.endFill();
            buttonText.style.fill = 0x6A9EE5;
        });
        
        button.on('pointerout', () => {
            bg.clear();
            bg.beginFill(0x2D3047, 0.8);
            bg.lineStyle(2, 0x4A4E8C);
            bg.drawRoundedRect(-100, -25, 200, 50, 10);
            bg.endFill();
            buttonText.style.fill = 0xFFFFFF;
        });
        
        button.on('pointerdown', () => {
            this.handleEndingAction(action);
        });
        
        return button;
    }
    
    handleEndingAction(action) {
        switch (action) {
            case 'returnToTitle':
                this.gameData.reset();
                this.gameCore.switchScene('title');
                break;
                
            case 'restart':
                this.gameData.reset();
                this.gameCore.switchScene('game', { day: 1 });
                break;
                
            case 'stats':
                this.showStatistics();
                break;
        }
    }
    
    showStatistics() {
        // 创建统计信息界面
        const statsContainer = new PIXI.Container();
        statsContainer.zIndex = 100;
        
        // 背景
        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.8);
        bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        bg.endFill();
        statsContainer.addChild(bg);
        
        // 标题
        const title = new PIXI.Text('游戏统计', {
            fontFamily: 'Ma Shan Zheng',
            fontSize: 48,
            fill: 0x6A9EE5,
            align: 'center'
        });
        title.anchor.set(0.5);
        title.position.set(this.app.screen.width / 2, 100);
        statsContainer.addChild(title);
        
        // 统计信息
        const stats = [
            `循环次数: ${this.gameData.loopCount}`,
            `最终理智: ${this.gameData.sanity}`,
            `姜雨彤好感度: ${this.gameData.getAffection('yutong')}`,
            `发现的线索: ${this.gameData.cluesFound.filter(f => f).length}/20`,
            `解锁的记忆: ${this.gameData.memoriesUnlocked.filter(m => m).length}/10`
        ];
        
        stats.forEach((stat, index) => {
            const statText = new PIXI.Text(stat, {
                fontFamily: 'Noto Sans SC',
                fontSize: 28,
                fill: 0xFFFFFF,
                align: 'center'
            });
            statText.anchor.set(0.5);
            statText.position.set(
                this.app.screen.width / 2,
                200 + index * 50
            );
            statsContainer.addChild(statText);
        });
        
        // 关闭按钮
        const closeButton = this.createEndingButton(
            '关闭',
            this.app.screen.width / 2,
            this.app.screen.height - 100,
            'closeStats'
        );
        closeButton.on('pointerdown', () => {
            this.app.stage.removeChild(statsContainer);
        });
        statsContainer.addChild(closeButton);
        
        this.app.stage.addChild(statsContainer);
    }
    
    update(delta) {
        // 结局场景不需要更新逻辑
    }
    
    destroy() {
        this.container.removeChildren();
    }
}