class UIManager {
    constructor(app, gameData) {
        this.app = app;
        this.gameData = gameData;
        this.uiContainer = new PIXI.Container();
        this.components = {};
        
        // UI配置
        this.config = {
            colors: {
                background: 0x1A1A2E,
                panel: 0x2D3047,
                border: 0x4A4E8C,
                text: 0xFFFFFF,
                highlight: 0x6A9EE5
            },
            fonts: {
                title: { family: 'Ma Shan Zheng', size: 48 },
                normal: { family: 'Noto Sans SC', size: 24 },
                small: { family: 'Noto Sans SC', size: 18 }
            },
            padding: 20,
            spacing: 10
        };
        
        this.init();
    }
    
    init() {
        // 创建UI容器
        this.uiContainer.zIndex = 100;
        
        // 创建状态面板
        this.createStatusPanel();
        
        // 创建对话面板
        this.createDialoguePanel();
        
        // 创建选择面板
        this.createChoicePanel();
        
        // 添加到舞台
        this.app.stage.addChild(this.uiContainer);
    }
    
    // 创建状态面板
    createStatusPanel() {
        const panel = new PIXI.Container();
        panel.position.set(this.app.screen.width - 320, 20);
        
        // 背景
        const bg = new PIXI.Graphics();
        bg.beginFill(this.config.colors.panel, 0.9);
        bg.lineStyle(2, this.config.colors.border);
        bg.drawRoundedRect(0, 0, 300, 200, 10);
        bg.endFill();
        panel.addChild(bg);
        
        // 标题
        const title = new PIXI.Text('游戏状态', {
            fontFamily: this.config.fonts.normal.family,
            fontSize: this.config.fonts.normal.size,
            fill: this.config.colors.highlight,
            fontWeight: 'bold'
        });
        title.position.set(this.config.padding, this.config.padding);
        panel.addChild(title);
        
        // 状态文本
        const statusText = new PIXI.Text('', {
            fontFamily: this.config.fonts.small.family,
            fontSize: this.config.fonts.small.size,
            fill: this.config.colors.text,
            lineHeight: 24
        });
        statusText.position.set(this.config.padding, 50);
        panel.addChild(statusText);
        
        // 保存引用
        this.components.statusPanel = panel;
        this.components.statusText = statusText;
        
        this.uiContainer.addChild(panel);
    }
    
    // 创建关系面板
    createRelationshipPanel() {
        const panel = new PIXI.Container();
        panel.position.set(this.app.screen.width - 320, 240);
        
        // 背景
        const bg = new PIXI.Graphics();
        bg.beginFill(this.config.colors.panel, 0.9);
        bg.lineStyle(2, this.config.colors.border);
        bg.drawRoundedRect(0, 0, 300, 200, 10);
        bg.endFill();
        panel.addChild(bg);
        
        // 标题
        const title = new PIXI.Text('人物关系', {
            fontFamily: this.config.fonts.normal.family,
            fontSize: this.config.fonts.normal.size,
            fill: this.config.colors.highlight,
            fontWeight: 'bold'
        });
        title.position.set(this.config.padding, this.config.padding);
        panel.addChild(title);
        
        // 关系文本
        const relationText = new PIXI.Text('', {
            fontFamily: this.config.fonts.small.family,
            fontSize: this.config.fonts.small.size,
            fill: this.config.colors.text,
            lineHeight: 24
        });
        relationText.position.set(this.config.padding, 50);
        panel.addChild(relationText);
        
        this.components.relationPanel = panel;
        this.components.relationText = relationText;
        
        this.uiContainer.addChild(panel);
    }
    
    // 创建收集面板
    createCollectionPanel() {
        const panel = new PIXI.Container();
        panel.position.set(this.app.screen.width - 320, 460);
        
        // 背景
        const bg = new PIXI.Graphics();
        bg.beginFill(this.config.colors.panel, 0.9);
        bg.lineStyle(2, this.config.colors.border);
        bg.drawRoundedRect(0, 0, 300, 200, 10);
        bg.endFill();
        panel.addChild(bg);
        
        // 标题
        const title = new PIXI.Text('收集进度', {
            fontFamily: this.config.fonts.normal.family,
            fontSize: this.config.fonts.normal.size,
            fill: this.config.colors.highlight,
            fontWeight: 'bold'
        });
        title.position.set(this.config.padding, this.config.padding);
        panel.addChild(title);
        
        // 收集文本
        const collectionText = new PIXI.Text('', {
            fontFamily: this.config.fonts.small.family,
            fontSize: this.config.fonts.small.size,
            fill: this.config.colors.text,
            lineHeight: 24
        });
        collectionText.position.set(this.config.padding, 50);
        panel.addChild(collectionText);
        
        this.components.collectionPanel = panel;
        this.components.collectionText = collectionText;
        
        this.uiContainer.addChild(panel);
    }
    
    // 创建对话面板
    createDialoguePanel() {
        const panel = new PIXI.Container();
        panel.position.set(20, this.app.screen.height - 300);
        
        // 背景
        const bg = new PIXI.Graphics();
        bg.beginFill(this.config.colors.panel, 0.95);
        bg.lineStyle(3, this.config.colors.border);
        bg.drawRoundedRect(0, 0, this.app.screen.width - 40, 280, 15);
        bg.endFill();
        panel.addChild(bg);
        
        // 说话者名字
        const speakerName = new PIXI.Text('', {
            fontFamily: this.config.fonts.normal.family,
            fontSize: 28,
            fill: this.config.colors.highlight,
            fontWeight: 'bold'
        });
        speakerName.position.set(30, 20);
        panel.addChild(speakerName);
        
        // 对话文本
        const dialogueText = new PIXI.Text('', {
            fontFamily: this.config.fonts.normal.family,
            fontSize: 24,
            fill: this.config.colors.text,
            wordWrap: true,
            wordWrapWidth: this.app.screen.width - 100,
            lineHeight: 32
        });
        dialogueText.position.set(30, 70);
        panel.addChild(dialogueText);
        
        // 继续提示
        const continueHint = new PIXI.Text('▼ 按空格或回车继续', {
            fontFamily: this.config.fonts.small.family,
            fontSize: 18,
            fill: this.config.colors.highlight,
            fontStyle: 'italic'
        });
        continueHint.position.set(this.app.screen.width - 250, 230);
        panel.addChild(continueHint);
        
        this.components.dialoguePanel = panel;
        this.components.speakerName = speakerName;
        this.components.dialogueText = dialogueText;
        this.components.continueHint = continueHint;
        
        this.uiContainer.addChild(panel);
    }
    
    // 创建选择面板
    createChoicePanel() {
        const panel = new PIXI.Container();
        panel.position.set(20, this.app.screen.height - 500);
        panel.visible = false;
        
        this.components.choicePanel = panel;
        this.components.choices = [];
        
        this.uiContainer.addChild(panel);
    }
    
    // 更新状态显示
    updateStatus() {
        if (this.components.statusText) {
            this.components.statusText.text = this.gameData.getStatusText();
        }
        
        if (this.components.relationText) {
            this.components.relationText.text = this.gameData.getRelationshipText();
        }
        
        if (this.components.collectionText) {
            this.components.collectionText.text = this.gameData.getCollectionText();
        }
    }
    
    // 显示对话
    showDialogue(speaker, text, isThought = false, color = null) {
        if (this.components.speakerName) {
            let name = '';
            if (speaker === Dialogue.Character.PLAYER) {
                name = this.gameData.playerName || '玩家';
            } else {
                name = Dialogue.CharacterNames[speaker] || '未知';
            }
            
            if (isThought) {
                name += '的内心';
            }
            
            this.components.speakerName.text = name;
            this.components.speakerName.style.fill = color || Dialogue.CharacterColors[speaker] || 0xFFFFFF;
        }
        
        if (this.components.dialogueText) {
            this.components.dialogueText.text = text;
        }
        
        // 显示继续提示
        if (this.components.continueHint) {
            this.components.continueHint.visible = true;
        }
    }
    
    // 显示选择项
    showChoices(choices, onSelect) {
        const panel = this.components.choicePanel;
        panel.removeChildren();
        panel.visible = true;
        
        // 背景
        const bg = new PIXI.Graphics();
        bg.beginFill(this.config.colors.panel, 0.95);
        bg.lineStyle(2, this.config.colors.border);
        bg.drawRoundedRect(0, 0, 600, choices.length * 60 + 40, 10);
        bg.endFill();
        panel.addChild(bg);
        
        // 标题
        const title = new PIXI.Text('请选择：', {
            fontFamily: this.config.fonts.normal.family,
            fontSize: 24,
            fill: this.config.colors.highlight,
            fontWeight: 'bold'
        });
        title.position.set(20, 10);
        panel.addChild(title);
        
        // 创建选择项
        choices.forEach((choice, index) => {
            const y = 50 + index * 60;
            
            // 选择项背景
            const choiceBg = new PIXI.Graphics();
            choiceBg.beginFill(index === 0 ? 0x3A4A6C : 0x2A3A5C, 0.8);
            choiceBg.lineStyle(1, this.config.colors.border);
            choiceBg.drawRoundedRect(20, y, 560, 50, 8);
            choiceBg.endFill();
            
            choiceBg.interactive = true;
            choiceBg.cursor = 'pointer';
            
            choiceBg.on('pointerover', () => {
                choiceBg.clear();
                choiceBg.beginFill(0x4A5A7C, 0.9);
                choiceBg.lineStyle(2, this.config.colors.highlight);
                choiceBg.drawRoundedRect(20, y, 560, 50, 8);
                choiceBg.endFill();
            });
            
            choiceBg.on('pointerout', () => {
                choiceBg.clear();
                choiceBg.beginFill(index === 0 ? 0x3A4A6C : 0x2A3A5C, 0.8);
                choiceBg.lineStyle(1, this.config.colors.border);
                choiceBg.drawRoundedRect(20, y, 560, 50, 8);
                choiceBg.endFill();
            });
            
            choiceBg.on('pointerdown', () => {
                onSelect(index);
                panel.visible = false;
            });
            
            panel.addChild(choiceBg);
            
            // 选择项文本
            const choiceText = new PIXI.Text(`${index + 1}. ${choice}`, {
                fontFamily: this.config.fonts.normal.family,
                fontSize: 22,
                fill: this.config.colors.text
            });
            choiceText.position.set(40, y + 12);
            panel.addChild(choiceText);
            
            // 快捷键提示
            const shortcut = new PIXI.Text(`[${index + 1}]`, {
                fontFamily: this.config.fonts.small.family,
                fontSize: 16,
                fill: this.config.colors.highlight,
                fontStyle: 'italic'
            });
            shortcut.position.set(520, y + 15);
            panel.addChild(shortcut);
        });
        
        // 居中显示
        panel.position.x = (this.app.screen.width - 600) / 2;
    }
    
    // 隐藏选择面板
    hideChoices() {
        if (this.components.choicePanel) {
            this.components.choicePanel.visible = false;
        }
    }
    
    // 显示/隐藏对话面板
    setDialogueVisible(visible) {
        if (this.components.dialoguePanel) {
            this.components.dialoguePanel.visible = visible;
        }
    }
    
    // 显示/隐藏状态面板
    setStatusVisible(visible) {
        if (this.components.statusPanel) {
            this.components.statusPanel.visible = visible;
        }
        
        if (this.components.relationPanel) {
            this.components.relationPanel.visible = visible;
        }
        
        if (this.components.collectionPanel) {
            this.components.collectionPanel.visible = visible;
        }
    }
    
    // 显示加载屏幕
    showLoadingScreen(text = '加载中...') {
        const container = new PIXI.Container();
        container.zIndex = 1000;
        
        // 背景
        const bg = new PIXI.Graphics();
        bg.beginFill(0x1A1A2E, 0.95);
        bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        bg.endFill();
        container.addChild(bg);
        
        // 加载文本
        const loadingText = new PIXI.Text(text, {
            fontFamily: this.config.fonts.normal.family,
            fontSize: 32,
            fill: this.config.colors.highlight,
            align: 'center'
        });
        loadingText.anchor.set(0.5);
        loadingText.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
        container.addChild(loadingText);
        
        // 加载动画
        const spinner = new PIXI.Graphics();
        spinner.position.set(this.app.screen.width / 2, this.app.screen.height / 2 - 60);
        
        let rotation = 0;
        const animate = () => {
            rotation += 0.1;
            spinner.clear();
            spinner.lineStyle(4, this.config.colors.highlight);
            spinner.arc(0, 0, 30, rotation, rotation + Math.PI * 0.8);
        };
        
        this.app.ticker.add(animate);
        container.addChild(spinner);
        
        this.app.stage.addChild(container);
        
        // 保存引用以便移除
        this.loadingScreen = {
            container,
            spinner,
            animate: () => {
                rotation += 0.1;
                spinner.clear();
                spinner.lineStyle(4, this.config.colors.highlight);
                spinner.arc(0, 0, 30, rotation, rotation + Math.PI * 0.8);
            }
        };
    }
    
    // 隐藏加载屏幕
    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.app.ticker.remove(this.loadingScreen.animate);
            this.app.stage.removeChild(this.loadingScreen.container);
            this.loadingScreen = null;
        }
    }
    
    // 显示消息提示
    showToast(message, duration = 2000) {
        const toast = new PIXI.Container();
        toast.zIndex = 1001;
        
        // 背景
        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.7);
        bg.drawRoundedRect(0, 0, 400, 60, 10);
        bg.endFill();
        toast.addChild(bg);
        
        // 文本
        const text = new PIXI.Text(message, {
            fontFamily: this.config.fonts.normal.family,
            fontSize: 20,
            fill: 0xFFFFFF,
            align: 'center'
        });
        text.anchor.set(0.5);
        text.position.set(200, 30);
        toast.addChild(text);
        
        toast.position.set((this.app.screen.width - 400) / 2, 100);
        this.app.stage.addChild(toast);
        
        // 淡入淡出动画
        toast.alpha = 0;
        const fadeIn = () => {
            if (toast.alpha < 1) {
                toast.alpha += 0.05;
                requestAnimationFrame(fadeIn);
            }
        };
        
        fadeIn();
        
        // 定时移除
        setTimeout(() => {
            const fadeOut = () => {
                if (toast.alpha > 0) {
                    toast.alpha -= 0.05;
                    requestAnimationFrame(fadeOut);
                } else {
                    this.app.stage.removeChild(toast);
                }
            };
            
            fadeOut();
        }, duration);
    }
    
    // 清理UI
    cleanup() {
        this.uiContainer.removeChildren();
        this.components = {};
    }
}