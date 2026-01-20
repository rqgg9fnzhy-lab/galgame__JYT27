class GameScene {
    constructor(app, gameCore, uiManager) {
        this.app = app;
        this.gameCore = gameCore;
        this.uiManager = uiManager;
        this.gameData = gameCore.getGameData();
        this.container = new PIXI.Container();
        this.type = 'dialogue';
        
        this.currentDay = 1;
        this.currentDialogues = [];
        this.currentChoices = [];
        this.dialogueIndex = 0;
        this.isTyping = false;
        this.typingProgress = 0;
        this.typingSpeed = 50; // 毫秒/字符
        
        this.background = null;
        this.characterSprites = {};
        this.dialogueTimer = null;
    }
    
    init(params = {}) {
        this.container.removeChildren();
        
        // 设置当前天数
        this.currentDay = params.day || this.gameData.currentDay;
        this.gameData.currentDay = this.currentDay;
        
        // 创建背景
        this.createBackground();
        
        // 创建角色
        this.createCharacters();
        
        // 根据天数加载剧情
        this.loadDayScene();
        
        // 更新UI
        this.uiManager.updateStatus();
        this.uiManager.setStatusVisible(true);
        this.uiManager.setDialogueVisible(true);
    }
    
    createBackground() {
        const bg = new PIXI.Graphics();
        
        // 根据天数设置不同的背景颜色
        let color;
        switch (this.currentDay) {
            case 1:
                color = 0x87CEEB; // 天空蓝 - 早晨
                break;
            case 2:
                color = 0xFFD700; // 金色 - 中午
                break;
            case 3:
                color = 0xFF4500; // 橘红色 - 傍晚
                break;
            default:
                color = 0x1A1A2E;
        }
        
        bg.beginFill(color);
        bg.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        bg.endFill();
        
        // 添加一些装饰元素
        if (this.currentDay === 1) {
            // 第一天：教室背景
            this.createClassroomBackground();
        } else if (this.currentDay === 2) {
            // 第二天：图书馆背景
            this.createLibraryBackground();
        } else if (this.currentDay === 3) {
            // 第三天：天台背景
            this.createRooftopBackground();
        }
        
        this.container.addChild(bg);
        this.background = bg;
    }
    
    createClassroomBackground() {
        // 创建教室元素
        const window = new PIXI.Graphics();
        window.beginFill(0xADD8E6);
        window.drawRect(200, 100, 400, 250);
        window.endFill();
        
        window.lineStyle(3, 0x8B4513);
        window.drawRect(200, 100, 400, 250);
        
        this.container.addChild(window);
        
        // 课桌
        for (let i = 0; i < 5; i++) {
            const desk = new PIXI.Graphics();
            desk.beginFill(0x8B4513);
            desk.drawRect(150 + i * 150, 400, 80, 50);
            desk.endFill();
            
            this.container.addChild(desk);
        }
        
        // 黑板
        const blackboard = new PIXI.Graphics();
        blackboard.beginFill(0x000000);
        blackboard.drawRect(100, 50, 600, 150);
        blackboard.endFill();
        
        this.container.addChild(blackboard);
        
        // 黑板文字
        const chalkText = new PIXI.Text('九月二十七日', {
            fontFamily: 'Ma Shan Zheng',
            fontSize: 36,
            fill: 0xFFFFFF,
            align: 'center'
        });
        chalkText.anchor.set(0.5);
        chalkText.position.set(400, 125);
        this.container.addChild(chalkText);
    }
    
    createLibraryBackground() {
        // 书架
        for (let i = 0; i < 3; i++) {
            const bookshelf = new PIXI.Graphics();
            bookshelf.beginFill(0x8B4513);
            bookshelf.drawRect(100 + i * 250, 100, 200, 400);
            bookshelf.endFill();
            
            this.container.addChild(bookshelf);
            
            // 书本
            for (let j = 0; j < 5; j++) {
                const book = new PIXI.Graphics();
                const colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF];
                book.beginFill(colors[Math.floor(Math.random() * colors.length)]);
                book.drawRect(110 + i * 250, 110 + j * 75, 180, 15);
                book.endFill();
                
                this.container.addChild(book);
            }
        }
        
        // 阅读桌
        const table = new PIXI.Graphics();
        table.beginFill(0xD2B48C);
        table.drawRect(200, 520, 400, 30);
        table.endFill();
        
        this.container.addChild(table);
    }
    
    createRooftopBackground() {
        // 天空渐变
        const sky = new PIXI.Graphics();
        const gradient = [
            { offset: 0, color: 0xFF4500 },
            { offset: 0.5, color: 0xFF6347 },
            { offset: 1, color: 0x1A1A2E }
        ];
        
        for (let i = 0; i < gradient.length - 1; i++) {
            const start = gradient[i];
            const end = gradient[i + 1];
            
            sky.beginFill(start.color);
            sky.drawRect(0, 
                this.app.screen.height * start.offset,
                this.app.screen.width,
                this.app.screen.height * (end.offset - start.offset));
            sky.endFill();
        }
        
        this.container.addChild(sky);
        
        // 栏杆
        const railing = new PIXI.Graphics();
        railing.beginFill(0x696969);
        railing.drawRect(0, 500, this.app.screen.width, 20);
        railing.endFill();
        
        this.container.addChild(railing);
        
        // 云朵
        for (let i = 0; i < 3; i++) {
            const cloud = new PIXI.Graphics();
            cloud.beginFill(0xFFFFFF, 0.8);
            cloud.drawCircle(100 + i * 300, 100, 40);
            cloud.drawCircle(130 + i * 300, 90, 50);
            cloud.drawCircle(170 + i * 300, 100, 40);
            cloud.endFill();
            
            this.container.addChild(cloud);
        }
    }
    
    createCharacters() {
        // 清空现有角色
        this.characterSprites = {};
        
        // 这里可以加载角色图片
        // 暂时用图形代替
        if (this.currentDay === 1) {
            // 第一天：姜雨彤在讲台
            const yutong = this.createCharacterSprite('yutong', 400, 300);
            this.characterSprites.yutong = yutong;
            this.container.addChild(yutong);
            
            // 其他同学（用简单图形表示）
            for (let i = 0; i < 5; i++) {
                const student = this.createCharacterSprite(
                    `student${i}`,
                    150 + i * 150,
                    450
                );
                this.container.addChild(student);
            }
        }
    }
    
    createCharacterSprite(name, x, y) {
        const container = new PIXI.Container();
        container.position.set(x, y);
        
        // 身体
        const body = new PIXI.Graphics();
        body.beginFill(this.getCharacterColor(name));
        body.drawCircle(0, 0, 40);
        body.endFill();
        
        // 脸
        const face = new PIXI.Graphics();
        face.beginFill(0xF5DEB3);
        face.drawCircle(0, -10, 25);
        face.endFill();
        
        container.addChild(body);
        container.addChild(face);
        
        return container;
    }
    
    getCharacterColor(name) {
        const colors = {
            yutong: 0xFFB4C8,     // 粉色
            bingcheng: 0xFF6464,  // 红色
            zishuo: 0x64C8FF,     // 蓝色
            yicheng: 0xB4FFB4,    // 绿色
            haochen: 0xFFFF64,    // 黄色
            yilin: 0xB4B4FF,      // 紫色
            linfeng: 0xFFC864,    // 橙色
            ziming: 0x96DCDC      // 青色
        };
        
        return colors[name] || 0xFFFFFF;
    }
    
    loadDayScene() {
        // 根据天数加载不同的对话
        this.currentDialogues = [];
        this.currentChoices = [];
        this.dialogueIndex = 0;
        this.isTyping = false;
        this.typingProgress = 0;
        
        if (this.currentDay === 1) {
            this.loadDay1Dialogues();
        } else if (this.currentDay === 2) {
            this.loadDay2Dialogues();
        } else if (this.currentDay === 3) {
            this.loadDay3Dialogues();
        }
        
        // 开始显示第一条对话
        if (this.currentDialogues.length > 0) {
            this.showCurrentDialogue();
        }
    }
    
    loadDay1Dialogues() {
        // 第一天对话
        const dayText = this.gameData.loopCount === 1 ? 
            "九月二十七日 · 第一天 · 早晨" : 
            `第${this.gameData.loopCount}次循环 · 九月二十七日 · 早晨`;
        
        this.currentDialogues.push({
            speaker: Dialogue.Character.SYSTEM,
            text: dayText,
            thought: false
        });
        
        if (this.gameData.loopCount === 1) {
            this.currentDialogues.push({
                speaker: Dialogue.Character.PLAYER,
                text: "今天是我转学到二十七班的第一天。",
                thought: true
            });
            this.currentDialogues.push({
                speaker: Dialogue.Character.PLAYER,
                text: "站在校门前，看着'市第一中学'的牌子，心里有些紧张。",
                thought: true
            });
            this.currentDialogues.push({
                speaker: Dialogue.Character.SYSTEM,
                text: "你深吸一口气，走进了校门...",
                thought: false
            });
        } else {
            this.currentDialogues.push({
                speaker: Dialogue.Character.PLAYER,
                text: "又回来了...",
                thought: true
            });
            this.currentDialogues.push({
                speaker: Dialogue.Character.PLAYER,
                text: "还是同样的校门，同样的九月二十七日。",
                thought: true
            });
        }
        
        // 第一天的选择
        this.currentChoices = [
            {
                text: "直接去教室",
                action: () => {
                    this.gameData.modifyLogic(3);
                    this.addDialogue(Dialogue.Character.SYSTEM, "你沿着熟悉（或不熟悉）的走廊走向二十七班...");
                    this.addDialogue(Dialogue.Character.SYSTEM, "走廊的墙壁上挂着历届优秀学生的照片，但有一张照片似乎...在微微闪烁？");
                    this.addDialogue(Dialogue.Character.PLAYER, "（是我眼花了吗？）", true);
                }
            },
            {
                text: "在校园里转转",
                action: () => {
                    this.gameData.modifyIntuition(5);
                    this.addDialogue(Dialogue.Character.SYSTEM, "你在校园里闲逛，注意到一些奇怪的细节...");
                    this.addDialogue(Dialogue.Character.SYSTEM, "操场上打篮球的学生，动作似乎有些僵硬。");
                    
                    if (this.gameData.loopCount > 3) {
                        this.gameData.cluesFound[0] = true;
                        this.gameData.secretLevel++;
                        this.uiManager.showToast('发现了线索！', 1500);
                    }
                }
            }
        ];
        
        if (this.gameData.loopCount >= 3) {
            this.currentChoices.push({
                text: "寻找异常之处",
                action: () => {
                    this.gameData.modifySanity(-5);
                    this.gameData.modifyIntuition(8);
                    this.addDialogue(Dialogue.Character.PLAYER, "（我必须找出这个循环的秘密...）", true);
                    
                    if (!this.gameData.cluesFound[1]) {
                        this.gameData.cluesFound[1] = true;
                        this.gameData.secretLevel += 2;
                        this.uiManager.showToast('发现了重要线索！', 1500);
                    }
                }
            });
        }
    }
    
    loadDay2Dialogues() {
        // 第二天对话
        this.currentDialogues.push({
            speaker: Dialogue.Character.SYSTEM,
            text: `第${this.gameData.loopCount}次循环 · 第二天 · 早晨`,
            thought: false
        });
        
        if (this.gameData.knowsTimeLoop) {
            this.currentDialogues.push({
                speaker: Dialogue.Character.PLAYER,
                text: "又开始了...但今天，我要找出真相。",
                thought: true
            });
        }
        
        // 第二天的选择
        this.currentChoices = [
            {
                text: "正常去学校",
                action: () => {
                    this.addDialogue(Dialogue.Character.SYSTEM, "你像往常一样走向学校...");
                }
            },
            {
                text: "尝试不同的路线",
                action: () => {
                    this.gameData.modifyIntuition(8);
                    this.addDialogue(Dialogue.Character.SYSTEM, "你尝试走不同的路线去学校...");
                }
            }
        ];
        
        if (this.gameData.knowsTimeLoop) {
            this.currentChoices.push({
                text: "直接去找姜雨彤",
                action: () => {
                    this.gameData.modifyAffection('yutong', 15);
                    this.addDialogue(Dialogue.Character.SYSTEM, "你直接跑到姜雨彤家楼下。");
                }
            });
        }
    }
    
    loadDay3Dialogues() {
        // 第三天对话
        this.currentDialogues.push({
            speaker: Dialogue.Character.SYSTEM,
            text: `第${this.gameData.loopCount}次循环 · 第三天 · 早晨`,
            thought: false
        });
        
        if (this.gameData.knowsTimeLoop) {
            this.currentDialogues.push({
                speaker: Dialogue.Character.PLAYER,
                text: "今天是最后的机会了...一定要救大家！",
                thought: true
            });
        }
        
        // 第三天的选择
        this.currentChoices = [
            {
                text: "前往天台",
                action: () => {
                    this.addDialogue(Dialogue.Character.SYSTEM, "你来到了学校天台...");
                }
            },
            {
                text: "寻找其他线索",
                action: () => {
                    this.gameData.modifyIntuition(10);
                    this.addDialogue(Dialogue.Character.SYSTEM, "你在学校里寻找最后的线索...");
                }
            }
        ];
    }
    
    showCurrentDialogue() {
        if (this.dialogueIndex >= this.currentDialogues.length) {
            // 对话结束，显示选择
            this.showChoices();
            return;
        }
        
        const dialogue = this.currentDialogues[this.dialogueIndex];
        this.uiManager.showDialogue(
            dialogue.speaker,
            dialogue.text,
            dialogue.thought,
            Dialogue.CharacterColors[dialogue.speaker]
        );
        
        // 开始打字效果
        this.startTyping(dialogue.text);
    }
    
    startTyping(text) {
        this.isTyping = true;
        this.typingProgress = 0;
        
        clearInterval(this.dialogueTimer);
        
        this.dialogueTimer = setInterval(() => {
            this.typingProgress++;
            
            // 更新显示的文本
            const displayText = text.substring(0, this.typingProgress);
            const dialogue = this.currentDialogues[this.dialogueIndex];
            
            this.uiManager.showDialogue(
                dialogue.speaker,
                displayText,
                dialogue.thought,
                Dialogue.CharacterColors[dialogue.speaker]
            );
            
            if (this.typingProgress >= text.length) {
                this.isTyping = false;
                clearInterval(this.dialogueTimer);
            }
        }, this.typingSpeed);
    }
    
    skipTyping() {
        if (this.isTyping) {
            clearInterval(this.dialogueTimer);
            this.isTyping = false;
            this.typingProgress = this.currentDialogues[this.dialogueIndex].text.length;
            
            const dialogue = this.currentDialogues[this.dialogueIndex];
            this.uiManager.showDialogue(
                dialogue.speaker,
                dialogue.text,
                dialogue.thought,
                Dialogue.CharacterColors[dialogue.speaker]
            );
        }
    }
    
    nextDialogue() {
        if (this.isTyping) {
            this.skipTyping();
            return;
        }
        
        this.dialogueIndex++;
        
        if (this.dialogueIndex < this.currentDialogues.length) {
            this.showCurrentDialogue();
        } else {
            this.showChoices();
        }
    }
    
    showChoices() {
        if (this.currentChoices.length > 0) {
            const choiceTexts = this.currentChoices.map(c => c.text);
            
            this.uiManager.showChoices(choiceTexts, (index) => {
                // 执行选择对应的动作
                if (this.currentChoices[index]) {
                    const choice = this.currentChoices[index];
                    
                    // 执行动作
                    if (choice.action) {
                        choice.action();
                    }
                    
                    // 清空选择并继续
                    this.currentChoices = [];
                    this.uiManager.hideChoices();
                    
                    // 显示添加的对话
                    this.showCurrentDialogue();
                }
            });
        } else {
            // 没有选择，进入下一天
            this.progressToNextDay();
        }
    }
    
    addDialogue(speaker, text, thought = false) {
        this.currentDialogues.push({
            speaker,
            text,
            thought
        });
    }
    
    progressToNextDay() {
        this.currentDay++;
        this.gameData.currentDay = this.currentDay;
        
        if (this.currentDay > 3) {
            // 三天结束，循环重置
            this.gameData.loopCount++;
            this.gameData.currentDay = 1;
            this.gameData.checkPhaseTransition();
            
            // 保存游戏
            this.gameData.save();
            
            // 显示循环次数
            this.uiManager.showToast(`第${this.gameData.loopCount}次循环开始`, 2000);
        }
        
        // 重新加载场景
        this.init({ day: this.currentDay });
    }
    
    hasChoices() {
        return this.currentChoices.length > 0;
    }
    
    selectChoice(index) {
        if (index >= 0 && index < this.currentChoices.length) {
            const choice = this.currentChoices[index];
            
            // 执行选择动作
            if (choice.action) {
                choice.action();
            }
            
            // 清空选择
            this.currentChoices = [];
            
            // 继续显示对话
            this.nextDialogue();
        }
    }
    
    update(delta) {
        // 更新UI状态
        this.uiManager.updateStatus();
    }
    
    destroy() {
        // 清理资源
        clearInterval(this.dialogueTimer);
        this.container.removeChildren();
        this.characterSprites = {};
        this.uiManager.hideChoices();
    }
}