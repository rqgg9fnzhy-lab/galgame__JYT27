class GameData {
    constructor() {
        // 玩家信息
        this.playerName = '';
        this.playerGender = '';
        
        // 游戏状态
        this.loopCount = 1;
        this.loopPhase = 0;
        this.currentDay = 1;
        this.currentState = 'title';
        
        // 玩家属性
        this.sanity = 85;
        this.intuition = 30;
        this.courage = 40;
        this.logic = 35;
        
        // 好感度
        this.affections = {
            yutong: 0,      // 姜雨彤
            bingcheng: 0,   // 张秉诚
            zishuo: 0,      // 王梓硕
            yicheng: 0,     // 王翊丞
            haochen: 0,     // 姬昊辰
            yilin: 0,       // 房屹林
            linfeng: 0,     // 李林峰
            ziming: 0       // 侯子鸣
        };
        
        // 收集品
        this.cluesFound = new Array(20).fill(false);
        this.memoriesUnlocked = new Array(10).fill(false);
        this.secretLevel = 0;
        
        // 剧情标志
        this.hasMetYutong = false;
        this.hasMetAllKings = false;
        this.hasDiscoveredAnomaly = false;
        this.hasConfrontedYilin = false;
        this.knowsTimeLoop = false;
        
        // 结局点数
        this.romanticPoints = 0;
        this.tragedyPoints = 0;
        this.escapePoints = 0;
        
        // 游戏配置
        this.MAX_LOOPS = 15;
        this.PHASE_THRESHOLD = 5;
        
        // 保存标记
        this.lastSaveTime = Date.now();
    }
    
    // 重置游戏数据
    reset() {
        this.playerName = '';
        this.playerGender = '';
        
        this.loopCount = 1;
        this.loopPhase = 0;
        this.currentDay = 1;
        this.currentState = 'title';
        
        this.sanity = 85;
        this.intuition = 30;
        this.courage = 40;
        this.logic = 35;
        
        this.affections = {
            yutong: 0, bingcheng: 0, zishuo: 0,
            yicheng: 0, haochen: 0, yilin: 0,
            linfeng: 0, ziming: 0
        };
        
        this.cluesFound.fill(false);
        this.memoriesUnlocked.fill(false);
        this.secretLevel = 0;
        
        this.hasMetYutong = false;
        this.hasMetAllKings = false;
        this.hasDiscoveredAnomaly = false;
        this.hasConfrontedYilin = false;
        this.knowsTimeLoop = false;
        
        this.romanticPoints = 0;
        this.tragedyPoints = 0;
        this.escapePoints = 0;
        
        this.lastSaveTime = Date.now();
    }
    
    // 属性修改方法
    modifySanity(amount) {
        this.sanity = Math.max(0, Math.min(100, this.sanity + amount));
    }
    
    modifyIntuition(amount) {
        this.intuition = Math.max(0, Math.min(100, this.intuition + amount));
    }
    
    modifyCourage(amount) {
        this.courage = Math.max(0, Math.min(100, this.courage + amount));
    }
    
    modifyLogic(amount) {
        this.logic = Math.max(0, Math.min(100, this.logic + amount));
    }
    
    // 好感度修改
    modifyAffection(character, amount) {
        if (this.affections[character] !== undefined) {
            this.affections[character] += amount;
        }
    }
    
    // 获取好感度
    getAffection(character) {
        return this.affections[character] || 0;
    }
    
    // 获取好感度等级
    getAffectionLevel(character) {
        const value = this.getAffection(character);
        if (value >= 80) return '❤亲密';
        if (value >= 60) return '✓友好';
        if (value >= 40) return '○普通';
        if (value >= 20) return '△认识';
        return '×陌生';
    }
    
    // 阶段检查
    checkPhaseTransition() {
        if (this.loopCount >= this.PHASE_THRESHOLD && this.loopPhase === 0) {
            this.loopPhase = 1;
            this.hasDiscoveredAnomaly = true;
        }
    }
    
    // 获取状态文本
    getStatusText() {
        let text = `第${this.loopCount}次循环`;
        if (this.loopPhase === 1) text += '【悬疑】';
        text += `\n理智: ${this.sanity}/100`;
        text += `\n直觉: ${this.intuition}/100`;
        text += `\n勇气: ${this.courage}/100`;
        text += `\n逻辑: ${this.logic}/100`;
        return text;
    }
    
    // 获取关系文本
    getRelationshipText() {
        let text = '人物关系:\n';
        
        if (this.affections.yutong > 0) 
            text += `姜雨彤: ${this.getAffectionLevel('yutong')}\n`;
        if (this.affections.bingcheng > 0) 
            text += `张秉诚: ${this.getAffectionLevel('bingcheng')}\n`;
        if (this.affections.zishuo > 0) 
            text += `王梓硕: ${this.getAffectionLevel('zishuo')}\n`;
        if (this.affections.yicheng > 0) 
            text += `王翊丞: ${this.getAffectionLevel('yicheng')}\n`;
        if (this.affections.haochen > 0) 
            text += `姬昊辰: ${this.getAffectionLevel('haochen')}\n`;
        if (this.affections.yilin > 0) 
            text += `房屹林: ${this.getAffectionLevel('yilin')}\n`;
        if (this.affections.linfeng > 0) 
            text += `李林峰: ${this.getAffectionLevel('linfeng')}\n`;
        if (this.affections.ziming > 0) 
            text += `侯子鸣: ${this.getAffectionLevel('ziming')}`;
        
        return text.trim();
    }
    
    // 获取收集进度
    getCollectionText() {
        const cluesCount = this.cluesFound.filter(found => found).length;
        const memoriesCount = this.memoriesUnlocked.filter(unlocked => unlocked).length;
        
        let text = '收集进度:\n';
        text += `线索: ${cluesCount}/20\n`;
        text += `记忆: ${memoriesCount}/10\n`;
        text += `秘密等级: ${this.secretLevel}/5`;
        
        return text;
    }
    
    // 结局判定
    determineEnding() {
        if (this.loopCount >= this.MAX_LOOPS) {
            return 'eternal';
        }
        
        if (this.romanticPoints >= 8 && this.affections.yutong >= 80) {
            return 'romantic';
        }
        
        if (this.tragedyPoints >= 8 || this.sanity <= 20) {
            return 'tragic';
        }
        
        if (this.escapePoints >= 8 && this.knowsTimeLoop) {
            return 'escape';
        }
        
        if (this.sanity <= 10) {
            return 'nightmare';
        }
        
        return 'eternal';
    }
    
    // 保存到LocalStorage
    save() {
        const saveData = {
            playerName: this.playerName,
            playerGender: this.playerGender,
            loopCount: this.loopCount,
            loopPhase: this.loopPhase,
            currentDay: this.currentDay,
            currentState: this.currentState,
            attributes: {
                sanity: this.sanity,
                intuition: this.intuition,
                courage: this.courage,
                logic: this.logic
            },
            affections: { ...this.affections },
            cluesFound: [...this.cluesFound],
            memoriesUnlocked: [...this.memoriesUnlocked],
            secretLevel: this.secretLevel,
            flags: {
                hasMetYutong: this.hasMetYutong,
                hasMetAllKings: this.hasMetAllKings,
                hasDiscoveredAnomaly: this.hasDiscoveredAnomaly,
                hasConfrontedYilin: this.hasConfrontedYilin,
                knowsTimeLoop: this.knowsTimeLoop
            },
            points: {
                romantic: this.romanticPoints,
                tragedy: this.tragedyPoints,
                escape: this.escapePoints
            },
            saveTime: Date.now()
        };
        
        try {
            localStorage.setItem('timeLoopGameSave', JSON.stringify(saveData));
            this.lastSaveTime = Date.now();
            return true;
        } catch (error) {
            console.error('保存游戏失败:', error);
            return false;
        }
    }
    
    // 从LocalStorage加载
    load() {
        try {
            const saveData = localStorage.getItem('timeLoopGameSave');
            if (!saveData) return false;
            
            const data = JSON.parse(saveData);
            
            this.playerName = data.playerName;
            this.playerGender = data.playerGender;
            this.loopCount = data.loopCount;
            this.loopPhase = data.loopPhase;
            this.currentDay = data.currentDay;
            this.currentState = data.currentState;
            
            // 属性
            const attr = data.attributes;
            this.sanity = attr.sanity;
            this.intuition = attr.intuition;
            this.courage = attr.courage;
            this.logic = attr.logic;
            
            // 好感度
            this.affections = { ...data.affections };
            
            // 收集品
            this.cluesFound = [...data.cluesFound];
            this.memoriesUnlocked = [...data.memoriesUnlocked];
            this.secretLevel = data.secretLevel;
            
            // 剧情标志
            const flags = data.flags;
            this.hasMetYutong = flags.hasMetYutong;
            this.hasMetAllKings = flags.hasMetAllKings;
            this.hasDiscoveredAnomaly = flags.hasDiscoveredAnomaly;
            this.hasConfrontedYilin = flags.hasConfrontedYilin;
            this.knowsTimeLoop = flags.knowsTimeLoop;
            
            // 点数
            const points = data.points;
            this.romanticPoints = points.romantic;
            this.tragedyPoints = points.tragedy;
            this.escapePoints = points.escape;
            
            this.lastSaveTime = data.saveTime;
            
            return true;
        } catch (error) {
            console.error('加载游戏失败:', error);
            return false;
        }
    }
    
    // 删除存档
    deleteSave() {
        localStorage.removeItem('timeLoopGameSave');
    }
}