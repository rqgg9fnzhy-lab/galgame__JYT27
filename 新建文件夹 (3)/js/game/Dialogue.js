class Dialogue {
    static Character = {
        PLAYER: 'player',
        YUTONG: 'yutong',
        BINGCHENG: 'bingcheng',
        ZISHUO: 'zishuo',
        YICHENG: 'yicheng',
        HAOCHEN: 'haochen',
        YILIN: 'yilin',
        LINFENG: 'linfeng',
        ZIMING: 'ziming',
        TEACHER: 'teacher',
        SYSTEM: 'system',
        UNKNOWN: 'unknown'
    };
    
    static CharacterColors = {
        player: 0xC8DCFF,     // RGB(200, 220, 255)
        yutong: 0xFFB4C8,     // RGB(255, 180, 200)
        bingcheng: 0xFF6464,  // RGB(255, 100, 100)
        zishuo: 0x64C8FF,     // RGB(100, 200, 255)
        yicheng: 0xB4FFB4,    // RGB(180, 255, 180)
        haochen: 0xFFFF64,    // RGB(255, 255, 100)
        yilin: 0xB4B4FF,      // RGB(180, 180, 255)
        linfeng: 0xFFC864,    // RGB(255, 200, 100)
        ziming: 0x96DCDC,     // RGB(150, 220, 220)
        teacher: 0xDCDCDC,    // RGB(220, 220, 220)
        system: 0xFFFF96,     // RGB(255, 255, 150)
        unknown: 0x969696     // RGB(150, 150, 150)
    };
    
    static CharacterNames = {
        player: '玩家',
        yutong: '姜雨彤',
        bingcheng: '张秉诚',
        zishuo: '王梓硕',
        yicheng: '王翊丞',
        haochen: '姬昊辰',
        yilin: '房屹林',
        linfeng: '李林峰',
        ziming: '侯子鸣',
        teacher: '李老师',
        system: '系统',
        unknown: '???'
    };
    
    constructor(speaker, content, isThought = false) {
        this.speaker = speaker;
        this.content = content;
        this.isThought = isThought;
        this.displayedText = '';
        this.isTyping = false;
        this.typingProgress = 0;
        this.typingSpeed = 25; // 字符/秒
        this.lastTypingTime = 0;
    }
    
    // 获取角色名称
    getName(gameData = null) {
        if (this.speaker === Dialogue.Character.PLAYER && gameData) {
            return gameData.playerName || '玩家';
        }
        return Dialogue.CharacterNames[this.speaker] || '未知';
    }
    
    // 获取角色颜色
    getColor() {
        return Dialogue.CharacterColors[this.speaker] || 0xFFFFFF;
    }
    
    // 开始打字效果
    startTyping() {
        this.displayedText = '';
        this.isTyping = true;
        this.typingProgress = 0;
        this.lastTypingTime = Date.now();
    }
    
    // 更新打字效果
    update() {
        if (!this.isTyping || this.typingProgress >= this.content.length) {
            return;
        }
        
        const now = Date.now();
        const elapsed = now - this.lastTypingTime;
        const charsToAdd = Math.floor(elapsed / (1000 / this.typingSpeed));
        
        if (charsToAdd > 0) {
            const newProgress = Math.min(this.typingProgress + charsToAdd, this.content.length);
            this.displayedText = this.content.substring(0, newProgress);
            this.typingProgress = newProgress;
            this.lastTypingTime = now;
            
            if (this.typingProgress >= this.content.length) {
                this.isTyping = false;
                return true; // 打字完成
            }
        }
        
        return false;
    }
    
    // 跳过打字
    skipTyping() {
        this.displayedText = this.content;
        this.isTyping = false;
        this.typingProgress = this.content.length;
    }
    
    // 获取显示文本
    getDisplayText() {
        if (this.isTyping) {
            return this.displayedText;
        }
        return this.content;
    }
    
    // 是否正在打字
    getIsTyping() {
        return this.isTyping;
    }
    
    // 获取完整对话文本
    getFullText(gameData = null) {
        const name = this.getName(gameData);
        const thoughtPrefix = this.isThought ? '（内心）' : '';
        return `${name}${thoughtPrefix}: ${this.content}`;
    }
}